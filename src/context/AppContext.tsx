import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { collection, doc, setDoc, onSnapshot, getDocs } from "firebase/firestore";
import { migrateLocalData } from "../utils/migrateLocalData";
import { useToast } from '@/hooks/use-toast';
import { Exercise, Workout, WorkoutTemplate, PRLift, WeightUnit, MeasurementUnit, UnitSystem, WeeklyRoutine, AppContextType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Define default unit system
const DEFAULT_UNIT_SYSTEM: UnitSystem = {
  bodyWeightUnit: 'kg',
  bodyMeasurementUnit: 'cm',
  liftingWeightUnit: 'kg'
};

// Interface for weekly recovery data
interface WeeklyRecoveryData {
  id: string;
  weekStartDate: string;
  sleepHours: number[];
  feeling: 'Energized' | 'Normal' | 'Tired' | 'Exhausted';
  recoveryScore?: number;
}

const DEFAULT_WEEKLY_RECOVERY: WeeklyRecoveryData = {
  id: 'default',
  weekStartDate: new Date().toISOString(),
  sleepHours: [0, 0, 0, 0, 0, 0, 0], // One for each day of the week
  feeling: 'Normal'
};

// Extended AppContext type with auth user
type ExtendedAppContextType = AppContextType & {
  user: User | null;
  signOutUser: () => Promise<void>;
};

const AppContext = createContext<ExtendedAppContextType | undefined>(undefined);

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
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [prLifts, setPRLifts] = useState<PRLift[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<any[]>([]);
  const [supplements, setSupplements] = useState<any[]>([]);
  const [cycleCompounds, setCycleCompounds] = useState<any[]>([]);
  const [steroidCycles, setSteroidCycles] = useState<any[]>([]);
  const [steroidCompounds, setSteroidCompounds] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [supplementLogs, setSupplementLogs] = useState<any[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<any[]>([]);
  const [weakPoints, setWeakPoints] = useState<any[]>([]);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<any[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(DEFAULT_UNIT_SYSTEM);
  const [weeklyRecoveryData, setWeeklyRecoveryData] = useState<WeeklyRecoveryData>(DEFAULT_WEEKLY_RECOVERY);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Firebase Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log("Auth state changed:", firebaseUser ? `User logged in: ${firebaseUser.uid}` : "User logged out");
      
      // User just logged in
      if (firebaseUser) {
        // Run migration once after user signs in
        migrateLocalData(firebaseUser.uid);
      } else {
        // Reset state when user logs out
        loadFromLocalStorage();
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Sign out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "Logged out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out: " + error.message,
        variant: "destructive",
      });
    }
  };
  
  // Load data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const storedWorkouts = safeLocalStorage.getItem('workouts', []);
      const storedTemplates = safeLocalStorage.getItem('workoutTemplates', []);
      const storedPlans = safeLocalStorage.getItem('workoutPlans', []);
      const storedExercises = safeLocalStorage.getItem('exercises', []);
      const storedPRs = safeLocalStorage.getItem('prLifts', []);
      const storedUnitSystem = safeLocalStorage.getItem('unitSystem', DEFAULT_UNIT_SYSTEM);
      const storedReminders = safeLocalStorage.getItem('reminders', []);
      const storedWeeklyRoutines = safeLocalStorage.getItem('weeklyRoutines', []);
      const storedWeeklyRecovery = safeLocalStorage.getItem('weeklyRecoveryData', DEFAULT_WEEKLY_RECOVERY);
      const storedProgressPhotos = safeLocalStorage.getItem('progressPhotos', []);
      
      setWorkouts(storedWorkouts);
      setWorkoutTemplates(storedTemplates);
      setWorkoutPlans(storedPlans);
      setExercises(storedExercises);
      setPRLifts(storedPRs);
      setUnitSystem(storedUnitSystem);
      setReminders(storedReminders);
      setWeeklyRoutines(storedWeeklyRoutines);
      setWeeklyRecoveryData(storedWeeklyRecovery);
      setProgressPhotos(storedProgressPhotos);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to load your workout data. Some features may not work correctly.",
        variant: "destructive",
      });
    }
  };
  
  // If user is logged in, sync data with Firestore
  useEffect(() => {
    if (!user) {
      return;
    }
    
    const userId = user.uid;
    
    // Setup snapshot listeners for collections
    const setupSnapshotListener = (path: string, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
      const collectionRef = collection(db, `users/${userId}/${path}`);
      return onSnapshot(collectionRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`${path} synced from Firestore:`, data.length);
        setter(data);
      }, (error) => {
        console.error(`Error syncing ${path}:`, error);
        // Fallback to localStorage if Firestore fails
        const storedData = safeLocalStorage.getItem(path, []);
        setter(storedData);
      });
    };
    
    // Setup snapshot listener for a specific document
    const setupDocSnapshotListener = (docPath: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
      const docRef = doc(db, `users/${userId}/${docPath}`);
      return onSnapshot(docRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log(`${docPath} synced from Firestore:`, data);
          setter(data);
        }
      }, (error) => {
        console.error(`Error syncing ${docPath}:`, error);
        // Fallback to localStorage
        const storedData = safeLocalStorage.getItem(docPath.split('/')[0]);
        if (storedData) setter(storedData);
      });
    };
    
    // Setup all listeners
    const unsubscribeWorkouts = setupSnapshotListener('workouts', setWorkouts);
    const unsubscribeTemplates = setupSnapshotListener('workoutTemplates', setWorkoutTemplates);
    const unsubscribePlans = setupSnapshotListener('workoutPlans', setWorkoutPlans);
    const unsubscribeExercises = setupSnapshotListener('exercises', setExercises);
    const unsubscribePRs = setupSnapshotListener('prLifts', setPRLifts);
    const unsubscribeRoutines = setupSnapshotListener('weeklyRoutines', setWeeklyRoutines);
    const unsubscribePhotos = setupSnapshotListener('progressPhotos', setProgressPhotos);
    
    // For single documents like unitSystem
    const unsubscribeUnitSystem = setupDocSnapshotListener('settings/unitSystem', setUnitSystem);
    const unsubscribeWeeklyRecovery = setupDocSnapshotListener('weeklyRecoveryData/current', setWeeklyRecoveryData);
    
    // Cleanup function
    return () => {
      unsubscribeWorkouts();
      unsubscribeTemplates();
      unsubscribePlans();
      unsubscribeExercises();
      unsubscribePRs();
      unsubscribeRoutines();
      unsubscribeUnitSystem();
      unsubscribeWeeklyRecovery();
      unsubscribePhotos();
    };
  }, [user]);
  
  // Save data to localStorage when not logged in, or to Firestore when logged in
  const saveData = (key: string, data: any, isSingleDoc = false) => {
    // Always save to localStorage as fallback
    safeLocalStorage.setItem(key, data);
    
    // If user is logged in, also save to Firestore
    if (user) {
      const userId = user.uid;
      try {
        if (isSingleDoc) {
          // Handle single document (e.g., unitSystem)
          const [collection, docId] = key.split('/');
          setDoc(doc(db, `users/${userId}/${collection}/${docId || 'default'}`), data, { merge: true });
        } else if (Array.isArray(data)) {
          // Handle collections (e.g., workouts, exercises)
          data.forEach(item => {
            if (item && item.id) {
              setDoc(doc(db, `users/${userId}/${key}/${item.id}`), item, { merge: true });
            }
          });
        }
      } catch (error) {
        console.error(`Error saving ${key} to Firestore:`, error);
      }
    }
  };
  
  const addWorkout = (name: string, exercises?: Exercise[], additionalData?: Partial<Workout>) => {
    const id = uuidv4();
    const newWorkout: Workout = {
      id,
      name,
      date: new Date().toISOString(),
      exercises: exercises || [],
      completed: false,
      ...additionalData
    };
    
    setWorkouts(prev => {
      const updatedWorkouts = [...prev, newWorkout];
      saveData('workouts', updatedWorkouts);
      return updatedWorkouts;
    });
    
    return id;
  };

  const updateWorkout = (updated: Workout) => {
    setWorkouts(prev => {
      const updatedWorkouts = prev.map(workout => 
        workout.id === updated.id ? updated : workout
      );
      saveData('workouts', updatedWorkouts);
      return updatedWorkouts;
    });
  };
  
  const markWorkoutCompleted = (id: string) => {
    setWorkouts(prev => {
      const updatedWorkouts = prev.map(workout => 
        workout.id === id ? { ...workout, completed: true } : workout
      );
      saveData('workouts', updatedWorkouts);
      return updatedWorkouts;
    });
  };
  
  const deleteWorkout = (id: string) => {
    setWorkouts(prev => {
      const updatedWorkouts = prev.filter(workout => workout.id !== id);
      saveData('workouts', updatedWorkouts);
      return updatedWorkouts;
    });
  };
  
  const getWorkoutById = (id: string) => {
    return workouts.find(workout => workout.id === id);
  };
  
  const duplicateWorkout = (id: string) => {
    const workout = workouts.find(w => w.id === id);
    if (!workout) return;
    
    const newWorkout = {
      ...workout,
      id: uuidv4(),
      name: `${workout.name} (Copy)`,
      date: new Date().toISOString(),
      completed: false
    };
    
    setWorkouts(prev => {
      const updatedWorkouts = [...prev, newWorkout];
      saveData('workouts', updatedWorkouts);
      return updatedWorkouts;
    });
  };
  
  const toggleDeloadMode = (id: string, isDeload: boolean) => {
    setWorkouts(prev => {
      const updatedWorkouts = prev.map(workout => 
        workout.id === id ? { ...workout, deloadMode: isDeload } : workout
      );
      saveData('workouts', updatedWorkouts);
      return updatedWorkouts;
    });
  };
  
  const addExercise = (exercise: Exercise) => {
    setExercises(prev => {
      const newExercises = [...prev, exercise];
      saveData('exercises', newExercises);
      return newExercises;
    });
  };

  const addPRLift = (prLift: Omit<PRLift, 'id'>) => {
    const existingPRs = prLifts.filter(
      pr => pr.exerciseId === prLift.exerciseId
    );
    
    const isNewPR = existingPRs.every(
      pr => prLift.weight > pr.weight || (prLift.weight === pr.weight && prLift.reps > pr.reps)
    );
    
    if (isNewPR || existingPRs.length === 0) {
      const newPRLift = {
        ...prLift,
        id: uuidv4(),
        date: new Date().toISOString(),
        isDirectEntry: prLift.isDirectEntry || false,
      };
      
      setPRLifts(prev => {
        const updatedPRs = [...prev, newPRLift as PRLift];
        saveData('prLifts', updatedPRs);
        return updatedPRs;
      });
      
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
  
  const updatePR = (prData: PRLift) => {
    setPRLifts(prev => {
      const updatedPRs = prev.map(pr => 
        pr.id === prData.id ? prData : pr
      );
      saveData('prLifts', updatedPRs);
      return updatedPRs;
    });
  };
  
  const deletePR = (id: string) => {
    setPRLifts(prev => {
      const updatedPRs = prev.filter(pr => pr.id !== id);
      saveData('prLifts', updatedPRs);
      return updatedPRs;
    });
  };
  
  // Weekly routines functions
  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines(prev => {
      const newRoutines = [...prev, routine];
      saveData('weeklyRoutines', newRoutines);
      return newRoutines;
    });
  };
  
  const updateWeeklyRoutine = (updated: WeeklyRoutine) => {
    setWeeklyRoutines(prev => {
      const updatedRoutines = prev.map(routine => 
        routine.id === updated.id ? updated : routine
      );
      saveData('weeklyRoutines', updatedRoutines);
      return updatedRoutines;
    });
  };
  
  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(prev => {
      const updatedRoutines = prev.filter(routine => routine.id !== id);
      saveData('weeklyRoutines', updatedRoutines);
      return updatedRoutines;
    });
  };
  
  const duplicateWeeklyRoutine = (id: string) => {
    const routine = weeklyRoutines.find(r => r.id === id);
    if (!routine) return;
    
    const newRoutine = {
      ...routine,
      id: uuidv4(),
      name: `${routine.name} (Copy)`
    };
    
    setWeeklyRoutines(prev => {
      const updatedRoutines = [...prev, newRoutine];
      saveData('weeklyRoutines', updatedRoutines);
      return updatedRoutines;
    });
  };
  
  const archiveWeeklyRoutine = (id: string, archived: boolean) => {
    setWeeklyRoutines(prev => {
      const updatedRoutines = prev.map(routine => 
        routine.id === id ? { ...routine, archived } : routine
      );
      saveData('weeklyRoutines', updatedRoutines);
      return updatedRoutines;
    });
  };
  
  // Workout template functions
  const addWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates(prev => {
      const newTemplates = [...prev, template];
      saveData('workoutTemplates', newTemplates);
      return newTemplates;
    });
  };
  
  const updateWorkoutTemplate = (updated: WorkoutTemplate) => {
    setWorkoutTemplates(prev => {
      const updatedTemplates = prev.map(template => 
        template.id === updated.id ? updated : template
      );
      saveData('workoutTemplates', updatedTemplates);
      return updatedTemplates;
    });
  };
  
  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(prev => {
      const updatedTemplates = prev.filter(template => template.id !== id);
      saveData('workoutTemplates', updatedTemplates);
      return updatedTemplates;
    });
  };
  
  const duplicateWorkoutTemplate = (id: string) => {
    const template = workoutTemplates.find(t => t.id === id);
    if (!template) return null;
    
    const newId = uuidv4();
    const newTemplate = {
      ...template,
      id: newId,
      name: `${template.name} (Copy)`
    };
    
    setWorkoutTemplates(prev => {
      const updatedTemplates = [...prev, newTemplate];
      saveData('workoutTemplates', updatedTemplates);
      return updatedTemplates;
    });
    
    return newId;
  };
  
  // Workout plan functions
  const addWorkoutPlan = (plan: any) => {
    setWorkoutPlans(prev => {
      const newPlans = [...prev, plan];
      saveData('workoutPlans', newPlans);
      return newPlans;
    });
  };
  
  const updateWorkoutPlan = (updated: any) => {
    setWorkoutPlans(prev => {
      const updatedPlans = prev.map(plan => 
        plan.id === updated.id ? updated : plan
      );
      saveData('workoutPlans', updatedPlans);
      return updatedPlans;
    });
  };
  
  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans(prev => {
      const updatedPlans = prev.filter(plan => plan.id !== id);
      saveData('workoutPlans', updatedPlans);
      return updatedPlans;
    });
  };
  
  const duplicateWorkoutPlan = (id: string) => {
    const plan = workoutPlans.find(p => p.id === id);
    if (!plan) return;
    
    const newPlan = {
      ...plan,
      id: uuidv4(),
      name: `${plan.name} (Copy)`,
      isActive: false
    };
    
    setWorkoutPlans(prev => {
      const updatedPlans = [...prev, newPlan];
      saveData('workoutPlans', updatedPlans);
      return updatedPlans;
    });
  };
  
  const setActivePlan = (id: string) => {
    setWorkoutPlans(prev => {
      const updatedPlans = prev.map(plan => ({
        ...plan,
        isActive: plan.id === id
      }));
      saveData('workoutPlans', updatedPlans);
      return updatedPlans;
    });
  };
  
  const addTemplateToPlan = (planId: string, templateId: string, day: string) => {
    setWorkoutPlans(prev => {
      const updatedPlans = prev.map(plan => {
        if (plan.id === planId) {
          // Ensure days object exists
          const days = plan.days || {};
          // Ensure day array exists
          const dayTemplates = days[day] || [];
          // Add template to day if not already there
          if (!dayTemplates.includes(templateId)) {
            days[day] = [...dayTemplates, templateId];
          }
          return { ...plan, days };
        }
        return plan;
      });
      saveData('workoutPlans', updatedPlans);
      return updatedPlans;
    });
  };
  
  const removeTemplateFromPlan = (planId: string, templateId: string) => {
    setWorkoutPlans(prev => {
      const updatedPlans = prev.map(plan => {
        if (plan.id === planId) {
          const days = { ...plan.days };
          // Remove template from all days
          Object.keys(days).forEach(day => {
            days[day] = days[day].filter((id: string) => id !== templateId);
          });
          return { ...plan, days };
        }
        return plan;
      });
      saveData('workoutPlans', updatedPlans);
      return updatedPlans;
    });
  };
  
  // Weekly routines functions for assign/remove workout
  const assignWorkoutToDay = (routineId: string, dayOfWeek: number, workoutTemplateId: string) => {
    setWeeklyRoutines(prev => {
      const updatedRoutines = prev.map(routine => {
        if (routine.id === routineId) {
          const workoutDays = routine.workoutDays || [];
          const existingDayIndex = workoutDays.findIndex(day => day.dayOfWeek === dayOfWeek);
          
          if (existingDayIndex >= 0) {
            // Update existing day
            workoutDays[existingDayIndex] = {
              ...workoutDays[existingDayIndex],
              workoutTemplateId
            };
          } else {
            // Add new day
            workoutDays.push({
              id: uuidv4(),
              dayOfWeek,
              workoutTemplateId
            });
          }
          
          return { ...routine, workoutDays };
        }
        return routine;
      });
      saveData('weeklyRoutines', updatedRoutines);
      return updatedRoutines;
    });
  };
  
  const removeWorkoutFromDay = (routineId: string, dayOfWeek: number) => {
    setWeeklyRoutines(prev => {
      const updatedRoutines = prev.map(routine => {
        if (routine.id === routineId) {
          const workoutDays = (routine.workoutDays || [])
            .filter(day => day.dayOfWeek !== dayOfWeek);
          return { ...routine, workoutDays };
        }
        return routine;
      });
      saveData('weeklyRoutines', updatedRoutines);
      return updatedRoutines;
    });
  };
  
  // Weight and measurement conversion functions
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
  
  const convertMeasurement = (value: number, fromUnit: MeasurementUnit = 'cm', toUnit: MeasurementUnit = 'cm'): number => {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'cm' && toUnit === 'in') {
      return value * 0.393701;
    } else if (fromUnit === 'in' && toUnit === 'cm') {
      return value * 2.54;
    }
    
    return value;
  };
  
  const getWeightUnitDisplay = () => {
    return unitSystem?.liftingWeightUnit || 'kg';
  };
  
  const getMeasurementUnitDisplay = () => {
    return unitSystem?.bodyMeasurementUnit || 'cm';
  };
  
  const updateUnitSystem = (update: Partial<UnitSystem>) => {
    setUnitSystem(prev => {
      const updated = { ...prev, ...update };
      saveData('settings/unitSystem', updated, true);
      return updated;
    });
  };
  
  // Weekly recovery data functions
  const calculateRecoveryScore = (sleepHours: number[], feeling: string, restDays: number): number => {
    // Calculate average sleep
    const totalSleep = sleepHours.reduce((sum, hours) => sum + hours, 0);
    const avgSleep = totalSleep / 7;
    
    // Points from sleep (max 50 points - 10 points per hour up to 5 hours)
    const sleepPoints = Math.min(avgSleep * 10, 50);
    
    // Points from feeling
    let feelingPoints = 0;
    switch (feeling) {
      case 'Energized': feelingPoints = 30; break;
      case 'Normal': feelingPoints = 20; break;
      case 'Tired': feelingPoints = 10; break;
      case 'Exhausted': feelingPoints = 0; break;
      default: feelingPoints = 15;
    }
    
    // Points from rest days
    let restDaysPoints = 0;
    if (restDays >= 2) restDaysPoints = 20;
    else if (restDays === 1) restDaysPoints = 10;
    
    // Calculate total score (max 100)
    const totalScore = Math.min(Math.round(sleepPoints + feelingPoints + restDaysPoints), 100);
    return totalScore;
  };
  
  const getRestDaysForCurrentWeek = (): number => {
    try {
      if (!Array.isArray(workouts)) return 0;
      
      // Get dates for current week (Monday to Sunday)
      const today = new Date();
      const currentDay = today.getDay() || 7; // Convert Sunday from 0 to 7
      const mondayDate = new Date(today);
      mondayDate.setDate(today.getDate() - currentDay + 1);
      
      // Set time to beginning of the day
      mondayDate.setHours(0, 0, 0, 0);
      
      // Get workouts from current week
      const workoutsThisWeek = workouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= mondayDate && workoutDate <= today;
      });
      
      // Count days with workouts
      const daysWithWorkouts = new Set();
      workoutsThisWeek.forEach(workout => {
        const workoutDate = new Date(workout.date);
        daysWithWorkouts.add(workoutDate.toDateString());
      });
      
      // Calculate days between Monday and today (inclusive)
      const daysDiff = Math.floor((today.getTime() - mondayDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Rest days = total days - days with workouts
      return Math.max(0, daysDiff - daysWithWorkouts.size);
    } catch (error) {
      console.error("Error calculating rest days:", error);
      return 0;
    }
  };
  
  const updateWeeklyRecoveryData = (data: Partial<WeeklyRecoveryData>) => {
    setWeeklyRecoveryData(prev => {
      const updatedData = { ...prev, ...data };
      
      // Calculate recovery score if not provided
      if (!data.recoveryScore) {
        const restDays = getRestDaysForCurrentWeek();
        updatedData.recoveryScore = calculateRecoveryScore(
          updatedData.sleepHours, 
          updatedData.feeling, 
          restDays
        );
      }
      
      saveData('weeklyRecoveryData/current', updatedData, true);
      return updatedData;
    });
  };
  
  // Empty implementation of getDueReminders for compatibility
  const getDueReminders = () => {
    return [];
  };
  
  // Export data function
  const exportData = (type?: string): string => {
    const dataToExport = {
      workouts,
      workoutTemplates,
      workoutPlans,
      exercises,
      prLifts,
      weeklyRoutines,
      weeklyRecoveryData,
      unitSystem,
      progressPhotos,
      exportDate: new Date().toISOString(),
      appVersion: "1.0.0"
    };
    
    return JSON.stringify(dataToExport, null, 2);
  };
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      signOutUser,
      workouts,
      setWorkouts,
      addWorkout,
      updateWorkout,
      markWorkoutCompleted,
      deleteWorkout,
      getWorkoutById,
      duplicateWorkout,
      toggleDeloadMode,
      exercises,
      addExercise,
      measurements,
      bodyMeasurements,
      supplements,
      cycles,
      steroidCycles,
      steroidCompounds,
      cycleCompounds,
      supplementLogs,
      weeklyRoutines,
      addWeeklyRoutine,
      updateWeeklyRoutine,
      deleteWeeklyRoutine,
      duplicateWeeklyRoutine,
      archiveWeeklyRoutine,
      trainingBlocks,
      weakPoints,
      moodLogs,
      reminders,
      setReminders,
      getDueReminders,
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
      setActivePlan,
      addTemplateToPlan,
      removeTemplateFromPlan,
      progressPhotos,
      unitSystem,
      convertWeight,
      convertMeasurement,
      getWeightUnitDisplay,
      getMeasurementUnitDisplay,
      updateUnitSystem,
      exportData,
      prLifts,
      addPRLift,
      updatePR,
      deletePR,
      weeklyRecoveryData,
      updateWeeklyRecoveryData,
      getRestDaysForCurrentWeek,
      calculateRecoveryScore,
      assignWorkoutToDay,
      removeWorkoutFromDay,
    }),
    [
      user,
      workouts,
      exercises,
      measurements,
      bodyMeasurements,
      supplements,
      cycles,
      steroidCycles,
      steroidCompounds,
      cycleCompounds,
      supplementLogs,
      weeklyRoutines,
      trainingBlocks,
      weakPoints,
      moodLogs,
      reminders,
      workoutTemplates,
      workoutPlans,
      progressPhotos,
      unitSystem,
      prLifts,
      weeklyRecoveryData,
    ]
  );

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return <AppContext.Provider value={value as ExtendedAppContextType}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
