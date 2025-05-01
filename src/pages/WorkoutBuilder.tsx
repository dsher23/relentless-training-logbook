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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkoutLoader } from "@/hooks/useWorkoutLoader";
import StartWorkoutButton from "@/components/StartWorkoutButton";

const ExerciseItem = ({
  exercise,
  index,
  onEdit,
  onDelete,
}: {
  exercise: Exercise;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: exercise.id,
    data: { index },
  });

  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: 1,
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
      className="mb-3 cursor-move bg-secondary/80 border-border/30 shadow"
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardContent className="flex items-center justify-between p-3">
        <div>
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-white">{exercise.name}</span>
            {exercise.prExerciseType && (
              <div className="flex items-center" title={`${prExerciseName} PR`}>
                <Trophy className="h-3.5 w-3.5 text-yellow-500" />
              </div>
            )}
            <span className="ml-2 text-xs text-muted-foreground">
              {Array.isArray(exercise.sets) ? exercise.sets.length : exercise.sets} sets × {exercise.reps} reps, {exercise.weight || "-"} kg/lb
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
  const { addWorkoutTemplate, updateWorkoutTemplate, workoutTemplates, workouts, updateWorkout, getWorkoutById, exercises } = useAppContext();
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState(location.state?.workoutName || "");
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>(undefined);
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegularWorkout, setIsRegularWorkout] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  const { workout: loadedWorkout, isTemplate } = useWorkoutLoader(id);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    if (loadedWorkout && loadedWorkout.id) {
      console.log("WorkoutBuilder: Workout loaded successfully", loadedWorkout);
      setWorkoutName(loadedWorkout.name);
      setSelectedExercises(loadedWorkout.exercises || []);
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
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [id, loadedWorkout, isTemplate, isLoading, toast]);

  const { startAfterCreation } = location.state || {};

  const handleAddExerciseClick = () => {
    setEditingExercise(undefined);
    setShowExerciseForm(true);
  };

  const handleSelectExercise = () => {
    if (selectedExerciseId) {
      const exercise = exercises.find(ex => ex.id === selectedExerciseId);
      if (exercise) {
        const exerciseCopy = { 
          ...exercise, 
          id: uuidv4(),
          sets: Array.isArray(exercise.sets) ? 
            [...exercise.sets] : 
            Array(3).fill({ reps: exercise.reps || 10, weight: exercise.weight || 0 }) 
        };
        
        setSelectedExercises([...selectedExercises, exerciseCopy]);
        setSelectedExerciseId("");
      }
    }
  };

  const handleSaveExercise = (exercise: Exercise) => {
    if (editingExercise) {
      setSelectedExercises(selectedExercises.map(ex => 
        ex.id === exercise.id ? exercise : ex
      ));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
    setShowExerciseForm(false);
    setEditingExercise(undefined);
  };

  const handleEditExercise = (id: string) => {
    const exercise = selectedExercises.find(ex => ex.id === id);
    if (exercise) {
      navigate(`/workouts/builder/edit-exercise/${id}`, { state: { exercise, selectedExercises } });
    }
  };

  const promptDeleteExercise = (id: string) => {
    setExerciseToDelete(id);
    setConfirmDeleteExercise(true);
  };

  const handleDeleteExercise = () => {
    if (!exerciseToDelete) return;
    setSelectedExercises(selectedExercises.filter((exercise) => exercise.id !== exerciseToDelete));
    setConfirmDeleteExercise(false);
    setExerciseToDelete(null);
    toast({
      title: "Exercise deleted",
      description: "The exercise has been removed from this workout.",
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSelectedExercises((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCancelClick = () => {
    if (selectedExercises.length > 0 || workoutName.trim() !== "") {
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

    if (selectedExercises.length === 0) {
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
          exercises: selectedExercises,
          date: originalWorkout?.date || new Date(),
          completed: originalWorkout?.completed || false,
          notes: originalWorkout?.notes || location.state?.notes || "",
        };
        console.log("Workouts before saving (regular):", workouts);
        console.log("Saving regular workout:", updatedWorkout);
        updateWorkout(updatedWorkout);
        console.log("Workouts after saving (regular):", workouts);
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
          exercises: selectedExercises,
          isFavorite: originalTemplate?.isFavorite || false,
        };
        console.log("Templates before saving:", workoutTemplates);
        console.log("Saving template:", newWorkoutTemplate);
        if (id) {
          updateWorkoutTemplate(newWorkoutTemplate);
          console.log("Templates after updating:", workoutTemplates);
          toast({
            title: "Template Updated",
            description: "Your workout template has been updated successfully.",
          });
        } else {
          addWorkoutTemplate(newWorkoutTemplate);
          console.log("Templates after adding:", workoutTemplates);
          toast({
            title: "Template Created",
            description: "Your workout template has been saved successfully.",
          });
        }

        if (startAfterCreation) {
          navigate(`/workouts/start/${workoutId}?isTemplate=true`);
        } else {
          navigate("/workouts");
        }
      }
    } catch (error) {
      console.error("Error saving workout:", error);
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
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Header>

        <div className="p-4">
          <input
            type="text"
            placeholder="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="w-full p-2 border rounded mb-4 bg-secondary/75 text-white font-semibold text-lg"
          />

          <Card className="mb-4 bg-secondary/30 border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Exercises</h2>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                    <SelectTrigger className="w-[220px] bg-secondary/80 border-border/50">
                      <SelectValue placeholder="Choose Exercise" />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-border/30">
                      {exercises.length > 0 ? (
                        ['upper', 'lower', 'core', 'other'].map((category) => (
                          <React.Fragment key={category}>
                            <SelectItem value={`category-${category}`} disabled className="text-muted-foreground">{category.toUpperCase()}</SelectItem>
                            {exercises
                              .filter((ex) => ex.category === category)
                              .map((ex) => (
                                <SelectItem key={ex.id} value={ex.id} className="text-white">
                                  {ex.name}
                                </SelectItem>
                              ))}
                          </React.Fragment>
                        ))
                      ) : (
                        <SelectItem value="no-exercises" disabled>No exercises available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                    <Button 
                      onClick={handleSelectExercise} 
                      disabled={!selectedExerciseId} 
                      className="bg-gym-blue hover:bg-gym-blue/90 w-1/2 sm:w-auto"
                    >
                      Add
                    </Button>
                    <Button 
                      onClick={handleAddExerciseClick}
                      className="bg-gym-blue hover:bg-gym-blue/90 w-1/2 sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" /> New Exercise
                    </Button>
                  </div>
                </div>
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

          {selectedExercises.length === 0 ? (
            <Card className="bg-secondary/60 border-border/30">
              <CardContent className="text-center p-5 text
