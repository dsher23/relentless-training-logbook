
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Exercise } from '@/types';
import { useAppContext } from '@/context/AppContext';

export interface CustomExercise {
  name: string;
  isPrRelevant: boolean;
  prExerciseType?: string;
  category: 'upper' | 'lower' | 'core' | 'other';
}

// Define the core lifts that are used in PR tracking
export const CORE_LIFTS = [
  { id: "bench-press", name: "Bench Press" },
  { id: "deadlift", name: "Deadlift" },
  { id: "squat", name: "Squat" },
  { id: "shoulder-press", name: "Shoulder Press" }
];

export const useExercises = () => {
  const { exercises, addExercise: contextAddExercise } = useAppContext();
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  
  const addExercise = useCallback((
    name: string, 
    isPrRelevant: boolean = false,
    prExerciseType?: string,
    category: 'upper' | 'lower' | 'core' | 'other' = 'other'
  ) => {
    // Check if an exercise with this name already exists
    const existingExercise = [...exercises, ...customExercises].find(
      ex => ex.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingExercise) {
      return false;
    }
    
    const newExercise: Exercise = {
      id: uuidv4(),
      name,
      category,
      reps: 10,
      sets: [{ reps: 10, weight: 0 }],
      weight: 0,
      isPrRelevant: isPrRelevant,
      prExerciseType: isPrRelevant ? prExerciseType : undefined
    };
    
    // Add to context and local state
    contextAddExercise(newExercise);
    setCustomExercises(prev => [...prev, newExercise]);
    
    return true;
  }, [exercises, customExercises, contextAddExercise]);
  
  const getAllExerciseNames = useCallback(() => {
    const allExercises = [...exercises, ...customExercises];
    return allExercises.map(ex => ex.name);
  }, [exercises, customExercises]);
  
  const getExerciseByName = useCallback((name: string) => {
    const allExercises = [...exercises, ...customExercises];
    return allExercises.find(ex => ex.name.toLowerCase() === name.toLowerCase());
  }, [exercises, customExercises]);
  
  return {
    exercises,
    customExercises,
    addExercise,
    getAllExerciseNames,
    getExerciseByName,
    CORE_LIFTS
  };
};
