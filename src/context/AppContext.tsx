import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { db, auth } from "../firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { migrateLocalData } from "../utils/migrateLocalData";
import { 
  Workout, Exercise, Measurement, BodyMeasurement, Supplement, 
  Cycle, SteroidCompound, SteroidCycle, SupplementLog, PR, 
  WorkoutDay, WeeklyRoutine, WorkoutTemplate, WorkoutPlan, 
  Reminder, MoodLog, TrainingBlock, WeakPoint, ProgressPhoto, 
  WeeklyRecoveryData, UnitSystem, PRLift, WeightUnit, MeasurementUnit 
} from "@/types";

// Original interfaces, kept for backwards compatibility
interface ProgressPhotoLegacy {
  id: string;
  url: string;
  date: string;
  notes?: string;
}

interface BodyMeasurementLegacy {
  id: string;
  date: string;
  weight?: number;
  height?: number;
  notes?: string;
}

interface SupplementLegacy {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  date: string;
}

interface WorkoutLegacy {
  id: string;
  name: string;
  exercises: any[];
  completed: boolean;
  date: string;
  notes?: string;
}

interface WeeklyRecoveryDataLegacy {
  weekStart: string;
  sleepHours: number[];
  generalFeeling: string;
}

interface PRLiftLegacy {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  date: string;
}

interface AppContextType {
  user: User | null;
  signOutUser: () => Promise<void>;
  
  // Workouts
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (name: string, exercises?: Exercise[], additionalData?: Partial<Workout>) => string;
  updateWorkout: (updated: Workout) => void;
  markWorkoutCompleted: (id: string) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  duplicateWorkout: (id: string) => void;
  toggleDeloadMode: (id: string, isDeload: boolean) => void;
  
  // Exercises
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  
  // Measurements
  measurements: Measurement[];
  bodyMeasurements: BodyMeasurement[];
  
  // Supplements
  supplements: Supplement[];
  userSupplements: Supplement[];
  setUserSupplements: (supplements: Supplement[]) => void;
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (updated: Supplement) => void;
  deleteSupplement: (id: string) => void;
  
  // Supplement Logs
  supplementLogs: SupplementLog[];
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (updated: SupplementLog) => void;
  
  // Cycles
  cycles: Cycle[];
  addCycle: (cycle: Cycle) => void;
  updateCycle: (updated: Cycle) => void;
  deleteCycle: (id: string) => void;
  markSupplementTaken: (supplementId: string, date: Date, taken: boolean) => void;
  markCycleTaken: (cycleId: string, date: Date, taken: boolean) => void;
  
  // Steroid Cycles
  steroidCycles: SteroidCycle[];
  steroidCompounds: SteroidCompound[];
  addSteroidCycle: (cycle: SteroidCycle) => void;
  addCompound: (compound: SteroidCompound) => void;
  updateCompound: (compound: SteroidCompound) => void;
  deleteCompound: (id: string) => void;
  
  // Cycle Compounds
  cycleCompounds: any[];
  
