import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Save, GripVertical, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import StartWorkoutButton from "@/components/StartWorkoutButton";

interface SortableExerciseItemProps {
  exercise: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SortableExerciseItem: React.FC<SortableExerciseItemProps> = ({ exercise, onEdit, onDelete }) => {
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
  const [loaded, setLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadWorkout = useCallback(async () => {
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

    setIsLoading(true);
    try {
      console.log("Loading workout with ID:", id, "isTemplate:", isTemplate);

      const template = workoutTemplates.find(t => t.id === id);
      if (!template) {
        throw new Error(`Template with ID ${id} not found`);
      }

      console.log("Workout template found:", template);
      setWorkout(template);
      console.log("WorkoutBuilder: Workout loaded successfully", template);
      setLoaded(true);
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
  }, [id, workoutTemplates, navigate, toast]);

  useEffect(() => {
    if (!loaded) {
      loadWorkout();
    }
  }, [loaded, loadWorkout]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError("Loading timeout: Unable to load workout.");
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Loading timeout: Unable to load workout.",
          variant: "destructive",
        });
        navigate("/workouts");
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isLoading, navigate, toast]);

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

    try {
      addExercise(newExercise);
  
      setWorkout((prev: any) => ({
        ...prev,
        exercises: [...prev.exercises, newExercise],
      }));
  
      // Auto-save the workout after adding exercise
      const updatedWorkout = {
        ...workout,
        exercises: [...(workout?.exercises || []), newExercise],
      };
      updateWorkoutTemplate(updatedWorkout);
  
      setCustomExerciseName("");
      setCustomExerciseCategory("");
      toast({
        title: "Success",
        description: `${newExercise.name} added to the workout.`,
      });
    } catch (error) {
      console.error("Error adding custom exercise:", error);
      toast({
        title: "Error",
        description: "Failed to add exercise. Please try again.",
        variant: "destructive",
      });
    }
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

    try {
      const exerciseToAdd = exercises.find(ex => ex.id === selectedExerciseId);
      if (!exerciseToAdd) {
        toast({
          title: "Error",
          description: "Selected exercise not found.",
          variant: "destructive",
        });
        return;
      }
  
      const updatedWorkout = {
        ...workout,
        exercises: [...(workout?.exercises || []), { ...exerciseToAdd }],
      };
  
      setWorkout(updatedWorkout);
      updateWorkoutTemplate(updatedWorkout);
      
      setSelectedExerciseId("");
      toast({
        title: "Success",
        description: `${exerciseToAdd.name} added to the workout.`,
      });
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
      toast({
        title: "Error",
        description: "Failed to add exercise. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditExercise = (exerciseId: string) => {
    const exercise = workout.exercises.find((ex: any) => ex.id === exerciseId);
    if (!exercise) return;

    // Navigate to the dedicated exercise edit page with exercise data
    navigate(`/workouts/builder/edit-exercise/${exerciseId}`, {
      state: {
        exercise,
        selectedExercises: workout.exercises,
      },
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    try {
      const updatedExercises = workout.exercises.filter((ex: any) => ex.id !== exerciseId);
      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises,
      };
      
      setWorkout(updatedWorkout);
      updateWorkoutTemplate(updatedWorkout);
      
      toast({
        title: "Success",
        description: "Exercise removed from workout.",
      });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast({
        title: "Error",
        description: "Failed to remove exercise. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      try {
        setWorkout((prev: any) => {
          const oldIndex = prev.exercises.findIndex((ex: any) => ex.id === active.id);
          const newIndex = prev.exercises.findIndex((ex: any) => ex.id === over.id);
          const newExercises = arrayMove(prev.exercises, oldIndex, newIndex);
          
          const updatedWorkout = {
            ...prev,
            exercises: newExercises,
          };
          
          // Auto-save the reordered workout
          updateWorkoutTemplate(updatedWorkout);
          
          return updatedWorkout;
        });
        
        toast({
          title: "Success",
          description: "Exercises reordered successfully.",
        });
      } catch (error) {
        console.error("Error reordering exercises:", error);
        toast({
          title: "Error",
          description: "Failed to reorder exercises. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveWorkout = () => {
    if (!workout) return;
    
    setIsSaving(true);

    try {
      updateWorkoutTemplate(workout);
      toast({
        title: "Success",
        description: "Workout template saved successfully.",
      });
      
      setTimeout(() => {
        setIsSaving(false);
        navigate("/workouts");
      }, 500);
    } catch (error) {
      console.error("Error saving workout:", error);
      setIsSaving(false);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorkout = () => {
    if (!workout) return;

    if (window.confirm("Are you sure you want to delete this workout template?")) {
      try {
        deleteWorkoutTemplate(workout.id);
        toast({
          title: "Success",
          description: "Workout template deleted successfully.",
        });
        navigate("/workouts");
      } catch (error) {
        console.error("Error deleting workout:", error);
        toast({
          title: "Error",
          description: "Failed to delete workout. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <NavigationHeader title="Loading" showBack={true} />
        <div className="p-4 flex items-center justify-center h-40">
          <div className="animate-pulse text-center">
            <div className="h-8 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
            <p className="text-muted-foreground">Loading workout...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationHeader title="Error" showBack={true} />
        <div className="p-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => navigate("/workouts")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
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
          <h2 className="text-2xl font-bold">{workout?.name || "Loading workout..."}</h2>
          <div className="flex gap-2">
            {workout && (
              <>
                <Button variant="destructive" onClick={handleDeleteWorkout}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <StartWorkoutButton workoutId={workout.id} isTemplate={true} />
              </>
            )}
          </div>
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
                  disabled={isSaving}
                />
              </div>
              <div>
                <Label htmlFor="custom-exercise-category">Category</Label>
                <Input
                  id="custom-exercise-category"
                  value={customExerciseCategory}
                  onChange={(e) => setCustomExerciseCategory(e.target.value)}
                  placeholder="e.g., upper"
                  disabled={isSaving}
                />
              </div>
              <Button onClick={handleAddCustomExercise} disabled={isSaving}>
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
                  className="w-full p-2 border rounded-md bg-background"
                  disabled={isSaving}
                >
                  <option value="">Select an exercise</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.category})
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddExerciseToWorkout} disabled={isSaving}>
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
            {workout && workout.exercises && workout.exercises.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No exercises added yet.</p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("custom-exercise-name")?.focus()}
                >
                  Add an Exercise
                </Button>
              </div>
            ) : workout ? (
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
            ) : (
              <p className="text-muted-foreground">Loading exercises...</p>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSaveWorkout} 
          className="w-full"
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Workout"}
        </Button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
