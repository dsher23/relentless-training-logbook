import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import AddExerciseForm from "@/components/AddExerciseForm";
import { useAppContext } from "@/context/AppContext";
import { Exercise, Workout } from "@/types";
import { useWorkoutLoader, convertTemplateToWorkout } from "@/hooks/useWorkoutLoader";
import WorkoutDetailsCard from "@/components/WorkoutDetailsCard";
import ExercisesList from "@/components/ExercisesList";

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateWorkout, deleteWorkout } = useAppContext();
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  
  const { workout: rawWorkout, setWorkout, isLoading, isTemplate } = useWorkoutLoader(id);
  
  // Convert template to workout if needed
  const workout = isTemplate && rawWorkout 
    ? convertTemplateToWorkout(rawWorkout) 
    : rawWorkout as Workout;
  
  // Show error and navigate away if workout is still not found after loading
  useEffect(() => {
    if (!isLoading && !rawWorkout?.id && id) {
      toast({
        title: "Workout Not Found",
        description: "The workout couldn't be loaded or doesn't exist.",
        variant: "destructive"
      });
      navigate("/workouts");
    }
  }, [isLoading, rawWorkout, id, navigate, toast]);
  
  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Loading Workout..." />
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
        <Header title="Workout Not Found" />
        <div className="p-4 text-center">
          <p className="mb-4">Unable to load workout details.</p>
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
      toast({
        title: "Exercise added",
        description: `${exercise.name} has been added to your workout.`
      });
    }
    
    setShowExerciseForm(false);
  };

  const handleDeleteWorkout = () => {
    if (confirm("Are you sure you want to delete this workout?")) {
      deleteWorkout(id);
      toast({
        title: "Workout deleted",
        description: `${workout.name} has been deleted.`
      });
      navigate("/workouts");
    }
  };

  const handleEditWorkout = () => {
    // Navigate to the workout builder with the workout ID
    if (workout && workout.id) {
      navigate(`/workouts/builder/${workout.id}`);
    }
  };
  
  const editingExercise = editingExerciseId 
    ? workout.exercises.find(ex => ex.id === editingExerciseId) 
    : null;
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title={workout.name} />
      
      <div className="p-4 space-y-6">
        <WorkoutDetailsCard workout={workout} />
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Exercises</h2>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setEditingExerciseId(null);
                setShowExerciseForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Exercise
            </Button>
          </div>
          
          <ExercisesList 
            exercises={workout.exercises}
            onAddExercise={() => setShowExerciseForm(true)}
            onEditExercise={(id) => {
              setEditingExerciseId(id);
              setShowExerciseForm(true);
            }}
            onDeleteExercise={(exerciseId) => {
              const updatedWorkout: Workout = {
                ...workout,
                exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
              };
              updateWorkout(updatedWorkout);
              toast({
                title: "Exercise removed",
                description: "Exercise has been removed from your workout."
              });
            }}
          />
        </div>
        
        <div className="pt-4">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteWorkout}
            className="w-full"
          >
            Delete Workout
          </Button>
        </div>
        
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t">
          <Button 
            className="w-full bg-gym-purple hover:bg-gym-darkPurple"
            onClick={() => navigate(`/live-workout/${workout.id}`)}
          >
            Start Workout
          </Button>
        </div>
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
    </div>
  );
};

export default WorkoutDetail;