  // Weekly Routines
  weeklyRoutines: WeeklyRoutine[];
  setWeeklyRoutines: (routines: WeeklyRoutine[]) => void;
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (updated: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  duplicateWeeklyRoutine: (id: string) => void;
  archiveWeeklyRoutine: (id: string, archived: boolean) => void;
  
  // Training Blocks
  trainingBlocks: TrainingBlock[];
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (updated: TrainingBlock) => void;
  
  // Weak Points
  weakPoints: WeakPoint[];
  addWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  
  // Mood Logs
  moodLogs: MoodLog[];
  addMoodLog: (moodLog: MoodLog) => void;
  updateMoodLog: (updated: MoodLog) => void;
  
  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  markReminderAsSeen: (id: string) => void;
  dismissReminder: (id: string) => void;
  getDueReminders: () => Reminder[];
  
  // Workout Templates
  workoutTemplates: WorkoutTemplate[];
  setWorkoutTemplates: (templates: WorkoutTemplate[]) => void;
  addWorkoutTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutTemplate: (updated: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  duplicateWorkoutTemplate: (id: string) => string | null;
  
  // Workout Plans
  workoutPlans: WorkoutPlan[];
  addWorkoutPlan: (plan: WorkoutPlan) => void;
  updateWorkoutPlan: (updated: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  duplicateWorkoutPlan: (id: string) => void;
  setActivePlan: (id: string) => void;
  addTemplateToPlan: (planId: string, templateId: string, day: string) => void;
  removeTemplateFromPlan: (planId: string, templateId: string) => void;
  
  // Progress Photos
  progressPhotos: ProgressPhoto[];
  setProgressPhotos: (photos: ProgressPhoto[]) => void;
  
  // Unit System
  unitSystem: UnitSystem;
  convertWeight: (weight: number, fromUnit?: WeightUnit, toUnit?: WeightUnit) => number;
  convertMeasurement: (value: number, fromUnit?: MeasurementUnit, toUnit?: MeasurementUnit) => number;
  getWeightUnitDisplay: () => WeightUnit;
  getMeasurementUnitDisplay: () => MeasurementUnit;
  updateUnitSystem: (update: Partial<UnitSystem>) => void;
  
  // Data Export
  exportData: (type?: string) => string;
  
  // PR Lifts
  prLifts: PR[];
  setPRLifts: (prLifts: PR[]) => void;
  addPRLift: (prData: Omit<PR, "id">) => void;
  updatePR: (prData: PR) => void;
  deletePR: (id: string) => void;
  
  // Weekly Recovery Data
  weeklyRecoveryData: WeeklyRecoveryData | null;
  setWeeklyRecoveryData: (data: WeeklyRecoveryData | null) => void;
  updateWeeklyRecoveryData: (data: Partial<WeeklyRecoveryData>) => void;
  getRestDaysForCurrentWeek: () => number;
  calculateRecoveryScore: (sleepHours: number[], feeling: string, restDays: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [userSupplements, setUserSupplements] = useState<Supplement[]>([]);
  const [weeklyRecoveryData, setWeeklyRecoveryData] = useState<WeeklyRecoveryData | null>(null);
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [prLifts, setPRLifts] = useState<PR[]>([]);
  const [unitSystem] = useState<UnitSystem>({
    bodyWeightUnit: "kg",
    bodyMeasurementUnit: "cm",
    liftingWeightUnit: "kg",
  });

  // Initialize all the additional states required
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [steroidCycles, setSteroidCycles] = useState<SteroidCycle[]>([]);
  const [steroidCompounds, setSteroidCompounds] = useState<SteroidCompound[]>([]);
  const [cycleCompounds, setCycleCompounds] = useState<any[]>([]);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);

  // Sign out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Firebase Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log("Auth state changed:", firebaseUser ? `User logged in: ${firebaseUser.uid}` : "User logged out");

      // Run migration after user signs in
      if (firebaseUser) {
        migrateLocalData(firebaseUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync data with Firestore when user is authenticated
  useEffect(() => {
    if (!user) {
      // Reset state if user is logged out
      setWorkouts([]);
      setProgressPhotos([]);
      setBodyMeasurements([]);
      setUserSupplements([]);
      setWeeklyRecoveryData(null);
      setWeeklyRoutines([]);
      setWorkoutTemplates([]);
      setPRLifts([]);
      setExercises([]);
      setMeasurements([]);
      setSupplements([]);
      setCycles([]);
      setSteroidCycles([]);
      setSteroidCompounds([]);
      setCycleCompounds([]);
      setSupplementLogs([]);
      setTrainingBlocks([]);
      setWeakPoints([]);
      setMoodLogs([]);
      setReminders([]);
      setWorkoutPlans([]);
      return;
    }

    const userId = user.uid;

    // Sync workouts
    const workoutsRef = collection(db, `users/${userId}/workouts`);
    const unsubscribeWorkouts = onSnapshot(workoutsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Workout[];
      console.log("Workouts synced from Firestore:", data);
      setWorkouts(data);
    }, (error) => {
      console.error("Error syncing workouts:", error);
    });

    // Sync progress photos
    const photosRef = collection(db, `users/${userId}/progressPhotos`);
    const unsubscribePhotos = onSnapshot(photosRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProgressPhoto[];
      console.log("Progress photos synced from Firestore:", data);
      setProgressPhotos(data);
    }, (error) => {
      console.error("Error syncing progress photos:", error);
    });

    // Sync body measurements
    const measurementsRef = collection(db, `users/${userId}/bodyMeasurements`);
    const unsubscribeMeasurements = onSnapshot(measurementsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BodyMeasurement[];
      console.log("Body measurements synced from Firestore:", data);
      setBodyMeasurements(data);
    }, (error) => {
      console.error("Error syncing body measurements:", error);
    });

    // Sync user supplements
    const supplementsRef = collection(db, `users/${userId}/userSupplements`);
    const unsubscribeSupplements = onSnapshot(supplementsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Supplement[];
      console.log("User supplements synced from Firestore:", data);
      setUserSupplements(data);
      setSupplements(data); // Set supplements as well for compatibility
    }, (error) => {
      console.error("Error syncing user supplements:", error);
    });

    // Sync weekly recovery data
    const recoveryRef = doc(db, `users/${userId}/weeklyRecoveryData/current`);
    const unsubscribeRecovery = onSnapshot(recoveryRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as WeeklyRecoveryData;
        console.log("Weekly recovery data synced from Firestore:", data);
        setWeeklyRecoveryData(data);
      } else {
        setWeeklyRecoveryData(null);
      }
    }, (error) => {
      console.error("Error syncing weekly recovery data:", error);
    });

    // Sync weekly routines
    const routinesRef = collection(db, `users/${userId}/weeklyRoutines`);
    const unsubscribeRoutines = onSnapshot(routinesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WeeklyRoutine[];
      console.log("Weekly routines synced from Firestore:", data);
      setWeeklyRoutines(data);
    }, (error) => {
      console.error("Error syncing weekly routines:", error);
    });

