
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkoutHeader } from "@/components/workout/WorkoutHeader";
import { RestTimer } from "@/components/workout/RestTimer";
import { ExerciseLog } from "@/components/workout/ExerciseLog";
import { WorkoutControls } from "@/components/workout/WorkoutControls";
import { DeleteSetDialog } from "@/components/workout/DeleteSetDialog";
import NavigationHeader from "@/components/NavigationHeader";
import { useWorkoutTimer } from "@/hooks/useWorkoutTimer";
import { useLiveWorkout } from "@/hooks/useLiveWorkout";
import { useIsMobile } from "@/hooks/use-mobile";

const LiveWorkout = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const {
    workout,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    hasAttemptedSave,
    setHasAttemptedSave,
    debugMode,
    setDebugMode,
    exerciseData,
    setExerciseData,
    finishWorkout,
    loadWorkout,
  } = useLiveWorkout();
  
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isResting, setIsResting] = useState(false);
  const [confirmDeleteSetDialog, setConfirmDeleteSetDialog] = useState(false);
  const [deleteSetInfo, setDeleteSetInfo] = useState<{ exerciseId: string, setIndex: number } | null>(null);

  const { workoutTime, restTime, initialRestTime, startRest, setRestTime } = useWorkoutTimer(isTimerRunning, isResting);

  useEffect(() => {
    loadWorkout();
    setIsTimerRunning(true);
  }, [loadWorkout]);

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

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const toggleDebugMode = () => setDebugMode(!debugMode);

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

  const handleUpdateNotes = (exerciseId: string, notes: string) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          notes
        }
      };
    });
  };

  const handleSetUpdate = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
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
  };

  const handleAddSet = (exerciseId: string) => {
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
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    setDeleteSetInfo({ exerciseId, setIndex });
    setConfirmDeleteSetDialog(true);
  };

  const confirmDeleteSet = () => {
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
  };

  if (!workout) {
    return (
      <div className="app-container">
        <NavigationHeader
          title="Workout"
          showBack={true}
          showHome={true}
        />
        <div className="flex items-center justify-center h-60 p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading workout...</p>
          </div>
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
      <div className="app-container">
        <NavigationHeader
          title="Workout"
          showBack={true}
          showHome={true}
        />
        <div className="p-4 text-center">
          This workout doesn't have any exercises yet. Please add exercises first.
        </div>
      </div>
    );
  }
  
  // Check if current exercise data exists in our state
  if (!exerciseData[currentExercise.id]) {
    // Initialize exercise data if it doesn't exist
    setExerciseData(prev => ({
      ...prev,
      [currentExercise.id]: {
        sets: currentExercise.sets || [],
        notes: currentExercise.notes || "",
        previousStats: currentExercise.previousStats
      }
    }));
    
    return (
      <div className="app-container">
        <NavigationHeader
          title="Workout"
          showBack={true}
          showHome={true}
        />
        <div className="flex items-center justify-center h-60 p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Preparing exercise data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  const currentExerciseData = exerciseData[currentExercise.id];

  return (
    <div className="app-container pb-8 animate-fade-in">
      <NavigationHeader
        title={workout.name}
        showBack={true}
        showHome={true}
      />
      
      <WorkoutHeader
        workoutName={workout.name}
        workoutTime={workoutTime}
        isTimerRunning={isTimerRunning}
        onToggleTimer={toggleTimer}
        debugMode={debugMode}
        debugInfo={
          debugMode ? (
            <div className="text-xs">
              <p>Current Exercise: {currentExercise.name} ({safeCurrentExerciseIndex + 1}/{workout.exercises.length})</p>
              <p>Timer: {isTimerRunning ? 'Running' : 'Paused'}</p>
              <p>Total Time: {workoutTime}s</p>
            </div>
          ) : undefined
        }
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
          onSkipRest={() => setIsResting(false)}
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
            onUpdateNotes={(notes) => handleUpdateNotes(currentExercise.id, notes)}
            onStartRest={() => {
              startRest();
              setIsResting(true);
            }}
          />
          
          <div className="flex justify-between p-4">
            <WorkoutControls
              isLastExercise={safeCurrentExerciseIndex === workout.exercises.length - 1}
              onNextExercise={nextExercise}
              onFinishWorkout={finishWorkout}
              isMobile={isMobile}
            />
          </div>
        </>
      )}
      
      <DeleteSetDialog
        open={confirmDeleteSetDialog}
        onOpenChange={setConfirmDeleteSetDialog}
        onConfirm={confirmDeleteSet}
      />
    </div>
  );
};

export default LiveWorkout;
