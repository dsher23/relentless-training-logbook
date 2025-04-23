import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import AddExerciseForm from "@/components/AddExerciseForm";
import { useAppContext } from "@/context/AppContext";
import { Exercise, Workout } from "@/types";
import { useWorkoutLoader, convertTemplateToWorkout } from "@/hooks/useWorkoutLoader";
import WorkoutDetailsCard from "@/components/WorkoutDetailsCard";
import ExerciseDetailCard from "@/components/ExerciseDetailCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateWorkout, deleteWorkout, workoutPlans } = useAppContext();
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { workout: rawWorkout, setWorkout, isLoading, isTemplate, error } = useWorkoutLoader(id);
  
  const activePlan = workoutPlans.find(p => p.isActive);
  
  const workout = isTemplate && rawWorkout 
    ? convertTemplateToWorkout(rawWorkout) 
    : rawWorkout as Workout;
  
  useEffect(() => {
    if (!isLoading && !rawWorkout?.id && id) {
      toast({
        title: "Workout Not Found",
        description: "The workout couldn't be loaded or doesn't exist.",
        variant: "destructive"
      });
    }
  }, [isLoading, rawWorkout, id, toast]);

  const handleEditExercise = (exerciseId: string) => {
    const exercise = workout?.exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setEditingExerciseId(exerciseId);
      setShowExerciseForm(true);
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
        <div className="p-4">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }
  
  if (!workout || !workout.id) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Workout Not Found">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Header>
        <div className="p-4 text-center">
          <p className="mb-4">Unable to load workout details. {error}</p>
          <Button onClick={() => navigate("/workouts")}>
            Return to Workouts
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveExercise = (exercise: Exercise) => {
    if (editingExerciseId) {
      const updatedExercises = workout.exercises.map(ex => 
        ex.id === editingExerciseId ? exercise : ex
      );
      
      const updatedWorkout: Workout = {
        ...workout,
        exercises: updatedExercises,
      };
      
      updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      setEditingExerciseId(null);
      toast({
        title: "Exercise updated",
        description: `${exercise.name} has been updated.`
      });
    } else {
      const updatedWorkout: Workout = {
        ...workout,
        exercises: [...workout.exercises, exercise],
      };
      
      updateWorkout(updatedWorkout);
      setWorkout(updatedWorkout);
      toast({
        title: "Exercise added",
        description: `${exercise.name} has been added to your workout.`
      });
    }
    
    setShowExerciseForm(false);
  };

  const handleDeleteWorkout = () => {
    deleteWorkout(id || "");
    toast({
      title: "Workout deleted",
      description: `${workout.name} has been deleted.`
    });
    navigate("/workouts");
  };

  const handleEditWorkout = () => {
    if (isTemplate) {
      const planId = activePlan?.id || '';
      navigate(`/exercise-plans/${planId}/days/${workout.id}`);
    } else {
      navigate(`/workouts/builder/${workout.id}`);
    }
  };
  
  const editingExercise = editingExerciseId 
    ? workout.exercises.find(ex => ex.id === editingExerciseId) 
    : null;
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title={workout.name}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Header>
      
      <div className="p-4 space-y-6">
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEditWorkout}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit Workout
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
        
        <WorkoutDetailsCard workout={workout} />
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Exercises</h2>
            {workout.completed === false && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setEditingExerciseId(null);
                  setShowExerciseForm(true);
                }}
                aria-label="Add exercise"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Exercise
              </Button>
            )}
          </div>
          
          {workout.exercises.length === 0 ? (
            <div className="text-center p-6 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">No exercises in this workout.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workout.exercises.map(exercise => (
                <ExerciseDetailCard 
                  key={exercise.id}
                  exercise={exercise}
                  onEdit={workout.completed ? undefined : () => handleEditExercise(exercise.id)}
                />
              ))}
            </div>
          )}
        </div>
        
        {workout.completed === false && (
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t">
            <Button 
              className="w-full bg-gym-purple hover:bg-gym-darkPurple"
              onClick={() => navigate(`/live-workout/${workout.id}`)}
            >
              Start Workout
            </Button>
          </div>
        )}
      </div>
      
      <AddExerciseForm 
        isOpen={showExerciseForm}
        onClose={() => {
          setShowExerciseForm(false);
          setEditingExerciseId(null);
        }}
        onSave={handleSaveExercise}
        exercise={editingExercise || undefined}
      />
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWorkout}>
              Delete Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutDetail;
