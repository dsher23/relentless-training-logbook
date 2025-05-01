import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationHeader from "@/components/NavigationHeader";
import { useToast } from "@/hooks/use-toast";

const EditExercise: React.FC = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { exercise: initialExercise, selectedExercises } = location.state || {};
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
    if (!initialExercise) {
      toast({
        title: "Error",
        description: "Exercise data not found. Please try again.",
        variant: "destructive",
      });
      navigate("/workouts/builder");
    }
  }, [initialExercise, navigate, toast]);

  const handleSave = () => {
    if (!exercise.name) {
      toast({
        title: "Error",
        description: "Exercise name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update the exercise in selectedExercises
      const updatedExercises = selectedExercises.map((ex: any) =>
        ex.id === exerciseId ? exercise : ex
      );
      console.log("Updated exercises:", updatedExercises);
      
      // Navigate back to WorkoutBuilder with updated exercises
      navigate("/workouts/builder", { state: { selectedExercises: updatedExercises } });
      toast({
        title: "Exercise Updated",
        description: "Your exercise has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating exercise:", error);
      toast({
        title: "Error",
        description: "Failed to update the exercise. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4">
      <NavigationHeader title="Edit Exercise" showBack={true} />
      <div className="mt-4">
        <label className="block text-sm text-muted-foreground">Exercise Name</label>
        <Input
          type="text"
          value={exercise.name}
          onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
          className="mt-1"
        />
        <label className="block mt-2 text-sm text-muted-foreground">Sets</label>
        <Input
          type="number"
          value={exercise.sets}
          onChange={(e) => setExercise({ ...exercise, sets: parseInt(e.target.value) })}
          className="mt-1"
        />
        <label className="block mt-2 text-sm text-muted-foreground">Reps</label>
        <Input
          type="number"
          value={exercise.reps}
          onChange={(e) => setExercise({ ...exercise, reps: parseInt(e.target.value) })}
          className="mt-1"
        />
        <label className="block mt-2 text-sm text-muted-foreground">Weight (kg/lb)</label>
        <Input
          type="number"
          value={exercise.weight}
          onChange={(e) => setExercise({ ...exercise, weight: parseInt(e.target.value) })}
          className="mt-1"
        />
        <label className="block mt-2 text-sm text-muted-foreground">Rest Time (seconds)</label>
        <Input
          type="number"
          value={exercise.restTime}
          onChange={(e) => setExercise({ ...exercise, restTime: parseInt(e.target.value) })}
          className="mt-1"
        />
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={() => navigate("/workouts/builder")} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gym-blue hover:bg-gym-blue/90">
            Save Exercise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditExercise;
