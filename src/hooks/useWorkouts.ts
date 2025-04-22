
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, Exercise } from '@/types';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const addWorkout = useCallback((workout: Workout) => {
    const newWorkout = {
      ...workout,
      id: workout.id || uuidv4()
    };
    setWorkouts(prev => [...prev, newWorkout]);
  }, []);

  const updateWorkout = useCallback((workout: Workout) => {
    setWorkouts(prev => prev.map(w => w.id === workout.id ? workout : w));
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }, []);

  const duplicateWorkout = useCallback((id: string) => {
    const workoutToDuplicate = workouts.find(w => w.id === id);
    if (workoutToDuplicate) {
      const newWorkout = {
        ...workoutToDuplicate,
        id: uuidv4(),
        name: `${workoutToDuplicate.name} (Copy)`,
        date: new Date()
      };
      setWorkouts(prev => [...prev, newWorkout]);
    }
  }, [workouts]);

  const toggleDeloadMode = useCallback((workoutId: string, isDeload: boolean) => {
    setWorkouts(prev => prev.map(w => 
      w.id === workoutId ? { ...w, isDeload } : w
    ));
  }, []);

  const getWorkoutById = useCallback((id: string): Workout => {
    return workouts.find(w => w.id === id) || {} as Workout;
  }, [workouts]);

  return {
    workouts,
    setWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    duplicateWorkout,
    toggleDeloadMode,
    getWorkoutById
  };
};
