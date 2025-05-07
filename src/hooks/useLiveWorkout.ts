import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Workout, Exercise, PRLift } from "@/types";

export const useLiveWorkout = (workoutId?: string) => {
  const { workouts, updateWorkout, addPRLift } = useAppContext();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (workoutId) {
      const foundWorkout = workouts.find(w => w.id === workoutId);
      if (foundWorkout) {
        setWorkout(foundWorkout);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [workoutId, workouts]);

  const addExercise = (exercise: Exercise) => {
    if (!workout) return;
    const updatedWorkout = {
      ...workout,
      exercises: [...(workout.exercises || []), exercise],
    };
    setWorkout(updatedWorkout);
    updateWorkout(workout.id, updatedWorkout);
  };

  const updateExercise = (exerciseId: string, updatedExercise: Exercise) => {
    if (!workout) return;
    const updatedExercises = workout.exercises.map(ex =>
      ex.id === exerciseId ? updatedExercise : ex
    );
    const updatedWorkout = { ...workout, exercises: updatedExercises };
    setWorkout(updatedWorkout);
    updateWorkout(workout.id, updatedWorkout);
  };

  const markComplete = () => {
    if (!workout) return;
    const updatedWorkout = { ...workout, completed: true };
    setWorkout(updatedWorkout);
    updateWorkout(workout.id, updatedWorkout);
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
    addExercise,
    updateExercise,
    markComplete,
    addPR,
  };
};
