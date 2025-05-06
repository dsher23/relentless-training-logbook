import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";

interface Set {
  weight: number;
  reps: number;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: Set[];
}

interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

const WorkoutBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workoutTemplates, addWorkoutTemplate, setWorkoutTemplates } = useAppContext();
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const template = workoutTemplates.find((t: WorkoutTemplate) => t.id === id);
      if (template) {
        setName(template.name);
        setExercises(template.exercises);
      }
    }
    setIsLoading(false);
  }, [id, workoutTemplates]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      category: "",
      sets: [{ weight: 0, reps: 0 }], // Initialize with an array of Set objects
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push({ weight: 0, reps: 0 });
    setExercises(updatedExercises);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: "weight" | "reps", value: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex] = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    setExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.filter(
      (_: Set, i: number) => i !== setIndex
    );
    setExercises(updatedExercises);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Workout name is required.",
        variant: "destructive",
      });
      return;
    }

    if (exercises.length === 0 || exercises.some(ex => !ex.name.trim())) {
      toast({
        title: "Error",
        description: "Please add at least one exercise with a name.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const template: WorkoutTemplate = {
        id: id || Date.now().toString(),
        name: name.trim(),
        exercises,
      };
      if (id) {
        const updatedTemplates = workoutTemplates.map((t: WorkoutTemplate) =>
          t.id === id ? template : t
        );
        await setWorkoutTemplates(updatedTemplates);
      } else {
        await addWorkoutTemplate(template);
      }
      toast({
        title: "Success",
        description: "Workout template saved successfully.",
      });
      navigate("/workouts");
    } catch (error) {
      console.error("Error saving workout template:", error);
      toast({
        title: "Error",
        description: "Failed to save workout template.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <NavigationHeader title="Loading..." showBack={true} />
        <div className="p-4">Loading workout builder...</div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader
        title={id ? "Edit Workout Template" : "Build Workout Template"}
        showBack={true}
        showHome={true}
        showProfile={false}
      />
      <div className="px-4 pt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Workout Name</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workout name (e.g., Leg Day)"
            />
          </CardContent>
        </Card>

        {exercises.map((exercise, exerciseIndex) => (
          <Card key={exercise.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Exercise {exerciseIndex + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExercise(exerciseIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`exercise-name-${exerciseIndex}`}>Name</Label>
                <Input
                  id={`exercise-name-${exerciseIndex}`}
                  value={exercise.name}
                  onChange={(e) => updateExercise(exerciseIndex, "name", e.target.value)}
                  placeholder="e.g., Squat"
                />
              </div>
              <div>
                <Label htmlFor={`exercise-category-${exerciseIndex}`}>Category</Label>
                <Input
                  id={`exercise-category-${exerciseIndex}`}
                  value={exercise.category}
                  onChange={(e) => updateExercise(exerciseIndex, "category", e.target.value)}
                  placeholder="e.g., Strength"
                />
              </div>
              <div>
                <Label>Sets</Label>
                {exercise.sets.map((set: Set, setIndex: number) => (
                  <div key={setIndex} className="flex items-center gap-2 mt-2">
                    <div className="flex-1">
                      <Label htmlFor={`set-weight-${exerciseIndex}-${setIndex}`}>Weight</Label>
                      <Input
                        id={`set-weight-${exerciseIndex}-${setIndex}`}
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, "weight", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`set-reps-${exerciseIndex}-${setIndex}`}>Reps</Label>
                      <Input
                        id={`set-reps-${exerciseIndex}-${setIndex}`}
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, "reps", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSet(exerciseIndex, setIndex)}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => addSet(exerciseIndex)}
                  variant="secondary"
                  size="sm"
                  className="w-full mt-2"
                >
                  Add Set
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addExercise} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>

        <Button onClick={handleSave} className="w-full" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Template"}
        </Button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
