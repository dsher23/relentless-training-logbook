
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const AddExerciseForm: React.FC<{ exerciseId?: string; onClose: () => void }> = ({ exerciseId, onClose }) => {
  const { exercises, addExercise, updateExercise } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"upper" | "lower" | "core" | "other">("upper");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If editing an existing exercise, load its data
  useEffect(() => {
    if (exerciseId) {
      const exercise = exercises.find((e) => e.id === exerciseId);
      if (exercise) {
        setName(exercise.name);
        setCategory(exercise.category);
        setSets(JSON.stringify(exercise.sets)); // Convert sets array to string for display
        setReps(exercise.reps.toString());
      }
    }
  }, [exerciseId, exercises]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !sets || !reps) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const setsArray = JSON.parse(sets); // Parse sets string back to array
      if (!Array.isArray(setsArray)) {
        throw new Error("Sets must be a valid JSON array (e.g., [{reps: 10, weight: 50}])");
      }

      const exerciseData = {
        name,
        category,
        sets: setsArray,
        reps: Number(reps),
      };

      if (exerciseId) {
        await updateExercise(exerciseId, { ...exerciseData, id: exerciseId });
        toast({
          title: "Success",
          description: "Exercise updated successfully.",
        });
      } else {
        await addExercise(exerciseData);
        toast({
          title: "Success",
          description: "Exercise added successfully.",
        });
      }
      onClose();
    } catch (error) {
      console.error("AddExerciseForm.tsx: Error saving exercise:", error);
      toast({
        title: "Error",
        description: "Failed to save exercise. Ensure sets is a valid JSON array.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{exerciseId ? "Edit Exercise" : "Add Exercise"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter exercise name"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value: "upper" | "lower" | "core" | "other") => setCategory(value)} value={category}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upper">Upper Body</SelectItem>
                <SelectItem value="lower">Lower Body</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sets">Sets (JSON format, e.g., {"[{\"reps\": 10, \"weight\": 50}]"})</Label>
            <Input
              id="sets"
              type="text"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder='[{ "reps": 10, "weight": 50 }]'
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="reps">Default Reps</Label>
            <Input
              id="reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Enter default reps"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : exerciseId ? "Update Exercise" : "Add Exercise"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddExerciseForm;
