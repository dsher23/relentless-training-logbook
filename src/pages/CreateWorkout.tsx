import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import NavigationHeader from "@/components/NavigationHeader";

const CreateWorkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addWorkoutTemplate } = useAppContext();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) {
      setWorkoutName(name);
      console.log("Prefilled workout name from query parameter:", name);
    }
  }, [searchParams]);

  const handleSaveWorkout = () => {
    if (!workoutName) {
      toast({
        title: "Error",
        description: "Workout name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newTemplate = {
        id: uuidv4(),
        name: workoutName,
        exercises,
        isFavorite: false,
      };
      console.log("Saving new workout template:", newTemplate);
      addWorkoutTemplate(newTemplate);
      toast({
        title: "Template Saved",
        description: "Your workout template has been saved successfully.",
      });
      navigate("/workouts");
    } catch (error) {
      console.error("Error saving workout template:", error);
      toast({
        title: "Error",
        description: "Failed to save the workout template. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Create Workout" showBack={true} showHome={true} showProfile={false} />
      <div className="px-4 pt-4">
        <div className="mb-4">
          <label className="block text-sm text-muted-foreground">Workout Name</label>
          <Input
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Enter workout name"
            className="mt-1"
          />
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <Button onClick={() => navigate("/workouts")} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSaveWorkout}>Save Workout</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkout;
