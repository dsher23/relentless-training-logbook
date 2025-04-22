
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, Exercise } from '@/types';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const addWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout]);
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts(workouts.map(w => w.id === workout.id ? workout : w));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const duplicateWorkout = (id: string) => {
    const workoutToDuplicate = workouts.find(w => w.id === id);
    if (workoutToDuplicate) {
      const newWorkout = {
        ...workoutToDuplicate,
        id: uuidv4(),
        name: `${workoutToDuplicate.name} (Copy)`,
        date: new Date()
      };
      setWorkouts([...workouts, newWorkout]);
    }
  };

  const toggleDeloadMode = (workoutId: string, isDeload: boolean) => {
    setWorkouts(workouts.map(w => 
      w.id === workoutId ? { ...w, isDeload } : w
    ));
  };

  // Add the missing getWorkoutById function
  const getWorkoutById = (id: string): Workout => {
    return workouts.find(w => w.id === id) || {} as Workout;
  };

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
