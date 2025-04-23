import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import { WorkoutTemplate, Exercise, Workout } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Exercise item (sortable)
const ExerciseItem = ({
  exercise,
  index,
  moveExercise,
  onEdit,
  onDelete,
}: {
  exercise: Exercise;
  index: number;
  moveExercise: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: exercise.id,
    data: {
      index
    },
  });

  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: 1
  };

  return (
    <Card
      ref={setNodeRef}
      id={`exercise-${exercise.id}`}
      className="mb-2 cursor-move"
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardContent className="flex items-center justify-between p-3">
        <div>
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{exercise.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {exercise.sets.length} sets × {exercise.sets[0]?.reps ?? "-"} reps,{" "}
              {exercise.sets[0]?.weight ?? "-"} kg/lb
              {exercise.restTime ? `, ${exercise.restTime}s rest` : ""}
            </span>
          </div>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(exercise.id);
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(exercise.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Unified add/edit exercise form (inline, not modal)
const defaultExerciseFormState = {
  name: "",
  sets: 3,
  reps: 10,
  weight: 0,
  restTime: "",
};

const WorkoutBuilder: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addWorkoutTemplate, updateWorkoutTemplate, workoutTemplates, workouts, updateWorkout } = useAppContext();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState(location.state?.workoutName || "");
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({ ...defaultExerciseFormState });
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegularWorkout, setIsRegularWorkout] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load workout for editing
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    // First check if it's a regular workout
    const regularWorkout = workouts.find(w => w.id === id);
    if (regularWorkout) {
      setWorkoutName(regularWorkout.name);
      setExercises(regularWorkout.exercises);
      setIsRegularWorkout(true);
      setIsLoading(false);
      return;
    }

    // Then check if it's a workout template
    const workoutTemplate = workoutTemplates.find(template => template.id === id);
    if (workoutTemplate) {
      setWorkoutName(workoutTemplate.name);
      setExercises(workoutTemplate.exercises);
      setIsLoading(false);
    } else {
      setLoadError("The workout you're trying to edit could not be found.");
      toast({
        title: "Workout not found",
        description: "The workout you're trying to edit does not exist.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [id, workoutTemplates, workouts, toast]);

  const { startAfterCreation } = location.state || {};

  // ----- Exercise Form Handlers -----

  // Initialize form for edit/create
  const openExerciseForm = (exercise?: Exercise) => {
    if (exercise) {
      setExerciseForm({
        name: exercise.name,
        sets: exercise.sets.length,
        reps: exercise.sets[0]?.reps ?? 10,
        weight: exercise.sets[0]?.weight ?? 0,
        restTime: exercise.restTime ? exercise.restTime.toString() : "",
      });
      setEditingExerciseId(exercise.id);
    } else {
      setExerciseForm({ ...defaultExerciseFormState });
      setEditingExerciseId(null);
    }
    setShowExerciseForm(true);
  };

  // Add new exercise
  const handleAddExercise = () => {
    if (!exerciseForm.name.trim()) {
      toast({
        title: "Exercise name required",
        description: "Please provide a name for the exercise.",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      id: uuidv4(),
      name: exerciseForm.name.trim(),
      sets: Array(Number(exerciseForm.sets)).fill({
        reps: Number(exerciseForm.reps),
        weight: Number(exerciseForm.weight)
      }),
      restTime: exerciseForm.restTime ? parseInt(exerciseForm.restTime) : undefined,
      lastProgressDate: new Date(),
    };

    setExercises([...exercises, newExercise]);
    setExerciseForm({ ...defaultExerciseFormState });
    setShowExerciseForm(false);
  };

  // Start editing exercise
  const handleEditExercise = (id: string) => {
    const exerciseToEdit = exercises.find((exercise) => exercise.id === id);
    if (exerciseToEdit) {
      openExerciseForm(exerciseToEdit);
    }
  };

  // Update existing exercise
  const handleUpdateExercise = () => {
    if (!exerciseForm.name.trim()) {
      toast({
        title: "Exercise name required",
        description: "Please provide a name for the exercise.",
        variant: "destructive",
      });
      return;
    }

    setExercises(exercises.map((exercise) =>
      exercise.id === editingExerciseId
        ? {
            ...exercise,
            name: exerciseForm.name.trim(),
            sets: Array(Number(exerciseForm.sets)).fill({
              reps: Number(exerciseForm.reps),
              weight: Number(exerciseForm.weight)
            }),
            restTime: exerciseForm.restTime ? parseInt(exerciseForm.restTime) : undefined
          }
        : exercise
    ));

    setExerciseForm({ ...defaultExerciseFormState });
    setEditingExerciseId(null);
    setShowExerciseForm(false);
  };

  // Delete prompt
  const promptDeleteExercise = (id: string) => {
    setExerciseToDelete(id);
    setConfirmDeleteExercise(true);
  };

  // Delete execution
  const handleDeleteExercise = () => {
    if (!exerciseToDelete) return;
    setExercises(exercises.filter((exercise) => exercise.id !== exerciseToDelete));
    setConfirmDeleteExercise(false);
    setExerciseToDelete(null);

    toast({
      title: "Exercise deleted",
      description: "The exercise has been removed from this workout."
    });
  };

  // DND handlers
  const moveExercise = (dragIndex: number, hoverIndex: number) => {
    setExercises((items) => arrayMove(items, dragIndex, hoverIndex));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setExercises((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Cancel workflow
  const handleCancelClick = () => {
    if (exercises.length > 0 || workoutName.trim() !== "") {
      setConfirmCancel(true);
    } else {
      navigate("/workouts");
    }
  };

  // Complete/save workout with support for both templates and regular workouts
  const handleComplete = () => {
    if (!workoutName) {
      toast({
        title: "Error",
        description: "Please enter a workout name.",
        variant: "destructive",
      });
      return;
    }

    if (exercises.length === 0) {
      toast({
        title: "Cannot create workout",
        description: "Please add at least one exercise to your workout.",
        variant: "destructive",
      });
      return;
    }

    try {
      const workoutId = id || uuidv4();

      if (isRegularWorkout) {
        // Update a regular workout
        const updatedWorkout: Workout = {
          ...workouts.find(w => w.id === id)!,
          id: workoutId,
          name: workoutName,
          exercises: exercises
        };
        
        updateWorkout(updatedWorkout);
        
        toast({
          title: "Success",
          description: "Your workout has been updated successfully.",
        });
        
        navigate(`/workouts/${workoutId}`);
      } else {
        // Handle workout template
        const newWorkoutTemplate: WorkoutTemplate = {
          id: workoutId,
          name: workoutName,
          exercises: exercises,
          isFavorite: false,
        };

        if (id) {
          updateWorkoutTemplate(newWorkoutTemplate);
        } else {
          addWorkoutTemplate(newWorkoutTemplate);
        }

        toast({
          title: "Success",
          description: "Your workout has been saved successfully.",
        });

        if (startAfterCreation) {
          navigate(`/live-workout/${workoutId}?isTemplate=true`);
        } else {
          navigate("/workouts");
        }
      }
    } catch (error) {
      console.error("Error creating workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Loading Workout..." />
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Error" />
        <div className="p-4 text-center">
          <p className="mb-4 text-destructive">{loadError}</p>
          <Button onClick={() => navigate("/workouts")}>
            Return to Workouts
          </Button>
        </div>
      </div>
    );
  }

  // --- UI ---
  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <div className="app-container animate-fade-in">
        <Header title={id ? "Edit Workout" : "Create Workout"} />

        <div className="p-4">
          <Input
            type="text"
            placeholder="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="mb-4"
          />

          {/* Exercises Section */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Exercises</h2>
                <Button size="sm" onClick={() => openExerciseForm()}>
                  <Plus className="h-4 w-4 mr-2" /> Add Exercise
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Form inline */}
          {showExerciseForm && (
            <Card className="mb-4">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ex-name">Exercise Name *</Label>
                    <Input
                      id="ex-name"
                      value={exerciseForm.name}
                      onChange={(e) =>
                        setExerciseForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="e.g., Bench Press"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ex-sets">Sets</Label>
                    <Input
                      id="ex-sets"
                      type="number"
                      min={1}
                      max={99}
                      value={exerciseForm.sets}
                      onChange={(e) =>
                        setExerciseForm((f) => ({
                          ...f,
                          sets: Math.max(1, parseInt(e.target.value) || 1),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ex-reps">Reps per Set</Label>
                    <Input
                      id="ex-reps"
                      type="number"
                      min={1}
                      max={200}
                      value={exerciseForm.reps}
                      onChange={(e) =>
                        setExerciseForm((f) => ({
                          ...f,
                          reps: Math.max(1, parseInt(e.target.value) || 1),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ex-weight">Weight (kg/lb)</Label>
                    <Input
                      id="ex-weight"
                      type="number"
                      min={0}
                      step={0.1}
                      value={exerciseForm.weight}
                      onChange={(e) =>
                        setExerciseForm((f) => ({
                          ...f,
                          weight: Number(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ex-rest">Rest Time (seconds, optional)</Label>
                    <Input
                      id="ex-rest"
                      type="number"
                      min={0}
                      step={5}
                      value={exerciseForm.restTime}
                      onChange={(e) =>
                        setExerciseForm((f) => ({
                          ...f,
                          restTime: e.target.value,
                        }))
                      }
                      placeholder="e.g., 90"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowExerciseForm(false);
                      setExerciseForm({ ...defaultExerciseFormState });
                      setEditingExerciseId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingExerciseId ? handleUpdateExercise : handleAddExercise}
                  >
                    {editingExerciseId ? "Update Exercise" : "Add Exercise"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show Exercises List for review/edit */}
          {exercises.length === 0 ? (
            <Card>
              <CardContent className="text-center p-5">
                No exercises added yet. Click "Add Exercise" to start building
                your workout.
              </CardContent>
            </Card>
          ) : (
            <SortableContext
              items={exercises.map(exercise => exercise.id)}
              strategy={verticalListSortingStrategy}
            >
              {exercises.map((exercise, index) => (
                <ExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  moveExercise={moveExercise}
                  onEdit={handleEditExercise}
                  onDelete={promptDeleteExercise}
                />
              ))}
            </SortableContext>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>
              {isRegularWorkout ? "Update Workout" : (startAfterCreation ? "Save and Start Workout" : "Save Workout")}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirm Delete Exercise Dialog */}
      <Dialog open={confirmDeleteExercise} onOpenChange={setConfirmDeleteExercise}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exercise</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this exercise? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteExercise(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteExercise}>
              Delete Exercise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Cancel Dialog */}
      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Workout Creation</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to cancel?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmCancel(false)}>
              Continue Editing
            </Button>
            <Button variant="destructive" onClick={() => navigate("/workouts")}>
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
};

export default WorkoutBuilder;
