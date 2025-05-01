import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavigationHeader from "@/components/NavigationHeader";

const EditExercise: React.FC = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState({
    id: exerciseId,
    name: "Existing Exercise", // Replace with actual exercise data
    sets: 3,
    reps: 10,
  });

  const handleSave = () => {
    // Logic to update the exercise in the workout (e.g., update in AppContext or local state)
    console.log("Updated exercise:", exercise);
    navigate("/workouts/builder");
  };

  return (
    <div className="p-4">
      <NavigationHeader title="Edit Exercise" showBack={true} />
      <div className="mt-4">
        <label className="block">Exercise Name</label>
        <Input
          type="text"
          value={exercise.name}
          onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
          className="border p-2 w-full"
        />
        <label className="block mt-2">Sets</label>
        <Input
          type="number"
          value={exercise.sets}
          onChange={(e) => setExercise({ ...exercise, sets: parseInt(e.target.value) })}
          className="border p-2 w-full"
        />
        <label className="block mt-2">Reps</label>
        <Input
          type="number"
          value={exercise.reps}
          onChange={(e) => setExercise({ ...exercise, reps: parseInt(e.target.value) })}
          className="border p-2 w-full"
        />
        <div className="mt-4">
          <Button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Exercise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditExercise;
