
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useWorkoutTemplates } from '@/hooks/useWorkoutTemplates';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { useToast } from '@/hooks/use-toast';
import { Exercise, Workout, WorkoutTemplate, PRLift } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext<any>({});

// Helper function to safely use localStorage
const safeLocalStorage = {
  getItem: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  
  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      
      // Clean up storage if quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          // Try to remove the specific item that's causing issues
          localStorage.removeItem(key);
          console.warn(`Removed ${key} from localStorage due to quota limits.`);
          
          // If it's workout templates, consider clearing history items
          if (key === 'workoutTemplates' || key === 'workouts') {
            // Clear workout history if needed
            localStorage.removeItem('workoutHistory');
            console.warn("Cleared workout history to free up space.");
          }
          
          return false;
        } catch (e) {
          console.error("Failed to clean up localStorage:", e);
          return false;
        }
      }
      return false;
    }
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const {
    workouts,
    setWorkouts,
    addWorkout,
    updateWorkout,
    markWorkoutCompleted,
    deleteWorkout,
    getWorkoutById,
    duplicateWorkout,
  } = useWorkouts();
  
  const {
    workoutTemplates,
    setWorkoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
    duplicateWorkoutTemplate,
  } = useWorkoutTemplates();
  
  const {
    workoutPlans,
    setWorkoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    duplicateWorkoutPlan,
    addTemplateToPlan,
    removeTemplateFromPlan,
    setActivePlan,
  } = useWorkoutPlans();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [prLifts, setPRLifts] = useState<PRLift[]>([]);

  useEffect(() => {
    // Load data from localStorage on component mount
    try {
      const storedWorkouts = safeLocalStorage.getItem('workouts', []);
      const storedTemplates = safeLocalStorage.getItem('workoutTemplates', []);
      const storedPlans = safeLocalStorage.getItem('workoutPlans', []);
      const storedExercises = safeLocalStorage.getItem('exercises', []);
      const storedPRs = safeLocalStorage.getItem('prLifts', []);
      
      setWorkouts(storedWorkouts);
      setWorkoutTemplates(storedTemplates);
      setWorkoutPlans(storedPlans);
      setExercises(storedExercises);
      setPRLifts(storedPRs);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to load your workout data. Some features may not work correctly.",
        variant: "destructive",
      });
    }
  }, [setWorkouts, setWorkoutTemplates, setWorkoutPlans, toast]);
  
  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      safeLocalStorage.setItem('workouts', workouts);
    }
  }, [workouts]);
  
  useEffect(() => {
    if (workoutTemplates && workoutTemplates.length > 0) {
      safeLocalStorage.setItem('workoutTemplates', workoutTemplates);
    }
  }, [workoutTemplates]);
  
  useEffect(() => {
    if (workoutPlans && workoutPlans.length > 0) {
      safeLocalStorage.setItem('workoutPlans', workoutPlans);
    }
  }, [workoutPlans]);
  
  useEffect(() => {
    if (exercises && exercises.length > 0) {
      safeLocalStorage.setItem('exercises', exercises);
    }
  }, [exercises]);
  
  useEffect(() => {
    if (prLifts && prLifts.length > 0) {
      safeLocalStorage.setItem('prLifts', prLifts);
    }
  }, [prLifts]);
  
  const addExercise = (exercise: Exercise) => {
    setExercises((prevExercises) => {
      const newExercises = [...prevExercises, exercise];
      return newExercises;
    });
  };
  
  const addPRLift = (prLift: PRLift) => {
    // Find existing PR lifts for the same exercise
    const existingPRs = prLifts.filter(
      pr => pr.exercise === prLift.exercise
    );
    
    // If this is better than existing PRs, add it
    const isNewPR = existingPRs.every(
      pr => prLift.weight > pr.weight || (prLift.weight === pr.weight && prLift.reps > pr.reps)
    );
    
    if (isNewPR || existingPRs.length === 0) {
      const newPRLift = {
        ...prLift,
        id: prLift.id || uuidv4(),
        date: typeof prLift.date === 'object' ? prLift.date.toISOString() : prLift.date || new Date().toISOString(),
        isDirectEntry: prLift.isDirectEntry || false,
      };
      
      setPRLifts(prev => [...prev, newPRLift] as PRLift[]);
      
      if (!prLift.isDirectEntry) {
        toast({
          title: "New PR!",
          description: `You've set a new personal record!`,
          variant: "default",
        });
      }
      
      return true;
    }
    
    return false;
  };
  
  const value = {
    workouts,
    addWorkout,
    updateWorkout,
    markWorkoutCompleted,
    deleteWorkout,
    getWorkoutById,
    duplicateWorkout,
    workoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
    duplicateWorkoutTemplate,
    workoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    duplicateWorkoutPlan,
    addTemplateToPlan,
    removeTemplateFromPlan,
    setActivePlan,
    exercises,
    addExercise,
    prLifts,
    setPRLifts,
    addPRLift,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
