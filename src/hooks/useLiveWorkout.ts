
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Workout, Exercise, PRLift } from "@/types";

export const useLiveWorkout = (workoutId?: string) => {
  const { workouts, updateWorkout, addPRLift } = useAppContext();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseData, setExerciseData] = useState<Record<string, any>>({});
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);

  useEffect(() => {
    if (workoutId) {
      const foundWorkout = workouts.find(w => w.id === workoutId);
      if (foundWorkout) {
        setWorkout(foundWorkout);
        
        // Initialize exercise data
        const initialExerciseData: Record<string, any> = {};
        foundWorkout.exercises?.forEach(exercise => {
          initialExerciseData[exercise.id] = {
            sets: [...exercise.sets],
            notes: exercise.notes || ''
          };
        });
        setExerciseData(initialExerciseData);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [workoutId, workouts]);

  const loadWorkout = async () => {
    // This is now a placeholder for the initial load
    // since we're already loading the workout in useEffect
    if (!workout) {
      console.log("No workout found with ID:", workoutId);
      return Promise.reject(new Error("Workout not found"));
    }
    return Promise.resolve();
  };

  const addExercise = (exercise: Exercise) => {
    if (!workout) return;
    const updatedWorkout = {
      ...workout,
      exercises: [...(workout.exercises || []), exercise],
    };
    setWorkout(updatedWorkout);
    updateWorkout(workout.id, updatedWorkout);
    
    // Initialize exercise data for the new exercise
    setExerciseData(prev => ({
      ...prev,
      [exercise.id]: {
        sets: [...exercise.sets],
        notes: exercise.notes || ''
      }
    }));
  };

  const updateExercise = (exerciseId: string, updatedExercise: Exercise) => {
    if (!workout) return;
    const updatedExercises = workout.exercises.map(ex =>
      ex.id === exerciseId ? updatedExercise : ex
    );
    const updatedWorkout = { ...workout, exercises: updatedExercises };
    setWorkout(updatedWorkout);
    updateWorkout(workout.id, updatedWorkout);
    
    // Update exercise data
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        sets: [...updatedExercise.sets],
        notes: updatedExercise.notes || ''
      }
    }));
  };

  const handleUpdateNotes = (exerciseId: string, notes: string) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        notes
      }
    }));
    
    if (workout) {
      const updatedExercises = workout.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, notes } : ex
      );
      const updatedWorkout = { ...workout, exercises: updatedExercises };
      setWorkout(updatedWorkout);
      updateWorkout(workout.id, updatedWorkout);
    }
  };

  const handleSetUpdate = (exerciseId: string, setIndex: number, field: "reps" | "weight", value: number) => {
    if (!exerciseData[exerciseId]) return;
    
    const updatedSets = [...exerciseData[exerciseId].sets];
    updatedSets[setIndex] = { 
      ...updatedSets[setIndex], 
      [field]: value 
    };
    
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: updatedSets
      }
    }));
    
    if (workout) {
      const updatedExercises = workout.exercises.map(ex => {
        if (ex.id === exerciseId) {
          const newSets = [...ex.sets];
          newSets[setIndex] = { ...newSets[setIndex], [field]: value };
          return { ...ex, sets: newSets };
        }
        return ex;
      });
      
      const updatedWorkout = { ...workout, exercises: updatedExercises };
      setWorkout(updatedWorkout);
      updateWorkout(workout.id, updatedWorkout);
    }
  };

  const handleAddSet = (exerciseId: string) => {
    if (!exerciseData[exerciseId]) return;
    
    const lastSet = exerciseData[exerciseId].sets[exerciseData[exerciseId].sets.length - 1] || { reps: 0, weight: 0 };
    const newSet = { reps: lastSet.reps, weight: lastSet.weight };
    
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: [...prev[exerciseId].sets, newSet]
      }
    }));
    
    if (workout) {
      const updatedExercises = workout.exercises.map(ex => {
        if (ex.id === exerciseId) {
          return { 
            ...ex, 
            sets: [...ex.sets, newSet] 
          };
        }
        return ex;
      });
      
      const updatedWorkout = { ...workout, exercises: updatedExercises };
      setWorkout(updatedWorkout);
      updateWorkout(workout.id, updatedWorkout);
    }
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    if (!exerciseData[exerciseId] || exerciseData[exerciseId].sets.length <= 1) return;
    
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        sets: prev[exerciseId].sets.filter((_, idx) => idx !== setIndex)
      }
    }));
    
    if (workout) {
      const updatedExercises = workout.exercises.map(ex => {
        if (ex.id === exerciseId) {
          return { 
            ...ex, 
            sets: ex.sets.filter((_, idx) => idx !== setIndex)
          };
        }
        return ex;
      });
      
      const updatedWorkout = { ...workout, exercises: updatedExercises };
      setWorkout(updatedWorkout);
      updateWorkout(workout.id, updatedWorkout);
    }
  };

  const markComplete = () => {
    if (!workout) return;
    const updatedWorkout = { ...workout, completed: true };
    setWorkout(updatedWorkout);
    updateWorkout(workout.id, updatedWorkout);
  };

  const finishWorkout = () => {
    setHasAttemptedSave(true);
    markComplete();
    return Promise.resolve();
  };

  const nextExercise = () => {
    if (!workout) return;
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const addPR = (exercise: Exercise, weight: number, reps: number) => {
    const prData: Omit<PRLift, "id"> = {
      exercise: exercise.name,
      weight,
      reps,
      date: new Date().toISOString(),
      workoutId: workout?.id,
      isDirectEntry: true,
    };
    addPRLift(prData);
  };

  return {
    workout,
    isLoading,
    currentExerciseIndex,
    exerciseData,
    hasAttemptedSave,
    addExercise,
    updateExercise,
    markComplete,
    addPR,
    loadWorkout,
    finishWorkout,
    nextExercise,
    previousExercise,
    handleUpdateNotes,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  };
};
