import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import AddExerciseForm from "@/components/AddExerciseForm";
import { useAppContext } from "@/context/AppContext";
import { Exercise } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workouts, updateWorkout, deleteWorkout, getWorkoutById } = useAppContext();
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the workout by ID
  const workout = id ? getWorkoutById(id) : undefined;
  
  useEffect(() => {
    // Small delay to allow context to update
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Only navigate away if workout is still not found after loading
      if (!workout?.id && id) {
        toast({
          title: "Workout Not Found",
          description: "The workout couldn't be loaded or doesn't exist.",
          variant: "destructive"
        });
        navigate("/workouts");
      }
    }, 500); // Slightly longer delay to ensure context is updated
    
    return () => clearTimeout(timer);
  }, [workout, id, navigate, toast]);
  
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
      // Update existing exercise
      const updatedExercises = workout.exercises.map(ex => 
        ex.id === editingExerciseId ? exercise : ex
      );
      
      const updatedWorkout = {
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
      // Add new exercise
      const updatedWorkout = {
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
  
  const handleEditExercise = (exerciseId: string) => {
    setEditingExerciseId(exerciseId);
    setShowExerciseForm(true);
  };
  
  const handleDeleteExercise = (exerciseId: string) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter(ex => ex.id !== exerciseId)
    };
    
    updateWorkout(updatedWorkout);
    toast({
      title: "Exercise removed",
      description: "Exercise has been removed from your workout."
    });
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
  
  const editingExercise = editingExerciseId 
    ? workout.exercises.find(ex => ex.id === editingExerciseId) 
    : null;
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title={workout.name} />
      
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Details</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground"
                onClick={() => navigate(`/workouts/new?edit=${workout.id}`)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{format(new Date(workout.date), "PPP")}</span>
              </div>
              
              {workout.notes && (
                <div className="pt-2 border-t mt-2">
                  <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                  <p className="text-sm">{workout.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
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
          
          {workout.exercises.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No exercises added yet</p>
                <Button onClick={() => setShowExerciseForm(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Your First Exercise
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {workout.exercises.map((exercise) => (
                <Card key={exercise.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          🏋️ {exercise.name}
                          {exercise.isWeakPoint && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                              Weak Point
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {exercise.sets.length} sets × {exercise.sets[0]?.reps || 0} reps
                          {exercise.sets[0]?.weight ? ` × ${exercise.sets[0].weight}kg` : ''}
                          {exercise.restTime ? ` – Rest: ${exercise.restTime}s` : ''}
                        </div>
                        {exercise.notes && (
                          <div className="text-xs text-muted-foreground mt-1 italic">
                            📝 Notes: {exercise.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditExercise(exercise.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteExercise(exercise.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
