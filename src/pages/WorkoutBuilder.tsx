
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Plus, Edit, Trash2, GripVertical, Home } from "lucide-react";
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
import { Workout, Exercise, WorkoutTemplate } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  moveExercise: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  index,
  moveExercise,
  onEdit,
  onDelete,
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
        <div className="flex items-center">
          <GripVertical className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{exercise.name}</span>
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
  const { addWorkoutTemplate, updateWorkoutTemplate, workoutTemplates } = useAppContext();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState("");
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [workoutName, setWorkoutName] = useState(location.state?.workoutName || "");
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [confirmDeleteExercise, setConfirmDeleteExercise] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (id) {
      const workoutToEdit = workoutTemplates.find(template => template.id === id);
      if (workoutToEdit) {
        setWorkoutName(workoutToEdit.name);
        setExercises(workoutToEdit.exercises);
      } else {
        toast({
          title: "Workout not found",
          description: "The workout you're trying to edit does not exist.",
          variant: "destructive"
        });
        navigate("/workouts");
      }
    } else if (location.state?.workoutName) {
      setWorkoutName(location.state.workoutName);
    }
  }, [id, location.state, navigate, toast, workoutTemplates]);

  const { startAfterCreation } = location.state || {};

  const handleAddExercise = () => {
    if (exerciseName.trim() === "") {
      toast({
        title: "Error",
        description: "Exercise name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      id: uuidv4(),
      name: exerciseName,
      sets: [],
      lastProgressDate: new Date(),
    };

    setExercises([...exercises, newExercise]);
    setExerciseName("");
    setShowAddExercise(false);
  };

  const handleEditExercise = (id: string) => {
    setEditingExerciseId(id);
    const exerciseToEdit = exercises.find((exercise) => exercise.id === id);
    if (exerciseToEdit) {
      setExerciseName(exerciseToEdit.name);
      setShowAddExercise(true);
    }
  };

  const handleUpdateExercise = () => {
    if (exerciseName.trim() === "") {
      toast({
        title: "Error",
        description: "Exercise name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const updatedExercises = exercises.map((exercise) =>
      exercise.id === editingExerciseId
        ? { ...exercise, name: exerciseName }
        : exercise
    );

    setExercises(updatedExercises);
    setExerciseName("");
    setEditingExerciseId(null);
    setShowAddExercise(false);
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
    } catch (error) {
      console.error("Error creating workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    }
  };

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

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Exercises</h2>
                <Button size="sm" onClick={() => setShowAddExercise(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Exercise
                </Button>
              </div>
            </CardContent>
          </Card>

          {showAddExercise && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <Label htmlFor="exerciseName">Exercise Name</Label>
                <Input
                  type="text"
                  id="exerciseName"
                  placeholder="e.g., Bench Press"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="mb-3"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowAddExercise(false);
                      setExerciseName("");
                      setEditingExerciseId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={
                      editingExerciseId ? handleUpdateExercise : handleAddExercise
                    }
                  >
                    {editingExerciseId ? "Update Exercise" : "Add Exercise"}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
              {startAfterCreation ? "Save and Start Workout" : "Save Workout"}
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
