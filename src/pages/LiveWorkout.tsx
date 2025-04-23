
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronRight, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAppContext, Workout } from "@/context/AppContext";
import { WorkoutHeader } from "@/components/workout/WorkoutHeader";
import { RestTimer } from "@/components/workout/RestTimer";
import { ExerciseLog } from "@/components/workout/ExerciseLog";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { useWorkoutLoader, convertTemplateToWorkout } from "@/hooks/useWorkoutLoader";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isResting, setIsResting] = useState(false);
  const [confirmDeleteSetDialog, setConfirmDeleteSetDialog] = useState(false);
  const [deleteSetInfo, setDeleteSetInfo] = useState<{ exerciseId: string, setIndex: number } | null>(null);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  
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
    
    if (workout) {
      try {
        const currentData = JSON.stringify({ 
          workoutId: workout.id, 
          exerciseData, 
          currentExerciseIndex 
        });
        localStorage.setItem('workout_in_progress', currentData);
      } catch (error) {
        console.error("Failed to save workout progress", error);
      }
    }
  }, [workout, exerciseData, currentExerciseIndex]);

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

  const finishWorkout = useCallback(() => {
    if (!workout) {
      toast({
        title: "Error",
        description: "Unable to save workout: missing workout data.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setHasAttemptedSave(true);
      
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

      // CRITICAL FIX: Create a new object with completed explicitly set to true
      const updatedWorkout = {
        ...workout,
        exercises: updatedExercises,
        completed: true, // CRITICAL: Explicitly set to true as a boolean
        date: new Date(), // Ensure date is updated to completion time
        notes: workout.notes || "", // Ensure notes exists
      };
      
      console.log('CRITICAL - About to save completed workout with ID:', updatedWorkout.id);
      console.log('CRITICAL - Completed status before save:', updatedWorkout.completed);
      console.log('CRITICAL - Type of completed property:', typeof updatedWorkout.completed);
      console.log('CRITICAL - Full workout object to be saved:', JSON.stringify(updatedWorkout));
      console.log("Saving workout:", updatedWorkout); // Added debugging log
      
      // CRITICAL FIX: Force the completed flag to true when saving
      const savedWorkout = updateWorkout({
        ...updatedWorkout,
        completed: true // CRITICAL: Force this to be true
      });
      
      console.log('CRITICAL - Result of updateWorkout operation:', savedWorkout);
      console.log('CRITICAL - Updated workout completed status:', savedWorkout?.completed);
      
      setTimeout(() => {
        const allWorkouts = workouts || [];
        const verifyWorkout = allWorkouts.find(w => w.id === updatedWorkout.id);
        console.log('CRITICAL - Verification after save:', verifyWorkout ? {
          id: verifyWorkout.id,
          completed: verifyWorkout.completed,
          completedType: typeof verifyWorkout.completed
        } : 'Workout not found');
      }, 100);
      
      localStorage.removeItem('workout_in_progress');
      
      toast({
        title: "Workout Completed!",
        description: "Your workout has been saved successfully to history.",
      });
      
      setTimeout(() => {
        navigate("/workout-history");
      }, 1500); // Increased delay to ensure state updates properly
    } catch (error) {
      console.error("CRITICAL - Error saving workout:", error);
      toast({
        title: "Save Error",
        description: "There was a problem saving your workout. Please try again.",
        variant: "destructive"
      });
    }
  }, [workout, exerciseData, updateWorkout, toast, navigate, workouts]);

  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) return;
      
      try {
        const savedProgress = localStorage.getItem('workout_in_progress');
        if (savedProgress) {
          const progressData = JSON.parse(savedProgress);
          if (progressData.workoutId === id) {
            setExerciseData(progressData.exerciseData || {});
            setCurrentExerciseIndex(progressData.currentExerciseIndex || 0);
          }
        }
        
        let foundWorkout: Workout | undefined;
        
        if (isTemplate) {
          const template = workoutTemplates.find(t => t.id === id);
          if (template) {
            const convertedWorkout = convertTemplateToWorkout(template);
            
            if (convertedWorkout) {
              addWorkout(convertedWorkout);
              foundWorkout = convertedWorkout;
              
              if (!foundWorkout) {
                throw new Error("Failed to create workout from template");
              }
            }
          }
        } else {
          foundWorkout = workouts.find(w => w.id === id);
        }
        
        if (foundWorkout) {
          const safeWorkout = {
            ...foundWorkout,
            notes: foundWorkout.notes || "",
            date: foundWorkout.date || new Date(),
            completed: typeof foundWorkout.completed === "boolean" ? foundWorkout.completed : false
          };
          
          setWorkout(safeWorkout);
          
          if (!savedProgress || JSON.parse(savedProgress).workoutId !== id) {
            const initialData: {
              [key: string]: {
                sets: { reps: number; weight: number }[];
                notes: string;
                previousStats?: { reps: number; weight: number }[];
              }
            } = {};
            
            safeWorkout.exercises.forEach(exercise => {
              const previousWorkout = workouts
                .filter(w => w.id !== safeWorkout.id && w.completed && w.exercises.some(e => e.name === exercise.name))
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
          }
        } else {
          throw new Error("Workout not found");
        }
      } catch (error) {
        console.error("Error loading workout:", error);
        
        toast({
          title: "Workout Not Found",
          description: "The requested workout could not be loaded. Returning to workouts.",
          variant: "destructive",
        });
        
        setTimeout(() => {
          navigate("/workouts");
        }, 500);
      } finally {
        setIsTimerRunning(true);
      }
    };
    
    loadWorkout();
    
    setHasAttemptedSave(false);
  }, [id, workouts, workoutTemplates, isTemplate, addWorkout, navigate, toast]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (workout && !hasAttemptedSave) {
        try {
          const currentData = JSON.stringify({ 
            workoutId: workout.id, 
            exerciseData, 
            currentExerciseIndex 
          });
          localStorage.setItem('workout_in_progress', currentData);
          
          e.preventDefault();
          e.returnValue = '';
          return '';
        } catch (error) {
          console.error("Failed to save workout progress", error);
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [workout, exerciseData, currentExerciseIndex, hasAttemptedSave]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
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

  if (!workout) {
    return (
      <div className="flex items-center justify-center h-60 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading workout...</p>
        </div>
      </div>
    );
  }

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
    return (
      <div className="flex items-center justify-center h-60 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading exercise data...</p>
        </div>
      </div>
    );
  }

  const debugInfo = debugMode ? (
    <div className="text-xs bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
      <p>Workout ID: {workout.id.substring(0, 8)}...</p>
      <p>Completed: {String(workout.completed)}</p>
    </div>
  ) : null;

  return (
    <div className="app-container pb-8 animate-fade-in">
      <WorkoutHeader
        workoutName={workout.name}
        workoutTime={workoutTime}
        isTimerRunning={isTimerRunning}
        onToggleTimer={toggleTimer}
        debugMode={debugMode}
        debugInfo={debugInfo}
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDebugMode}
              title="Debug Mode"
            >
              <Bug className="h-4 w-4" />
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
              <Button 
                onClick={finishWorkout} 
                className={`${isMobile ? 'w-full' : ''} bg-green-600 hover:bg-green-700 text-white flex items-center justify-center`}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" /> Complete Workout
              </Button>
            ) : (
              <Button 
                onClick={nextExercise} 
                className={`${isMobile ? 'w-full' : ''} bg-primary hover:bg-primary/90 flex items-center justify-center`}
              >
                Next Exercise <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </>
      )}
      
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

