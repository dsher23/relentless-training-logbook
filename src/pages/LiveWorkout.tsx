import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext, Workout } from "@/context/AppContext";
import { WorkoutHeader } from "@/components/workout/WorkoutHeader";
import { RestTimer } from "@/components/workout/RestTimer";
import { ExerciseLog } from "@/components/workout/ExerciseLog";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { useWorkoutLoader, convertTemplateToWorkout } from "@/hooks/useWorkoutLoader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

const LiveWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTemplate = searchParams.get("isTemplate") === "true";
  const { toast } = useToast();
  const { workouts, workoutTemplates, addWorkout, updateWorkout } = useAppContext();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isResting, setIsResting] = useState(false);
  const [confirmDeleteSetDialog, setConfirmDeleteSetDialog] = useState(false);
  const [deleteSetInfo, setDeleteSetInfo] = useState<{ exerciseId: string, setIndex: number } | null>(null);
  
  const [exerciseData, setExerciseData] = useState<{
    [key: string]: {
      sets: { reps: number; weight: number }[];
      notes: string;
      previousStats?: { reps: number; weight: number }[];
    }
  }>({});

  const { workoutTime, restTime, initialRestTime, startRest, setRestTime } = useWorkoutTimer(isTimerRunning, isResting);

  const handleSetUpdate = useCallback((exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      const updatedSets = [...exercise.sets];
      updatedSets[setIndex] = { 
        ...updatedSets[setIndex], 
        [field]: value 
      };
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: updatedSets
        }
      };
    });
  }, []);

  const handleAddSet = useCallback((exerciseId: string) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      const lastSet = exercise.sets[exercise.sets.length - 1];
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: [...exercise.sets, { 
            reps: lastSet?.reps || 0, 
            weight: lastSet?.weight || 0 
          }]
        }
      };
    });
  }, []);

  const handleRemoveSet = useCallback((exerciseId: string, setIndex: number) => {
    setDeleteSetInfo({ exerciseId, setIndex });
    setConfirmDeleteSetDialog(true);
  }, []);
  
  const confirmDeleteSet = useCallback(() => {
    if (!deleteSetInfo) return;
    
    const { exerciseId, setIndex } = deleteSetInfo;
    
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      const updatedSets = [...exercise.sets];
      updatedSets.splice(setIndex, 1);
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: updatedSets
        }
      };
    });
    
    setConfirmDeleteSetDialog(false);
    setDeleteSetInfo(null);
    
    toast({
      title: "Set removed",
      description: "The set has been removed from this exercise."
    });
  }, [deleteSetInfo, toast]);

  const handleNoteChange = useCallback((exerciseId: string, note: string) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          notes: note
        }
      };
    });
  }, []);

  const startRestPeriod = useCallback(() => {
    setIsResting(true);
    startRest();
  }, [startRest]);

  const finishRest = useCallback(() => {
    setIsResting(false);
    setRestTime(0);
  }, [setRestTime]);

  const finishWorkout = useCallback((): Workout | undefined => {
    if (!workout) return undefined;
    
    const updatedExercises = workout.exercises.map(exercise => {
      const data = exerciseData[exercise.id];
      if (!data) return exercise;
      
      return {
        ...exercise,
        sets: data.sets.map(set => ({ ...set })), // Create deep copy
        notes: data.notes || "",  // Ensure notes is always a string
        lastProgressDate: new Date()
      };
    });
    
    const updatedWorkout: Workout = {
      ...workout,
      exercises: updatedExercises,
      completed: true,
      date: new Date(), // Ensure date is updated to completion time
    };
    
    // Save the completed workout and return it
    const savedWorkout = updateWorkout(updatedWorkout);
    
    toast({
      title: "Workout Completed",
      description: "Your workout has been logged successfully!",
    });
    
    navigate("/workout-history");
    
    return savedWorkout;
  }, [workout, exerciseData, updateWorkout, toast, navigate]);

  useEffect(() => {
    if (id) {
      let foundWorkout: Workout | undefined = undefined;
      
      if (isTemplate) {
        const template = workoutTemplates.find(t => t.id === id);
        if (template) {
          const convertedWorkout = convertTemplateToWorkout(template);
          
          if (convertedWorkout) {
            foundWorkout = addWorkout(convertedWorkout);
            
            // Ensure foundWorkout is set correctly
            if (!foundWorkout) {
              toast({
                title: "Error",
                description: "Failed to create workout from template",
                variant: "destructive"
              });
              navigate("/workouts");
              return;
            }
          }
        }
      } else {
        foundWorkout = workouts.find(w => w.id === id);
      }
      
      if (foundWorkout) {
        setWorkout(foundWorkout);
        
        const initialData: {
          [key: string]: {
            sets: { reps: number; weight: number }[];
            notes: string;
            previousStats?: { reps: number; weight: number }[];
          }
        } = {};
        
        foundWorkout.exercises.forEach(exercise => {
          const previousWorkout = workouts
            .filter(w => w.id !== foundWorkout?.id && w.completed && w.exercises.some(e => e.name === exercise.name))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          const previousExercise = previousWorkout?.exercises.find(e => e.name === exercise.name);
          
          initialData[exercise.id] = {
            sets: exercise.sets.length > 0 
              ? exercise.sets.map(set => ({ ...set })) // Create deep copy to avoid reference issues
              : Array(3).fill({ reps: 0, weight: 0 }),
            notes: exercise.notes || "",
            previousStats: previousExercise?.sets
          };
        });
        
        setExerciseData(initialData);
      } else {
        toast({
          title: "Workout Not Found",
          description: "The requested workout could not be found.",
          variant: "destructive",
        });
        navigate("/workouts");
      }
    }
  }, [id, workouts, workoutTemplates, isTemplate, addWorkout, navigate, toast]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const nextExercise = () => {
    if (!workout) return;
    
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const safeCurrentExerciseIndex = Math.min(
    currentExerciseIndex,
    workout.exercises.length - 1
  );
  
  const currentExercise = workout.exercises[safeCurrentExerciseIndex];
  
  if (!currentExercise) {
    return (
      <div className="p-4 text-center">
        This workout doesn't have any exercises yet. Please add exercises first.
      </div>
    );
  }
  
  const currentExerciseData = exerciseData[currentExercise.id];

  if (!currentExerciseData) {
    return <div className="p-4 text-center">Loading exercise data...</div>;
  }

  return (
    <div className="app-container pb-8 animate-fade-in">
      <WorkoutHeader
        workoutName={workout.name}
        workoutTime={workoutTime}
        isTimerRunning={isTimerRunning}
        onToggleTimer={toggleTimer}
      />
      
      <div className="px-4 pb-2">
        <div className="text-sm flex justify-between items-center">
          <span>Exercise {safeCurrentExerciseIndex + 1} of {workout.exercises.length}</span>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={previousExercise} 
              disabled={safeCurrentExerciseIndex === 0}
            >
              Prev
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={nextExercise} 
              disabled={safeCurrentExerciseIndex === workout.exercises.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      
      {isResting ? (
        <RestTimer 
          restTime={restTime}
          initialRestTime={initialRestTime}
          onSkipRest={finishRest}
        />
      ) : (
        <>
          <ExerciseLog
            exercise={currentExercise}
            previousStats={currentExerciseData.previousStats}
            notes={currentExerciseData.notes}
            onAddSet={() => handleAddSet(currentExercise.id)}
            onUpdateSet={(setIndex, field, value) => 
              handleSetUpdate(currentExercise.id, setIndex, field, value)
            }
            onRemoveSet={(setIndex) => handleRemoveSet(currentExercise.id, setIndex)}
            onUpdateNotes={(notes) => handleNoteChange(currentExercise.id, notes)}
            onStartRest={startRestPeriod}
          />
          
          <div className="flex justify-between p-4">
            {safeCurrentExerciseIndex === workout.exercises.length - 1 ? (
              <Button onClick={finishWorkout} className="bg-green-600 hover:bg-green-700 text-white flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Complete Workout
              </Button>
            ) : (
              <Button onClick={nextExercise} className="bg-primary hover:bg-primary/90 flex items-center">
                Next Exercise <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </>
      )}
      
      {/* Confirm Delete Set Dialog */}
      <Dialog open={confirmDeleteSetDialog} onOpenChange={setConfirmDeleteSetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Set</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this set? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteSetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteSet}>
              Delete Set
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveWorkout;