    // Sync workout templates
    const templatesRef = collection(db, `users/${userId}/workoutTemplates`);
    const unsubscribeTemplates = onSnapshot(templatesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WorkoutTemplate[];
      console.log("Workout templates synced from Firestore:", data);
      setWorkoutTemplates(data);
    }, (error) => {
      console.error("Error syncing workout templates:", error);
    });

    // Sync PR lifts
    const prLiftsRef = collection(db, `users/${userId}/prLifts`);
    const unsubscribePRLifts = onSnapshot(prLiftsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PRLift[];
      console.log("PR lifts synced from Firestore:", data);
      setPRLifts(data);
    }, (error) => {
      console.error("Error syncing PR lifts:", error);
    });

    // Sync exercises
    const exercisesRef = collection(db, `users/${userId}/exercises`);
    const unsubscribeExercises = onSnapshot(exercisesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Exercise[];
      console.log("Exercises synced from Firestore:", data);
      setExercises(data);
    }, (error) => {
      console.error("Error syncing exercises:", error);
    });

    // Sync workout plans
    const plansRef = collection(db, `users/${userId}/workoutPlans`);
    const unsubscribePlans = onSnapshot(plansRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WorkoutPlan[];
      console.log("Workout plans synced from Firestore:", data);
      setWorkoutPlans(data);
    }, (error) => {
      console.error("Error syncing workout plans:", error);
    });

    // Sync reminders
    const remindersRef = collection(db, `users/${userId}/reminders`);
    const unsubscribeReminders = onSnapshot(remindersRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Reminder[];
      console.log("Reminders synced from Firestore:", data);
      setReminders(data);
    }, (error) => {
      console.error("Error syncing reminders:", error);
    });

    // Cleanup on unmount or user change
    return () => {
      unsubscribeWorkouts();
      unsubscribePhotos();
      unsubscribeMeasurements();
      unsubscribeSupplements();
      unsubscribeRecovery();
      unsubscribeRoutines();
      unsubscribeTemplates();
      unsubscribePRLifts();
      unsubscribeExercises();
      unsubscribePlans();
      unsubscribeReminders();
    };
  }, [user]);

  // Update Firestore when state changes
  const updateFirestore = async (path: string, data: any, merge: boolean = false) => {
    if (!user) return;
    const userId = user.uid;
    try {
      if (path.includes('/')) {
        // Handle nested paths (e.g., weeklyRecoveryData/current)
        await setDoc(doc(db, `users/${userId}/${path}`), data, { merge });
      } else {
        // Handle collections (e.g., workouts, progressPhotos)
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          await setDoc(doc(db, `users/${userId}/${path}`, item.id), item, { merge: true });
        }
      }
      console.log(`Updated Firestore: ${path}`, data);
    } catch (error) {
      console.error(`Error updating Firestore (${path}):`, error);
    }
  };

  // Update Firestore for each state change
  useEffect(() => { if (user) updateFirestore("workouts", workouts); }, [workouts, user]);
  useEffect(() => { if (user) updateFirestore("progressPhotos", progressPhotos); }, [progressPhotos, user]);
  useEffect(() => { if (user) updateFirestore("bodyMeasurements", bodyMeasurements); }, [bodyMeasurements, user]);
  useEffect(() => { if (user) updateFirestore("userSupplements", userSupplements); }, [userSupplements, user]);
  useEffect(() => { if (user && weeklyRecoveryData) updateFirestore("weeklyRecoveryData/current", weeklyRecoveryData, true); }, [weeklyRecoveryData, user]);
  useEffect(() => { if (user) updateFirestore("weeklyRoutines", weeklyRoutines); }, [weeklyRoutines, user]);
  useEffect(() => { if (user) updateFirestore("workoutTemplates", workoutTemplates); }, [workoutTemplates, user]);
  useEffect(() => { if (user) updateFirestore("prLifts", prLifts); }, [prLifts, user]);
  useEffect(() => { if (user) updateFirestore("exercises", exercises); }, [exercises, user]);
  useEffect(() => { if (user) updateFirestore("workoutPlans", workoutPlans); }, [workoutPlans, user]);
  useEffect(() => { if (user) updateFirestore("reminders", reminders); }, [reminders, user]);

  // Implementation of the required methods
  
  // Workout methods
  const addWorkout = (name: string, exercises: Exercise[] = [], additionalData: Partial<Workout> = {}): string => {
    const id = crypto.randomUUID();
    const newWorkout: Workout = {
      id,
      name,
      date: new Date(),
      exercises: exercises || [],
      completed: false,
      ...additionalData
    };
    setWorkouts(prev => [...prev, newWorkout]);
    return id;
  };

  const updateWorkout = (updated: Workout) => {
    setWorkouts(prev => prev.map(w => w.id === updated.id ? updated : w));
  };

  const markWorkoutCompleted = (id: string) => {
    setWorkouts(prev => prev.map(w => 
      w.id === id ? { ...w, completed: true } : w
    ));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const duplicateWorkout = (id: string) => {
    const workout = workouts.find(w => w.id === id);
    if (workout) {
      const newId = crypto.randomUUID();
      const duplicate: Workout = {
        ...workout,
        id: newId,
        name: `${workout.name} (Copy)`,
        completed: false,
        date: new Date()
      };
      setWorkouts(prev => [...prev, duplicate]);
    }
  };

  const toggleDeloadMode = (id: string, isDeload: boolean) => {
    setWorkouts(prev => prev.map(w => 
      w.id === id ? { ...w, deloadMode: isDeload } : w
    ));
  };

  // Exercise methods
  const addExercise = (exercise: Exercise) => {
    setExercises(prev => [...prev, exercise]);
  };

  // Supplement methods
  const addSupplement = (supplement: Supplement) => {
    setSupplements(prev => [...prev, supplement]);
    setUserSupplements(prev => [...prev, supplement]);
  };

  const updateSupplement = (updated: Supplement) => {
    setSupplements(prev => prev.map(s => s.id === updated.id ? updated : s));
    setUserSupplements(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteSupplement = (id: string) => {
    setSupplements(prev => prev.filter(s => s.id !== id));
    setUserSupplements(prev => prev.filter(s => s.id !== id));
  };

  // Supplement Log methods
  const addSupplementLog = (log: SupplementLog) => {
    setSupplementLogs(prev => [...prev, log]);
  };

  const updateSupplementLog = (updated: SupplementLog) => {
    setSupplementLogs(prev => prev.map(l => l.id === updated.id ? updated : l));
  };

  // Cycle methods
  const addCycle = (cycle: Cycle) => {
    setCycles(prev => [...prev, cycle]);
  };

  const updateCycle = (updated: Cycle) => {
    setCycles(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCycle = (id: string) => {
    setCycles(prev => prev.filter(c => c.id !== id));
  };

  const markSupplementTaken = (supplementId: string, date: Date, taken: boolean) => {
    // Implementation would depend on your data structure
    console.log("Mark supplement taken:", supplementId, date, taken);
  };

  const markCycleTaken = (cycleId: string, date: Date, taken: boolean) => {
    // Implementation would depend on your data structure
    console.log("Mark cycle taken:", cycleId, date, taken);
  };

  // Steroid Cycle methods
  const addSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles(prev => [...prev, cycle]);
  };

  const addCompound = (compound: SteroidCompound) => {
    setSteroidCompounds(prev => [...prev, compound]);
  };

  const updateCompound = (compound: SteroidCompound) => {
    setSteroidCompounds(prev => prev.map(c => c.id === compound.id ? compound : c));
  };

  const deleteCompound = (id: string) => {
    setSteroidCompounds(prev => prev.filter(c => c.id !== id));
  };

  // Weekly Routine methods
  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines(prev => [...prev, routine]);
  };

  const updateWeeklyRoutine = (updated: WeeklyRoutine) => {
    setWeeklyRoutines(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(prev => prev.filter(r => r.id !== id));
  };

  const duplicateWeeklyRoutine = (id: string) => {
    const routine = weeklyRoutines.find(r => r.id === id);
    if (routine) {
      const newId = crypto.randomUUID();
      const duplicate: WeeklyRoutine = {
        ...routine,
        id: newId,
        name: `${routine.name} (Copy)`
      };
      setWeeklyRoutines(prev => [...prev, duplicate]);
    }
  };

  const archiveWeeklyRoutine = (id: string, archived: boolean) => {
    setWeeklyRoutines(prev => prev.map(r => 
      r.id === id ? { ...r, archived } : r
    ));
  };

  // Training Block methods
  const addTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks(prev => [...prev, block]);
  };

  const updateTrainingBlock = (updated: TrainingBlock) => {
    setTrainingBlocks(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  // Weak Point methods
  const addWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints(prev => [...prev, weakPoint]);
  };

  const deleteWeakPoint = (id: string) => {
    setWeakPoints(prev => prev.filter(w => w.id !== id));
  };

  // Mood Log methods
  const addMoodLog = (moodLog: MoodLog) => {
    setMoodLogs(prev => [...prev, moodLog]);
  };

  const updateMoodLog = (updated: MoodLog) => {
    setMoodLogs(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  // Reminder methods
  const addReminder = (reminder: Reminder) => {
    setReminders(prev => [...prev, reminder]);
  };

  const markReminderAsSeen = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, seen: true } : r
    ));
  };

  const dismissReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, dismissed: true } : r
    ));
  };

  const getDueReminders = () => {
    const now = new Date();
    return reminders.filter(r => {
      if (r.dismissed) return false;
      const dueDate = r.dueDate ? new Date(r.dueDate) : null;
      return dueDate && dueDate <= now;
    });
  };

  // Workout Template methods
  const addWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates(prev => [...prev, template]);
  };

  const updateWorkoutTemplate = (updated: WorkoutTemplate) => {
    setWorkoutTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(prev => prev.filter(t => t.id !== id));
  };

  const duplicateWorkoutTemplate = (id: string): string | null => {
    const template = workoutTemplates.find(t => t.id === id);
    if (template) {
      const newId = crypto.randomUUID();
      const duplicate: WorkoutTemplate = {
        ...template,
        id: newId,
        name: `${template.name} (Copy)`
      };
      setWorkoutTemplates(prev => [...prev, duplicate]);
      return newId;
    }
    return null;
  };

  // Workout Plan methods
  const addWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans(prev => [...prev, plan]);
  };

  const updateWorkoutPlan = (updated: WorkoutPlan) => {
    setWorkoutPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans(prev => prev.filter(p => p.id !== id));
  };

  const duplicateWorkoutPlan = (id: string) => {
    const plan = workoutPlans.find(p => p.id === id);
    if (plan) {
      const newId = crypto.randomUUID();
      const duplicate: WorkoutPlan = {
        ...plan,
        id: newId,
        name: `${plan.name} (Copy)`,
        isActive: false
      };
      setWorkoutPlans(prev => [...prev, duplicate]);
    }
  };

  const setActivePlan = (id: string) => {
    setWorkoutPlans(prev => prev.map(p => ({
      ...p,
      isActive: p.id === id
    })));
  };

  const addTemplateToPlan = (planId: string, templateId: string, day: string) => {
    setWorkoutPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const template = workoutTemplates.find(t => t.id === templateId);
        if (!template) return p;
        
        const updatedPlan = { ...p };
        if (!updatedPlan.routines) updatedPlan.routines = [];
        
        // Logic to add template to plan would depend on your data structure
        return updatedPlan;
      }
      return p;
    }));
  };

  const removeTemplateFromPlan = (planId: string, templateId: string) => {
    setWorkoutPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const updatedPlan = { ...p };
        // Logic to remove template from plan would depend on your data structure
        return updatedPlan;
      }
      return p;
    }));
  };

  // PR Lift methods
  const addPRLift = (prData: Omit<PR, "id">) => {
    const newPR: PR = {
      ...prData,
      id: `${prData.exercise}-${Date.now()}`
    };
    setPRLifts(prev => [...prev, newPR]);
  };

  const updatePR = (prData: PR) => {
    setPRLifts(prev => prev.map(p => p.id === prData.id ? prData as unknown as PRLift : p));
  };

  const deletePR = (id: string) => {
    setPRLifts(prev => prev.filter(p => p.id !== id));
  };

  // Unit System methods
  const convertWeight = (value: number, fromUnit: WeightUnit = "kg", toUnit: WeightUnit = "kg") => {
    if (fromUnit === toUnit) return value;
    const conversionFactors: { [key: string]: number } = {
      kg: 1,
      lbs: 2.20462,
      stone: 0.157473
    };
    return value * (conversionFactors[toUnit] / conversionFactors[fromUnit]);
  };

  const convertMeasurement = (value: number, fromUnit: MeasurementUnit = "cm", toUnit: MeasurementUnit = "cm") => {
    if (fromUnit === toUnit) return value;
    return fromUnit === "cm" ? value * 0.393701 : value * 2.54; // cm to in or in to cm
  };

  const getWeightUnitDisplay = (): WeightUnit => unitSystem.liftingWeightUnit;
  
  const getMeasurementUnitDisplay = (): MeasurementUnit => unitSystem.bodyMeasurementUnit;
  
  const updateUnitSystem = (update: Partial<UnitSystem>) => {
    // This would require a useState for unitSystem
    console.log("Update unit system:", update);
  };

  // Weekly Recovery Data methods
  const updateWeeklyRecoveryData = (data: Partial<WeeklyRecoveryData>) => {
    setWeeklyRecoveryData(prev => prev ? { ...prev, ...data } : null);
  };

  const getRestDaysForCurrentWeek = () => {
    // Logic to calculate rest days
    return 2; // Default value
  };

  const calculateRecoveryScore = (sleepHours: number[], feeling: string, restDays: number) => {
    // Logic to calculate recovery score
    return 75; // Default value
  };

  // Data Export
  const exportData = (type?: string): string => {
    const data = {
      workouts,
      progressPhotos,
      bodyMeasurements,
      userSupplements,
      weeklyRecoveryData,
      weeklyRoutines,
      workoutTemplates,
      prLifts
    };
    return JSON.stringify(data);
  };

  // Get Workout by ID
  const getWorkoutById = (id: string) => {
    return workouts.find(workout => workout.id === id);
  };

  const value: AppContextType = useMemo(() => ({
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
    userSupplements,
    setUserSupplements,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    
    cycles,
    addCycle,
    updateCycle,
    deleteCycle,
    markSupplementTaken,
    markCycleTaken,
    
    steroidCycles,
    steroidCompounds,
    addSteroidCycle,
    addCompound,
    updateCompound,
    deleteCompound,
    
    cycleCompounds,
    
    supplementLogs,
    addSupplementLog,
    updateSupplementLog,
    
    weeklyRoutines,
    setWeeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    duplicateWeeklyRoutine,
    archiveWeeklyRoutine,
    
    trainingBlocks,
    addTrainingBlock,
    updateTrainingBlock,
    
    weakPoints,
    addWeakPoint,
    deleteWeakPoint,
    
    moodLogs,
    addMoodLog,
    updateMoodLog,
    
    reminders,
    addReminder,
    markReminderAsSeen,
    dismissReminder,
    getDueReminders,
    
    workoutTemplates,
    setWorkoutTemplates,
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
    setProgressPhotos,
    
    unitSystem,
    convertWeight,
    convertMeasurement,
    getWeightUnitDisplay,
    getMeasurementUnitDisplay,
    updateUnitSystem,
    
    exportData,
    
    prLifts,
    setPRLifts,
    addPRLift,
    updatePR,
    deletePR,
    
    weeklyRecoveryData,
    setWeeklyRecoveryData,
    updateWeeklyRecoveryData,
    getRestDaysForCurrentWeek,
    calculateRecoveryScore
  }), [
    user, workouts, progressPhotos, bodyMeasurements, 
    userSupplements, weeklyRecoveryData, weeklyRoutines, 
    workoutTemplates, prLifts, exercises, measurements, supplements,
    cycles, steroidCycles, steroidCompounds, cycleCompounds,
    supplementLogs, trainingBlocks, weakPoints, moodLogs,
    reminders, workoutPlans, unitSystem
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
