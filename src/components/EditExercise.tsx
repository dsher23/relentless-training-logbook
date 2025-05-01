
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationHeader from "@/components/NavigationHeader";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

const EditExercise: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { exercise: initialExercise, selectedExercises } = location.state || {};
  const [isSaving, setIsSaving] = useState(false);
  
  // Create a copy of the exercise to avoid mutating the original
  const [exercise, setExercise] = useState(initialExercise || {
    id: exerciseId,
    name: "",
    sets: 3,
    reps: 10,
    weight: 0,
    restTime: 60,
    category: "other",
    prExerciseType: "",
    notes: "",
  });

  useEffect(() => {
    if (!initialExercise || !selectedExercises) {
      console.error("Missing exercise data in navigation state");
      toast({
        title: "Error",
        description: "Exercise data not found. Redirecting back.",
        variant: "destructive",
      });
      navigate("/workouts/builder");
    }
  }, [initialExercise, selectedExercises, navigate, toast]);

  const handleSave = () => {
    if (!exercise.name) {
      toast({
        title: "Error",
        description: "Exercise name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update the exercise in selectedExercises
      const updatedExercises = selectedExercises.map((ex: any) =>
        ex.id === exerciseId ? exercise : ex
      );
      console.log("Updated exercises:", updatedExercises);
      
      // Navigate back to WorkoutBuilder with updated exercises
      navigate("/workouts/builder", { 
        state: { 
          selectedExercises: updatedExercises,
          exerciseUpdated: true
        } 
      });
      toast({
        title: "Exercise Updated",
        description: `${exercise.name} has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast({
        title: "Error",
        description: "Failed to update the exercise. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/workouts/builder");
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Edit Exercise" showBack={true} />
      
      <div className="px-4 pt-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Edit Exercise Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input
                id="exercise-name"
                value={exercise.name}
                onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
                placeholder="Enter exercise name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="exercise-category">Category</Label>
              <Input
                id="exercise-category"
                value={exercise.category}
                onChange={(e) => setExercise({ ...exercise, category: e.target.value })}
                placeholder="e.g., upper, lower, cardio"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="exercise-sets">Sets</Label>
              <Input
                id="exercise-sets"
                type="number"
                value={exercise.sets}
                onChange={(e) => setExercise({ ...exercise, sets: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="exercise-reps">Reps</Label>
              <Input
                id="exercise-reps"
                type="number"
                value={exercise.reps}
                onChange={(e) => setExercise({ ...exercise, reps: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="exercise-weight">Weight (kg/lb)</Label>
              <Input
                id="exercise-weight"
                type="number"
                value={exercise.weight}
                onChange={(e) => setExercise({ ...exercise, weight: parseFloat(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="exercise-rest">Rest Time (seconds)</Label>
              <Input
                id="exercise-rest"
                type="number"
                value={exercise.restTime}
                onChange={(e) => setExercise({ ...exercise, restTime: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              <Button 
                onClick={handleSave} 
                className="bg-gym-blue hover:bg-gym-blue/90"
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Exercise"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditExercise;
