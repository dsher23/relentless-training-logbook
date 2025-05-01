import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";
import WorkoutBuilder from "./WorkoutBuilder";

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workoutTemplates } = useAppContext();

  const handleStartWorkout = (id: string) => {
    navigate(`/live-workout/${id}?isTemplate=true`);
  };

  const handleEditWorkout = (id: string) => {
    navigate(`/workouts/builder/${id}?isTemplate=true`);
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Workouts" showBack={false} showHome={true} showProfile={true} />
      
      <div className="px-4 pt-4">
        <Button
          onClick={() => navigate("/workouts/new")}
          className="w-full mb-4"
        >
          Create New Workout
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Workout Templates</CardTitle>
          </CardHeader>
          <CardContent>
            {workoutTemplates.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No workout templates available.</p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/workouts/new")}
                >
                  Create Your First Workout
                </Button>
              </div>
            ) : (
              workoutTemplates.map((template) => (
                <Card key={template.id} className="mb-2">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {template.exercises.length} exercises
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditWorkout(template.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStartWorkout(template.id)}
                      >
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Routes>
        <Route path="new" element={<NewWorkoutForm />} />
        <Route path="builder/:id" element={<WorkoutBuilder />} />
      </Routes>
    </div>
  );
};

const NewWorkoutForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addWorkoutTemplate } = useAppContext();

  const [workoutName, setWorkoutName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateWorkout = async () => {
    if (!workoutName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const newWorkout = {
        id: `workout-${Date.now()}`,
        name: workoutName,
        exercises: [],
        isFavorite: false,
      };

      console.log("Saving new workout template:", newWorkout);
      addWorkoutTemplate(newWorkout);

      toast({
        title: "Success",
        description: "Workout template created! Now add exercises.",
      });

      // Redirect to Workout Builder to add exercises
      setTimeout(() => {
        navigate(`/workouts/builder/${newWorkout.id}?isTemplate=true`);
      }, 500);
    } catch (error) {
      console.error("Error creating workout:", error);
      toast({
        title: "Error",
        description: "Failed to create workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    }
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Create New Workout" showBack={true} showHome={true} showProfile={false} />
      
      <div className="px-4 pt-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>New Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Chest Day"
                  disabled={isSaving}
                />
              </div>
              <Button 
                onClick={handleCreateWorkout} 
                disabled={isSaving} 
                className="w-full"
              >
                {isSaving ? "Creating..." : "Create Workout"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Workouts;
