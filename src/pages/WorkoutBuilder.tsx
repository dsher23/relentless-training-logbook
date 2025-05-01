import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Save, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

const SortableExerciseItem: React.FC<{
  exercise: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ exercise, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center space-x-2 mb-2 p-2 border rounded">
      <div {...attributes} {...listeners} className="cursor-move">
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{exercise.name}</p>
        <p className="text-sm text-muted-foreground">{exercise.category}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onEdit(exercise.id)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDelete(exercise.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

const WorkoutBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTemplate = searchParams.get("isTemplate") === "true";
  const { toast } = useToast();
  const {
    workoutTemplates,
    exercises,
    addExercise,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
  } = useAppContext();

  const [workout, setWorkout] = useState<any>(null);
  const [customExerciseName, setCustomExerciseName] = useState("");
  const [customExerciseCategory, setCustomExerciseCategory] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      console.error("Workout ID is missing");
      toast({
        title: "Error",
        description: "Workout ID is missing.",
        variant: "destructive",
      });
      navigate("/workouts");
      return;
    }

    const loadWorkout = async () => {
      setIsLoading(true);
      try {
        console.log("Loading workout with ID:", id, "isTemplate:", isTemplate);
        console.log("Attempting to load workout with ID:", id);

        const template = workoutTemplates.find(t => t.id === id);
        if (!template) {
          throw new Error(`Template with ID ${id} not found`);
        }

        console.log("Workout template found:", template);
        setWorkout(template);
        console.log("WorkoutBuilder: Workout loaded successfully", template);
      } catch (err: any) {
        console.error("Error loading workout:", err.message);
        setError(`Failed to load workout: ${err.message}`);
        toast({
          title: "Error",
          description: `Failed to load workout: ${err.message}`,
          variant: "destructive",
        });
        navigate("/workouts");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, [id, isTemplate, workoutTemplates, navigate, toast]);

  const handleAddCustomExercise = () => {
    if (!customExerciseName || !customExerciseCategory) {
      toast({
        title: "Error",
        description: "Please provide a name and category for the custom exercise.",
        variant: "destructive",
      });
      return;
    }

    const newExercise = {
      id: `custom-${Date.now()}`,
      name: customExerciseName,
      category: customExerciseCategory,
      sets: 1,
      reps: 0,
      weight: 0,
    };

    // Add the custom exercise to the global exercises list
    addExercise(newExercise);

    // Automatically add the new exercise to the workout
    setWorkout((prev: any) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));

    // Reset form
    setCustomExerciseName("");
    setCustomExerciseCategory("");
    toast({
      title: "Success",
      description: `${newExercise.name} added to the workout.`,
    });
  };

  const handleAddExerciseToWorkout = () => {
    if (!selectedExerciseId) {
      toast({
        title: "Error",
        description: "Please select an exercise to add.",
        variant: "destructive",
      });
      return;
    }

    const exerciseToAdd = exercises.find(ex => ex.id === selectedExerciseId);
    if (!exerciseToAdd) {
      toast({
        title: "Error",
        description: "Selected exercise not found.",
        variant: "destructive",
      });
      return;
    }

    setWorkout((prev: any) => ({
      ...prev,
      exercises: [...prev.exercises, { ...exerciseToAdd }],
    }));
    setSelectedExerciseId("");
    toast({
      title: "Success",
      description: `${exerciseToAdd.name} added to the workout.`,
    });
  };

  const handleEditExercise = (exerciseId: string) => {
    const exercise = workout.exercises.find((ex: any) => ex.id === exerciseId);
    if (!exercise) return;

    const newName = prompt("Enter new exercise name:", exercise.name);
    const newCategory = prompt("Enter new exercise category:", exercise.category);

    if (newName && newCategory) {
      setWorkout((prev: any) => ({
        ...prev,
        exercises: prev.exercises.map((ex: any) =>
          ex.id === exerciseId ? { ...ex, name: newName, category: newCategory } : ex
        ),
      }));
      toast({
        title: "Success",
        description: `${newName} updated successfully.`,
      });
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setWorkout((prev: any) => ({
      ...prev,
      exercises: prev.exercises.filter((ex: any) => ex.id !== exerciseId),
    }));
    toast({
      title: "Success",
      description: "Exercise removed from workout.",
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWorkout((prev: any) => {
        const oldIndex = prev.exercises.findIndex((ex: any) => ex.id === active.id);
        const newIndex = prev.exercises.findIndex((ex: any) => ex.id === over.id);
        const newExercises = arrayMove(prev.exercises, oldIndex, newIndex);
        return {
          ...prev,
          exercises: newExercises,
        };
      });
    }
  };

  const handleSaveWorkout = () => {
    if (!workout) return;

    updateWorkoutTemplate(workout);
    toast({
      title: "Success",
      description: "Workout template saved successfully.",
    });
    navigate("/workouts");
  };

  const handleDeleteWorkout = () => {
    if (!workout) return;

    if (window.confirm("Are you sure you want to delete this workout template?")) {
      deleteWorkoutTemplate(workout.id);
      toast({
        title: "Success",
        description: "Workout template deleted successfully.",
      });
      navigate("/workouts");
    }
  };

  if (isLoading) {
    return (
      <>
        <NavigationHeader title="Loading" showBack={true} />
        <div className="p-4 text-white">Loading workout...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationHeader title="Error" showBack={true} />
        <div className="p-4 text-white">
          <p>{error}</p>
          <Button onClick={() => navigate("/workouts")} className="mt-4">
            Back to Workouts
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Workout Builder" showBack={true} showHome={true} showProfile={false} />
      
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{workout.name}</h2>
          <Button variant="destructive" onClick={handleDeleteWorkout}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Workout
          </Button>
        </div>

        {/* Custom Exercise Form */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Add Custom Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-exercise-name">Exercise Name</Label>
                <Input
                  id="custom-exercise-name"
                  value={customExerciseName}
                  onChange={(e) => setCustomExerciseName(e.target.value)}
                  placeholder="e.g., Push-Up"
                />
              </div>
              <div>
                <Label htmlFor="custom-exercise-category">Category</Label>
                <Input
                  id="custom-exercise-category"
                  value={customExerciseCategory}
                  onChange={(e) => setCustomExerciseCategory(e.target.value)}
                  placeholder="e.g., upper"
                />
              </div>
              <Button onClick={handleAddCustomExercise}>
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Exercise
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Existing Exercise */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Add Existing Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="exercise-select">Select Exercise</Label>
                <select
                  id="exercise-select"
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select an exercise</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.category})
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddExerciseToWorkout}>
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workout Exercises List */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Exercises in Workout</CardTitle>
          </CardHeader>
          <CardContent>
            {workout.exercises.length === 0 ? (
              <p className="text-muted-foreground">No exercises added yet.</p>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={workout.exercises.map((ex: any) => ex.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {workout.exercises.map((exercise: any) => (
                    <SortableExerciseItem
                      key={exercise.id}
                      exercise={exercise}
                      onEdit={handleEditExercise}
                      onDelete={handleDeleteExercise}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSaveWorkout} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Workout
        </Button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
