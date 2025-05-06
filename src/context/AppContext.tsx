import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useWorkoutTemplates } from '@/hooks/useWorkoutTemplates';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { useWeeklyRoutines } from '@/hooks/useWeeklyRoutines';
import { useToast } from '@/hooks/use-toast';
import { Exercise, Workout, WorkoutTemplate, PRLift, WeightUnit, MeasurementUnit, UnitSystem, WeeklyRoutine } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Define default unit system
const DEFAULT_UNIT_SYSTEM: UnitSystem = {
  bodyWeightUnit: 'kg',
  bodyMeasurementUnit: 'cm',
  liftingWeightUnit: 'kg'
};

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
  
  const {
    weeklyRoutines,
    setWeeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    duplicateWeeklyRoutine,
    archiveWeeklyRoutine,
    assignWorkoutToDay,
    removeWorkoutFromDay,
  } = useWeeklyRoutines();
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [prLifts, setPRLifts] = useState<PRLift[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(DEFAULT_UNIT_SYSTEM);
  const [reminders, setReminders] = useState<WeeklyRoutine[]>([]);

  useEffect(() => {
    // Load data from localStorage on component mount
    try {
      const storedWorkouts = safeLocalStorage.getItem('workouts', []);
      const storedTemplates = safeLocalStorage.getItem('workoutTemplates', []);
      const storedPlans = safeLocalStorage.getItem('workoutPlans', []);
      const storedExercises = safeLocalStorage.getItem('exercises', []);
      const storedPRs = safeLocalStorage.getItem('prLifts', []);
      const storedUnitSystem = safeLocalStorage.getItem('unitSystem', DEFAULT_UNIT_SYSTEM);
      const storedReminders = safeLocalStorage.getItem('reminders', []);
      const storedWeeklyRoutines = safeLocalStorage.getItem('weeklyRoutines', []);
      
      setWorkouts(storedWorkouts);
      setWorkoutTemplates(storedTemplates);
      setWorkoutPlans(storedPlans);
      setExercises(storedExercises);
      setPRLifts(storedPRs);
      setUnitSystem(storedUnitSystem);
      setReminders(storedReminders);
      setWeeklyRoutines(storedWeeklyRoutines);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to load your workout data. Some features may not work correctly.",
        variant: "destructive",
      });
    }
  }, [setWorkouts, setWorkoutTemplates, setWorkoutPlans, setWeeklyRoutines, toast]);
  
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
  
  useEffect(() => {
    safeLocalStorage.setItem('unitSystem', unitSystem);
  }, [unitSystem]);
  
  useEffect(() => {
    if (reminders && reminders.length > 0) {
      safeLocalStorage.setItem('reminders', reminders);
    }
  }, [reminders]);
  
  useEffect(() => {
    if (weeklyRoutines && weeklyRoutines.length > 0) {
      safeLocalStorage.setItem('weeklyRoutines', weeklyRoutines);
    }
  }, [weeklyRoutines]);
  
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
        // Handle the case where date might be null by providing a default value
        date: typeof prLift.date === 'string' 
          ? prLift.date 
          : new Date().toISOString(),
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
  
  // Weight conversion functions
  const convertWeight = (weight: number, fromUnit: WeightUnit = 'kg', toUnit: WeightUnit = 'kg'): number => {
    if (fromUnit === toUnit) return weight;
    
    // Convert to kg first
    let weightInKg = weight;
    if (fromUnit === 'lbs') {
      weightInKg = weight * 0.453592;
    } else if (fromUnit === 'stone') {
      weightInKg = weight * 6.35029;
    }
    
    // Convert from kg to target unit
    if (toUnit === 'lbs') {
      return weightInKg * 2.20462;
    } else if (toUnit === 'stone') {
      return weightInKg * 0.157473;
    }
    
    return weightInKg;
  };
  
  // Measurement conversion function
  const convertMeasurement = (value: number, fromUnit: MeasurementUnit = 'cm', toUnit: MeasurementUnit = 'cm'): number => {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'cm' && toUnit === 'in') {
      return value * 0.393701;
    } else if (fromUnit === 'in' && toUnit === 'cm') {
      return value * 2.54;
    }
    
    return value;
  };
  
  // Unit display functions
  const getWeightUnitDisplay = () => {
    return unitSystem?.liftingWeightUnit || 'kg';
  };
  
  const getMeasurementUnitDisplay = () => {
    return unitSystem?.bodyMeasurementUnit || 'cm';
  };
  
  // Update unit system
  const updateUnitSystem = (update: Partial<UnitSystem>) => {
    setUnitSystem(prev => ({
      ...prev,
      ...update
    }));
  };

  // Empty implementation of getDueReminders for compatibility
  const getDueReminders = () => {
    return [];
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
    unitSystem,
    convertWeight,
    convertMeasurement,
    getWeightUnitDisplay,
    getMeasurementUnitDisplay,
    updateUnitSystem,
    reminders,
    setReminders,
    getDueReminders,
    weeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    duplicateWeeklyRoutine,
    archiveWeeklyRoutine,
    assignWorkoutToDay,
    removeWorkoutFromDay,
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
