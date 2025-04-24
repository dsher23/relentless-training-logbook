import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Plus, Edit, Trash2, GripVertical, ArrowLeft, Trophy } from "lucide-react";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import { WorkoutTemplate, Exercise, Workout } from "@/types";
import AddExerciseForm from "@/components/AddExerciseForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkoutLoader } from "@/hooks/useWorkoutLoader";

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

  const getPRExerciseName = (prType: string | undefined) => {
    if (!prType) return null;
    
    const CORE_LIFTS = [
      { id: "bench-press", name: "Bench Press" },
      { id: "deadlift", name: "Deadlift" },
      { id: "squat", name: "Squat" },
      { id: "shoulder-press", name: "Shoulder Press" },
      { id: "custom", name: "Custom Exercise" },
    ];
    
    return CORE_LIFTS.find(lift => lift.id === prType)?.name || "Custom PR";
  };
  
  const prExerciseName = getPRExerciseName(exercise.prExerciseType);

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
            {exercise.prExerciseType && (
              <div className="flex items-center" title={`${prExerciseName} PR`}>
                <Trophy className="h-3 w-3 text-yellow-500" />
              </div>
            )}
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

const WorkoutBuilder: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { addWorkoutTemplate, updateWorkoutTemplate, workoutTemplates, workouts, updateWorkout, getWorkoutById } = useAppContext();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState(location.state?.workoutName || "");
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>(undefined);
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegularWorkout, setIsRegularWorkout] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const { workout: loadedWorkout, isTemplate } = useWorkoutLoader(id);
  
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    
    if (loadedWorkout && loadedWorkout.id) {
      console.log("WorkoutBuilder: Workout loaded successfully", loadedWorkout);
      setWorkoutName(loadedWorkout.name);
      setExercises(loadedWorkout.exercises);
      setIsRegularWorkout(!isTemplate);
      setIsLoading(false);
      return;
    }
    
    if (!isLoading && !loadedWorkout) {
      console.error("WorkoutBuilder: Failed to load workout", id);
      setLoadError("The workout you're trying to edit could not be found.");
      toast({
        title: "Workout not found",
        description: "The workout you're trying to edit does not exist.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [id, loadedWorkout, isTemplate, isLoading, toast]);

  const { startAfterCreation } = location.state || {};

  const handleAddExerciseClick = () => {
    setEditingExercise(undefined);
    setShowExerciseForm(true);
  };

  const handleSaveExercise = (exercise: Exercise) => {
    if (editingExercise) {
      setExercises(exercises.map(ex => 
        ex.id === exercise.id ? exercise : ex
      ));
    } else {
      setExercises([...exercises, exercise]);
    }
    setShowExerciseForm(false);
    setEditingExercise(undefined);
  };

  const handleEditExercise = (id: string) => {
    const exercise = exercises.find(ex => ex.id === id);
    if (exercise) {
      setEditingExercise(exercise);
      setShowExerciseForm(true);
    }
  };

  const promptDeleteExercise = (id: string) => {
    setExerciseToDelete(id);
    setConfirmDeleteExercise(true);
  };

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

  const handleCancelClick = () => {
    if (exercises.length > 0 || workoutName.trim() !== "") {
      setConfirmCancel(true);
    } else {
      navigate("/workouts");
    }
  };

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
        const originalWorkout = id ? getWorkoutById(id) : null;
        
        const updatedWorkout: Workout = {
          ...(originalWorkout || {}),
          id: workoutId,
          name: workoutName,
          exercises: exercises,
          date: originalWorkout?.date || new Date(),
          completed: originalWorkout?.completed || false,
          notes: originalWorkout?.notes || "",
        };
        
        updateWorkout(updatedWorkout);
        
        toast({
          title: "Success",
          description: "Your workout has been updated successfully.",
        });
        
        navigate(`/workouts/${workoutId}`);
      } else {
        const originalTemplate = id ? workoutTemplates.find(t => t.id === id) : null;
        
        const newWorkoutTemplate: WorkoutTemplate = {
          ...(originalTemplate || {}),
          id: workoutId,
          name: workoutName,
          exercises: exercises,
          isFavorite: originalTemplate?.isFavorite || false,
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

  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Loading Workout...">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Header>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Error">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Header>
        <div className="p-4 text-center">
          <p className="mb-4 text-destructive">{loadError}</p>
          <Button onClick={() => navigate("/workouts")}>
            Return to Workouts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      <div className="app-container animate-fade-in">
        <Header title={id ? "Edit Workout" : "Create Workout"}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Header>

        <div className="p-4">
          <input
            type="text"
            placeholder="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Exercises</h2>
                <Button size="sm" onClick={handleAddExerciseClick}>
                  <Plus className="h-4 w-4 mr-2" /> Add Exercise
                </Button>
              </div>
            </CardContent>
          </Card>

          {showExerciseForm && (
            <AddExerciseForm
              isOpen={showExerciseForm}
              onClose={() => setShowExerciseForm(false)}
              onSave={handleSaveExercise}
              exercise={editingExercise}
            />
          )}

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
