
import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';

export interface CustomExercise {
  name: string;
  isPrRelevant: boolean;
  prExerciseType?: string;
  lastUsed: Date;
}

const CORE_LIFTS = [
  { name: "Bench Press", prExerciseType: "bench-press" },
  { name: "Deadlift", prExerciseType: "deadlift" },
  { name: "Squat", prExerciseType: "squat" },
  { name: "Shoulder Press", prExerciseType: "shoulder-press" },
];

export const useExercises = () => {
  const { workouts } = useAppContext();
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  
  // Load custom exercises from localStorage
  useEffect(() => {
    try {
      const savedExercises = localStorage.getItem('customExercises');
      if (savedExercises) {
        const parsed = JSON.parse(savedExercises);
        setCustomExercises(Array.isArray(parsed) ? parsed : []);
      } else {
        // Initialize with core lifts
        const initialExercises = CORE_LIFTS.map(lift => ({
          name: lift.name,
          isPrRelevant: true,
          prExerciseType: lift.prExerciseType,
          lastUsed: new Date()
        }));
        setCustomExercises(initialExercises);
        localStorage.setItem('customExercises', JSON.stringify(initialExercises));
      }
    } catch (error) {
      console.error('Error loading custom exercises:', error);
    }
  }, []);
  
  // Save to localStorage whenever customExercises changes
  useEffect(() => {
    if (customExercises.length > 0) {
      try {
        localStorage.setItem('customExercises', JSON.stringify(customExercises));
      } catch (error) {
        console.error('Error saving custom exercises:', error);
      }
    }
  }, [customExercises]);
  
  // Import exercises from completed workouts
  useEffect(() => {
    if (!workouts || !Array.isArray(workouts)) return;
    
    const completedWorkouts = workouts.filter(w => w?.completed === true);
    const newExercises: CustomExercise[] = [];
    
    completedWorkouts.forEach(workout => {
      if (workout?.exercises && Array.isArray(workout.exercises)) {
        workout.exercises.forEach(exercise => {
          // Check if exercise name exists and it's not already in our list (case insensitive check)
          if (exercise?.name && !customExercises.some(e => 
            e.name.toLowerCase() === exercise.name.toLowerCase()
          )) {
            newExercises.push({
              name: exercise.name.trim(), // Keep original casing but trim whitespace
              isPrRelevant: !!exercise.prExerciseType,
              prExerciseType: exercise.prExerciseType,
              lastUsed: new Date(workout.date)
            });
          }
        });
      }
    });
    
    if (newExercises.length > 0) {
      setCustomExercises(prev => [...prev, ...newExercises]);
    }
  }, [workouts, customExercises]);
  
  // Add a new custom exercise
  const addExercise = useCallback((name: string, isPrRelevant: boolean, prExerciseType?: string): boolean => {
    if (!name || name.trim() === '') return false;
    
    const normalizedName = name.trim(); // Keep original casing but trim whitespace
    
    // Check if exercise already exists (case insensitive)
    if (customExercises.some(ex => ex.name.toLowerCase() === normalizedName.toLowerCase())) {
      return false;
    }
    
    setCustomExercises(prev => [
      ...prev,
      {
        name: normalizedName,
        isPrRelevant,
        prExerciseType: isPrRelevant ? (prExerciseType || 'custom') : undefined,
        lastUsed: new Date()
      }
    ]);
    
    return true;
  }, [customExercises]);
  
  // Update existing exercise
  const updateExercise = useCallback((name: string, updates: Partial<CustomExercise>): boolean => {
    if (!name) return false;
    
    setCustomExercises(prev => 
      prev.map(ex => 
        ex.name.toLowerCase() === name.toLowerCase() ? { ...ex, ...updates } : ex
      )
    );
    
    return true;
  }, []);
  
  // Get all exercise names
  const getAllExerciseNames = useCallback((): string[] => {
    return customExercises.map(ex => ex.name);
  }, [customExercises]);

  // Find exercise by name (case insensitive)
  const findExerciseByName = useCallback((name: string): CustomExercise | undefined => {
    return customExercises.find(ex => ex.name.toLowerCase() === name.toLowerCase());
  }, [customExercises]);
  
  // Get PR-relevant exercises
  const getPrExercises = useCallback((): CustomExercise[] => {
    return customExercises.filter(ex => ex.isPrRelevant);
  }, [customExercises]);
  
  return {
    customExercises,
    addExercise,
    updateExercise,
    getAllExerciseNames,
    findExerciseByName,
    getPrExercises,
    CORE_LIFTS
  };
};
