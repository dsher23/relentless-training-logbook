import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, Exercise } from '@/types';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const addWorkout = (name: string, exercises: Exercise[] = [], additionalData: Partial<Workout> = {}) => {
    const newWorkout: Workout = {
      id: additionalData.id || uuidv4(),
      name,
      date: new Date(),
      exercises,
      completed: false,
      ...additionalData
    };
    
    console.log("Adding new workout:", newWorkout);
    
    setWorkouts(prevWorkouts => {
      // Check if workout with this ID already exists
      const existingIndex = prevWorkouts.findIndex(w => w.id === newWorkout.id);
      
      if (existingIndex >= 0) {
        // Replace existing workout
        const updatedWorkouts = [...prevWorkouts];
        updatedWorkouts[existingIndex] = newWorkout;
        return updatedWorkouts;
      }
      
      // Add new workout
      return [...prevWorkouts, newWorkout];
    });
    
    return newWorkout.id;
  };

  const updateWorkout = (updated: Workout) => {
    setWorkouts(workouts.map(workout => workout.id === updated.id ? updated : workout));
  };

  const markWorkoutCompleted = (id: string) => {
    setWorkouts(
      workouts.map(workout =>
        workout.id === id ? { ...workout, completed: true } : workout
      )
    );
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  const getWorkoutById = (id: string) => {
    const workout = workouts.find(workout => workout.id === id);
    console.log(`getWorkoutById: Looking for workout with ID ${id}, found:`, workout);
    return workout;
  };

  const duplicateWorkout = (id: string) => {
    const workoutToDuplicate = workouts.find(workout => workout.id === id);
    if (workoutToDuplicate) {
      const newWorkout: Workout = {
        ...workoutToDuplicate,
        id: uuidv4(),
        name: `${workoutToDuplicate.name} (Copy)`,
        completed: false,
        date: new Date()
      };
      setWorkouts([...workouts, newWorkout]);
    }
  };

  const toggleDeloadMode = (id: string, isDeload: boolean) => {
    setWorkouts(
      workouts.map(workout => {
        if (workout.id === id) {
          return {
            ...workout,
            deloadMode: isDeload,  // Use deloadMode property
            isDeload               // Add isDeload property
          };
        }
        return workout;
      })
    );
  };

  return {
    workouts,
    setWorkouts,
    addWorkout,
    updateWorkout,
    markWorkoutCompleted,
    deleteWorkout,
    getWorkoutById,
    duplicateWorkout,
    toggleDeloadMode
  };
};
