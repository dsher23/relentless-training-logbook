import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "../firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { migrateLocalData } from "../utils/migrateLocalData";

interface ProgressPhoto {
  id: string;
  url: string;
  date: string;
  notes?: string;
}

interface BodyMeasurement {
  id: string;
  date: string;
  weight?: number;
  height?: number;
  notes?: string;
}

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  date: string;
}

interface SupplementLog {
  id: string;
  supplementId: string;
  date: string;
  taken: boolean;
}

interface SteroidCycle {
  id: string;
  compound: string;
  dosage: string;
  startDate: string;
  endDate: string;
}

interface SteroidCompound {
  id: string;
  name: string;
  description?: string;
}

interface Reminder {
  id: string;
  type: string;
  dueDate: string;
  seen: boolean;
}

interface MoodLog {
  id: string;
  date: string;
  mood: string;
  notes?: string;
}

interface WeakPoint {
  id: string;
  muscleGroup: string;
  notes?: string;
  date: string;
}

interface Workout {
  id: string;
  name: string;
  exercises: any[];
  completed: boolean;
  date: string;
  notes?: string;
}

interface WeeklyRecoveryData {
  id: string;
  weekStartDate: string;
  weekStart: string;
  sleepHours: number[];
  feeling: "Energized" | "Normal" | "Tired" | "Exhausted";
  generalFeeling: "Energized" | "Normal" | "Tired" | "Exhausted";
}

interface PRLift {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  date: string;
  workoutId?: string;
}

interface UserProfile {
  displayName?: string;
  email?: string;
  createdAt?: string;
  startWeight?: number;
  currentWeight?: number;
  goalWeight?: number;
  bio?: string;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: any[];
  reps: number;
}

interface TrainingBlock {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  workouts: Workout[];
}

interface WorkoutPlan {
  id: string;
  name: string;
  templates: any[];
  active: boolean;
}

interface WeeklyRoutine {
  id: string;
  name: string;
  workouts: Workout[];
  startDate: string;
  endDate: string;
  archived: boolean;
}

interface AppContextType {
  user: User | null;
  userProfile: UserProfile | null;
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (name: string, exercises?: Exercise[], additionalData?: Partial<Workout>) => string;
  updateWorkout: (id: string, workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  markWorkoutCompleted: (id: string) => void;
  progressPhotos: ProgressPhoto[];
  setProgressPhotos: (photos: ProgressPhoto[]) => void;
  bodyMeasurements: BodyMeasurement[];
  setBodyMeasurements: (measurements: BodyMeasurement[]) => void;
  userSupplements: Supplement[];
  setUserSupplements: (supplements: Supplement[]) => void;
  supplements: Supplement[];
  supplementLogs: SupplementLog[];
  steroidCycles: SteroidCycle[];
  steroidCompounds: SteroidCompound[];
  addSupplement: (supplement: Omit<Supplement, "id">) => void;
  updateSupplement: (id: string, supplement: Supplement) => void;
  addSupplementLog: (log: Omit<SupplementLog, "id">) => void;
  updateSupplementLog: (id: string, log: SupplementLog) => void;
  addSteroidCycle: (cycle: Omit<SteroidCycle, "id">) => void;
  updateSteroidCycle: (id: string, cycle: SteroidCycle) => void; // Added updateSteroidCycle
  addCompound: (compound: Omit<SteroidCompound, "id">) => void;
  updateCompound: (id: string, compound: SteroidCompound) => void;
  deleteCompound: (id: string) => void;
  weeklyRecoveryData: WeeklyRecoveryData | null;
  setWeeklyRecoveryData: (data: WeeklyRecoveryData | null) => void;
  weeklyRoutines: WeeklyRoutine[];
  setWeeklyRoutines: (routines: WeeklyRoutine[]) => void;
  addWeeklyRoutine: (routine: Omit<WeeklyRoutine, "id">) => void;
  updateWeeklyRoutine: (id: string, routine: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  duplicateWeeklyRoutine: (id: string) => void;
  archiveWeeklyRoutine: (id: string) => void;
  workoutTemplates: any[];
  setWorkoutTemplates: (templates: any[]) => void;
  addWorkoutTemplate: (template: any) => void;
  updateWorkoutTemplate: (id: string, template: any) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  prLifts: PRLift[];
  setPRLifts: (prLifts: PRLift[]) => void;
  addPRLift: (prLift: Omit<PRLift, "id">) => void;
  unitSystem: { bodyWeightUnit: string; bodyMeasurementUnit: string; liftingWeightUnit: string };
  convertWeight: (value: number, fromUnit: string, toUnit: string) => number;
  convertMeasurement: (value: number, fromUnit: string, toUnit: string) => number;
  getWeightUnitDisplay: () => string;
  getMeasurementUnitDisplay: () => string;
  updateUnitSystem: (system: { bodyWeightUnit: string; bodyMeasurementUnit: string; liftingWeightUnit: string }) => void;
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, "id">) => void;
  updateExercise: (id: string, exercise: Exercise) => void;
  trainingBlocks: TrainingBlock[];
  addTrainingBlock: (block: Omit<TrainingBlock, "id">) => void;
  updateTrainingBlock: (id: string, block: TrainingBlock) => void;
  weakPoints: WeakPoint[];
  addWeakPoint: (weakPoint: Omit<WeakPoint, "id">) => void;
  deleteWeakPoint: (id: string) => void;
  workoutPlans: WorkoutPlan[];
  addWorkoutPlan: (plan: Omit<WorkoutPlan, "id">) => void;
  updateWorkoutPlan: (id: string, plan: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  duplicateWorkoutPlan: (id: string) => void;
  setActivePlan: (id: string) => void;
  addTemplateToPlan: (planId: string, template: any) => void;
  removeTemplateFromPlan: (planId: string, templateId: string) => void;
  duplicateWorkoutTemplate: (id: string) => void;
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  getDueReminders: () => Reminder[];
  markReminderAsSeen: (id: string) => void;
  dismissReminder: (id: string) => void;
  moodLogs: MoodLog[];
  addMoodLog: (log: Omit<MoodLog, "id">) => void;
  updateMoodLog: (id: string, log: MoodLog) => void;
  toggleDeloadMode: () => void;
  exportData: () => void;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [userSupplements, setUserSupplements] = useState<Supplement[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>([]);
  const [steroidCycles, setSteroidCycles] = useState<SteroidCycle[]>([]);
  const [steroidCompounds, setSteroidCompounds] = useState<SteroidCompound[]>([]);
  const [weeklyRecoveryData, setWeeklyRecoveryData] = useState<WeeklyRecoveryData | null>(null);
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<any[]>([]);
  const [prLifts, setPRLifts] = useState<PRLift[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [unitSystem, setUnitSystem] = useState({
    bodyWeightUnit: "kg",
    bodyMeasurementUnit: "cm",
    liftingWeightUnit: "kg",
  });

  // Firebase Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log("Auth state changed:", firebaseUser ? `User logged in: ${firebaseUser.uid}` : "User logged out");

      if (firebaseUser) {
        migrateLocalData(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user profile from Firestore
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userId = user.uid;
    const profileRef = doc(db, `users/${userId}/profile/info`);
    const unsubscribeProfile = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfile;
        console.log("User profile synced from Firestore:", data);
        setUserProfile(data);
      } else {
        console.log("No user profile found in Firestore, using default values");
        setUserProfile({
          displayName: user.displayName || "User",
          email: user.email || "",
          createdAt: new Date().toISOString(),
          startWeight: 0,
          currentWeight: 0,
          goalWeight: 0,
          bio: "",
        });
      }
    }, (error) => {
      console.error("Error syncing user profile from Firestore:", error.message);
      setUserProfile({
        displayName: user.displayName || "User",
        email: user.email || "",
        createdAt: new Date().toISOString(),
        startWeight: 0,
        currentWeight: 0,
        goalWeight: 0,
        bio: "",
      });
    });

    return () => unsubscribeProfile();
  }, [user]);

  // Sync data with Firestore when user is authenticated
  useEffect(() => {
    if (!user) {
      // Reset state if user is logged out
      setWorkouts([]);
      setProgressPhotos([]);
      setBodyMeasurements([]);
      setUserSupplements([]);
      setSupplements([]);
      setSupplementLogs([]);
      setSteroidCycles([]);
      setSteroidCompounds([]);
      setWeeklyRecoveryData(null);
      setWeeklyRoutines([]);
      setWorkoutTemplates([]);
      setPRLifts([]);
      setExercises([]);
      setTrainingBlocks([]);
      setWeakPoints([]);
      setWorkoutPlans([]);
      setReminders([]);
      setMoodLogs([]);
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
      console.error("Error syncing workouts:", error.message);
      setWorkouts([]);
    });

    // Sync progress photos
    const photosRef = collection(db, `users/${userId}/progressPhotos`);
    const unsubscribePhotos = onSnapshot(photosRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProgressPhoto[];
      console.log("Progress photos synced from Firestore:", data);
      setProgressPhotos(data);
    }, (error) => {
      console.error("Error syncing progress photos:", error.message);
      setProgressPhotos([]);
    });

    // Sync body measurements
    const measurementsRef = collection(db, `users/${userId}/bodyMeasurements`);
    const unsubscribeMeasurements = onSnapshot(measurementsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BodyMeasurement[];
      console.log("Body measurements synced from Firestore:", data);
      setBodyMeasurements(data);
    }, (error) => {
      console.error("Error syncing body measurements:", error.message);
      setBodyMeasurements([]);
    });

    // Sync user supplements
    const userSupplementsRef = collection(db, `users/${userId}/userSupplements`);
    const unsubscribeUserSupplements = onSnapshot(userSupplementsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Supplement[];
      console.log("User supplements synced from Firestore:", data);
      setUserSupplements(data);
    }, (error) => {
      console.error("Error syncing user supplements:", error.message);
      setUserSupplements([]);
    });

    // Sync supplements
    const supplementsRef = collection(db, `users/${userId}/supplements`);
    const unsubscribeSupplements = onSnapshot(supplementsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Supplement[];
      console.log("Supplements synced from Firestore:", data);
      setSupplements(data);
    }, (error) => {
      console.error("Error syncing supplements:", error.message);
      setSupplements([]);
    });

    // Sync supplement logs
    const supplementLogsRef = collection(db, `users/${userId}/supplementLogs`);
    const unsubscribeSupplementLogs = onSnapshot(supplementLogsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SupplementLog[];
      console.log("Supplement logs synced from Firestore:", data);
      setSupplementLogs(data);
    }, (error) => {
      console.error("Error syncing supplement logs:", error.message);
      setSupplementLogs([]);
    });

    // Sync steroid cycles
    const steroidCyclesRef = collection(db, `users/${userId}/steroidCycles`);
    const unsubscribeSteroidCycles = onSnapshot(steroidCyclesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SteroidCycle[];
      console.log("Steroid cycles synced from Firestore:", data);
      setSteroidCycles(data);
    }, (error) => {
      console.error("Error syncing steroid cycles:", error.message);
      setSteroidCycles([]);
    });

    // Sync steroid compounds
    const steroidCompoundsRef = collection(db, `users/${userId}/steroidCompounds`);
    const unsubscribeSteroidCompounds = onSnapshot(steroidCompoundsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SteroidCompound[];
      console.log("Steroid compounds synced from Firestore:", data);
      setSteroidCompounds(data);
    }, (error) => {
      console.error("Error syncing steroid compounds:", error.message);
      setSteroidCompounds([]);
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
      console.error("Error syncing weekly recovery data:", error.message);
      setWeeklyRecoveryData(null);
    });

    // Sync weekly routines
    const routinesRef = collection(db, `users/${userId}/weeklyRoutines`);
    const unsubscribeRoutines = onSnapshot(routinesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WeeklyRoutine[];
      console.log("Weekly routines synced from Firestore:", data);
      setWeeklyRoutines(data);
    }, (error) => {
      console.error("Error syncing weekly routines:", error.message);
      setWeeklyRoutines([]);
    });

    // Sync workout templates
    const templatesRef = collection(db, `users/${userId}/workoutTemplates`);
    const unsubscribeTemplates = onSnapshot(templatesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Workout templates synced from Firestore:", data);
      setWorkoutTemplates(data);
    }, (error) => {
      console.error("Error syncing workout templates:", error.message);
      setWorkoutTemplates([]);
    });

    // Sync PR lifts
    const prLiftsRef = collection(db, `users/${userId}/prLifts`);
    const unsubscribePRLifts = onSnapshot(prLiftsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PRLift[];
      console.log("PR lifts synced from Firestore:", data);
      setPRLifts(data);
    }, (error) => {
      console.error("Error syncing PR lifts:", error.message);
      setPRLifts([]);
    });

    // Sync exercises
    const exercisesRef = collection(db, `users/${userId}/exercises`);
    const unsubscribeExercises = onSnapshot(exercisesRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Exercise[];
      console.log("Exercises synced from Firestore:", data);
      setExercises(data);
    }, (error) => {
      console.error("Error syncing exercises:", error.message);
      setExercises([]);
    });

    // Sync training blocks
    const trainingBlocksRef = collection(db, `users/${userId}/trainingBlocks`);
    const unsubscribeTrainingBlocks = onSnapshot(trainingBlocksRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TrainingBlock[];
      console.log("Training blocks synced from Firestore:", data);
      setTrainingBlocks(data);
    }, (error) => {
      console.error("Error syncing training blocks:", error.message);
      setTrainingBlocks([]);
    });

    // Sync weak points
    const weakPointsRef = collection(db, `users/${userId}/weakPoints`);
    const unsubscribeWeakPoints = onSnapshot(weakPointsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WeakPoint[];
      console.log("Weak points synced from Firestore:", data);
      setWeakPoints(data);
    }, (error) => {
      console.error("Error syncing weak points:", error.message);
      setWeakPoints([]);
    });

    // Sync workout plans
    const workoutPlansRef = collection(db, `users/${userId}/workoutPlans`);
    const unsubscribeWorkoutPlans = onSnapshot(workoutPlansRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WorkoutPlan[];
      console.log("Workout plans synced from Firestore:", data);
      setWorkoutPlans(data);
    }, (error) => {
      console.error("Error syncing workout plans:", error.message);
      setWorkoutPlans([]);
    });

    // Sync reminders
    const remindersRef = collection(db, `users/${userId}/reminders`);
    const unsubscribeReminders = onSnapshot(remindersRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Reminder[];
      console.log("Reminders synced from Firestore:", data);
      setReminders(data);
    }, (error) => {
      console.error("Error syncing reminders:", error.message);
      setReminders([]);
    });

    // Sync mood logs
    const moodLogsRef = collection(db, `users/${userId}/moodLogs`);
    const unsubscribeMoodLogs = onSnapshot(moodLogsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MoodLog[];
      console.log("Mood logs synced from Firestore:", data);
      setMoodLogs(data);
    }, (error) => {
      console.error("Error syncing mood logs:", error.message);
      setMoodLogs([]);
    });

    // Cleanup on unmount or user change
    return () => {
      unsubscribeWorkouts();
      unsubscribePhotos();
      unsubscribeMeasurements();
      unsubscribeUserSupplements();
      unsubscribeSupplements();
      unsubscribeSupplementLogs();
      unsubscribeSteroidCycles();
      unsubscribeSteroidCompounds();
      unsubscribeRecovery();
      unsubscribeRoutines();
      unsubscribeTemplates();
      unsubscribePRLifts();
      unsubscribeExercises();
      unsubscribeTrainingBlocks();
      unsubscribeWeakPoints();
      unsubscribeWorkoutPlans();
      unsubscribeReminders();
      unsubscribeMoodLogs();
    };
  }, [user]);

  // Update Firestore when state changes
  const updateFirestore = async (path: string, data: any, merge: boolean = false) => {
    if (!user) return;
    const userId = user.uid;
    try {
      if (path.includes('/')) {
        await setDoc(doc(db, `users/${userId}/${path}`), data, { merge });
      } else {
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

  useEffect(() => { if (user) updateFirestore("workouts", workouts); }, [workouts, user]);
  useEffect(() => { if (user) updateFirestore("progressPhotos", progressPhotos); }, [progressPhotos, user]);
  useEffect(() => { if (user) updateFirestore("bodyMeasurements", bodyMeasurements); }, [bodyMeasurements, user]);
  useEffect(() => { if (user) updateFirestore("userSupplements", userSupplements); }, [userSupplements, user]);
  useEffect(() => { if (user) updateFirestore("supplements", supplements); }, [supplements, user]);
  useEffect(() => { if (user) updateFirestore("supplementLogs", supplementLogs); }, [supplementLogs, user]);
  useEffect(() => { if (user) updateFirestore("steroidCycles", steroidCycles); }, [steroidCycles, user]);
  useEffect(() => { if (user) updateFirestore("steroidCompounds", steroidCompounds); }, [steroidCompounds, user]);
  useEffect(() => { if (user && weeklyRecoveryData) updateFirestore("weeklyRecoveryData/current", weeklyRecoveryData, true); }, [weeklyRecoveryData, user]);
  useEffect(() => { if (user) updateFirestore("weeklyRoutines", weeklyRoutines); }, [weeklyRoutines, user]);
  useEffect(() => { if (user) updateFirestore("workoutTemplates", workoutTemplates); }, [workoutTemplates, user]);
  useEffect(() => { if (user) updateFirestore("prLifts", prLifts); }, [prLifts, user]);
  useEffect(() => { if (user) updateFirestore("exercises", exercises); }, [exercises, user]);
  useEffect(() => { if (user) updateFirestore("trainingBlocks", trainingBlocks); }, [trainingBlocks, user]);
  useEffect(() => { if (user) updateFirestore("weakPoints", weakPoints); }, [weakPoints, user]);
  useEffect(() => { if (user) updateFirestore("workoutPlans", workoutPlans); }, [workoutPlans, user]);
  useEffect(() => { if (user) updateFirestore("reminders", reminders); }, [reminders, user]);
  useEffect(() => { if (user) updateFirestore("moodLogs", moodLogs); }, [moodLogs, user]);

  const addWorkout = async (name: string, exercises: Exercise[] = [], additionalData: Partial<Workout> = {}) => {
    const newWorkout: Workout = {
      id: additionalData.id || Date.now().toString(),
      name,
      exercises,
      completed: additionalData.completed ?? false,
      date: additionalData.date || new Date().toISOString(),
      notes: additionalData.notes || "",
    };
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    return newWorkout.id;
  };

  const updateWorkout = async (id: string, updatedWorkout: Workout) => {
    const updatedWorkouts = workouts.map(w => (w.id === id ? updatedWorkout : w));
    setWorkouts(updatedWorkouts);
  };

  const deleteWorkout = async (id: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== id);
    setWorkouts(updatedWorkouts);
  };

  const markWorkoutCompleted = async (id: string) => {
    const updatedWorkouts = workouts.map(w => (w.id === id ? { ...w, completed: true } : w));
    setWorkouts(updatedWorkouts);
  };

  const addSupplement = async (supplement: Omit<Supplement, "id">) => {
    const newSupplement = { ...supplement, id: Date.now().toString() };
    const updatedSupplements = [...supplements, newSupplement];
    setSupplements(updatedSupplements);
  };

  const updateSupplement = async (id: string, updatedSupplement: Supplement) => {
    const updatedSupplements = supplements.map(s => (s.id === id ? updatedSupplement : s));
    setSupplements(updatedSupplements);
  };

  const addSupplementLog = async (log: Omit<SupplementLog, "id">) => {
    const newLog = { ...log, id: Date.now().toString() };
    const updatedLogs = [...supplementLogs, newLog];
    setSupplementLogs(updatedLogs);
  };

  const updateSupplementLog = async (id: string, updatedLog: SupplementLog) => {
    const updatedLogs = supplementLogs.map(log => (log.id === id ? updatedLog : log));
    setSupplementLogs(updatedLogs);
  };

  const addSteroidCycle = async (cycle: Omit<SteroidCycle, "id">) => {
    const newCycle = { ...cycle, id: Date.now().toString() };
    const updatedCycles = [...steroidCycles, newCycle];
    setSteroidCycles(updatedCycles);
  };

  const updateSteroidCycle = async (id: string, updatedCycle: SteroidCycle) => {
    const updatedCycles = steroidCycles.map(c => (c.id === id ? updatedCycle : c));
    setSteroidCycles(updatedCycles);
  };

  const addCompound = async (compound: Omit<SteroidCompound, "id">) => {
    const newCompound = { ...compound, id: Date.now().toString() };
    const updatedCompounds = [...steroidCompounds, newCompound];
    setSteroidCompounds(updatedCompounds);
  };

  const updateCompound = async (id: string, updatedCompound: SteroidCompound) => {
    const updatedCompounds = steroidCompounds.map(c => (c.id === id ? updatedCompound : c));
    setSteroidCompounds(updatedCompounds);
  };

  const deleteCompound = async (id: string) => {
    const updatedCompounds = steroidCompounds.filter(c => c.id !== id);
    setSteroidCompounds(updatedCompounds);
  };

  const addWeeklyRoutine = async (routine: Omit<WeeklyRoutine, "id">) => {
    const newRoutine = { ...routine, id: Date.now().toString(), archived: false };
    const updatedRoutines = [...weeklyRoutines, newRoutine];
    setWeeklyRoutines(updatedRoutines);
  };

  const updateWeeklyRoutine = async (id: string, updatedRoutine: WeeklyRoutine) => {
    const updatedRoutines = weeklyRoutines.map(r => (r.id === id ? updatedRoutine : r));
    setWeeklyRoutines(updatedRoutines);
  };

  const deleteWeeklyRoutine = async (id: string) => {
    const updatedRoutines = weeklyRoutines.filter(r => r.id !== id);
    setWeeklyRoutines(updatedRoutines);
  };

  const duplicateWeeklyRoutine = async (id: string) => {
    const routine = weeklyRoutines.find(r => r.id === id);
    if (routine) {
      const newRoutine = { ...routine, id: Date.now().toString(), name: `${routine.name} (Copy)` };
      const updatedRoutines = [...weeklyRoutines, newRoutine];
      setWeeklyRoutines(updatedRoutines);
    }
  };

  const archiveWeeklyRoutine = async (id: string) => {
    const updatedRoutines = weeklyRoutines.map(r => (r.id === id ? { ...r, archived: true } : r));
    setWeeklyRoutines(updatedRoutines);
  };

  const addWorkoutTemplate = async (template: any) => {
    const updatedTemplates = [...workoutTemplates, template];
    setWorkoutTemplates(updatedTemplates);
  };

  const updateWorkoutTemplate = async (id: string, updatedTemplate: any) => {
    const updatedTemplates = workoutTemplates.map(t => (t.id === id ? updatedTemplate : t));
    setWorkoutTemplates(updatedTemplates);
  };

  const getWorkoutById = (id: string) => {
    return workouts.find(workout => workout.id === id);
  };

  const addPRLift = async (prLift: Omit<PRLift, "id">) => {
    const newPRLift = {
      ...prLift,
      id: `${prLift.exercise}-${Date.now()}`,
    };
    const updatedPRLifts = [...prLifts, newPRLift];
    setPRLifts(updatedPRLifts);
  };

  const addExercise = async (exercise: Omit<Exercise, "id">) => {
    const newExercise = { ...exercise, id: Date.now().toString() };
    const updatedExercises = [...exercises, newExercise];
    setExercises(updatedExercises);
  };

  const updateExercise = async (id: string, updatedExercise: Exercise) => {
    const updatedExercises = exercises.map(e => (e.id === id ? updatedExercise : e));
    setExercises(updatedExercises);
  };

  const addTrainingBlock = async (block: Omit<TrainingBlock, "id">) => {
    const newBlock = { ...block, id: Date.now().toString() };
    const updatedBlocks = [...trainingBlocks, newBlock];
    setTrainingBlocks(updatedBlocks);
  };

  const updateTrainingBlock = async (id: string, updatedBlock: TrainingBlock) => {
    const updatedBlocks = trainingBlocks.map(b => (b.id === id ? updatedBlock : b));
    setTrainingBlocks(updatedBlocks);
  };

  const addWeakPoint = async (weakPoint: Omit<WeakPoint, "id">) => {
    const newWeakPoint = { ...weakPoint, id: Date.now().toString() };
    const updatedWeakPoints = [...weakPoints, newWeakPoint];
    setWeakPoints(updatedWeakPoints);
  };

  const deleteWeakPoint = async (id: string) => {
    const updatedWeakPoints = weakPoints.filter(wp => wp.id !== id);
    setWeakPoints(updatedWeakPoints);
  };

  const addWorkoutPlan = async (plan: Omit<WorkoutPlan, "id">) => {
    const newPlan = { ...plan, id: Date.now().toString(), active: false };
    const updatedPlans = [...workoutPlans, newPlan];
    setWorkoutPlans(updatedPlans);
  };

  const updateWorkoutPlan = async (id: string, updatedPlan: WorkoutPlan) => {
    const updatedPlans = workoutPlans.map(p => (p.id === id ? updatedPlan : p));
    setWorkoutPlans(updatedPlans);
  };

  const deleteWorkoutPlan = async (id: string) => {
    const updatedPlans = workoutPlans.filter(p => p.id !== id);
    setWorkoutPlans(updatedPlans);
  };

  const duplicateWorkoutPlan = async (id: string) => {
    const plan = workoutPlans.find(p => p.id === id);
    if (plan) {
      const newPlan = { ...plan, id: Date.now().toString(), name: `${plan.name} (Copy)`, active: false };
      const updatedPlans = [...workoutPlans, newPlan];
      setWorkoutPlans(updatedPlans);
    }
  };

  const setActivePlan = async (id: string) => {
    const updatedPlans = workoutPlans.map(p => ({
      ...p,
      active: p.id === id,
    }));
    setWorkoutPlans(updatedPlans);
  };

  const addTemplateToPlan = async (planId: string, template: any) => {
    const updatedPlans = workoutPlans.map(p => {
      if (p.id === planId) {
        return { ...p, templates: [...p.templates, template] };
      }
      return p;
    });
    setWorkoutPlans(updatedPlans);
  };

  const removeTemplateFromPlan = async (planId: string, templateId: string) => {
    const updatedPlans = workoutPlans.map(p => {
      if (p.id === planId) {
        return { ...p, templates: p.templates.filter(t => t.id !== templateId) };
      }
      return p;
    });
    setWorkoutPlans(updatedPlans);
  };

  const duplicateWorkoutTemplate = async (id: string) => {
    const template = workoutTemplates.find(t => t.id === id);
    if (template) {
      const newTemplate = { ...template, id: Date.now().toString(), name: `${template.name} (Copy)` };
      const updatedTemplates = [...workoutTemplates, newTemplate];
      setWorkoutTemplates(updatedTemplates);
    }
  };

  const addReminder = async (reminder: Omit<Reminder, "id">) => {
    const newReminder = { ...reminder, id: Date.now().toString(), seen: false };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
  };

  const getDueReminders = () => {
    const now = new Date();
    return reminders.filter(r => !r.seen && new Date(r.dueDate) <= now);
  };

  const markReminderAsSeen = async (id: string) => {
    const updatedReminders = reminders.map(r => (r.id === id ? { ...r, seen: true } : r));
    setReminders(updatedReminders);
  };

  const dismissReminder = async (id: string) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    setReminders(updatedReminders);
  };

  const addMoodLog = async (log: Omit<MoodLog, "id">) => {
    const newLog = { ...log, id: Date.now().toString() };
    const updatedLogs = [...moodLogs, newLog];
    setMoodLogs(updatedLogs);
  };

  const updateMoodLog = async (id: string, updatedLog: MoodLog) => {
    const updatedLogs = moodLogs.map(log => (log.id === id ? updatedLog : log));
    setMoodLogs(updatedLogs);
  };

  const toggleDeloadMode = async () => {
    // Placeholder for deload mode logic
    console.log("Toggling deload mode");
  };

  const exportData = async () => {
    const data = {
      workouts,
      progressPhotos,
      bodyMeasurements,
      userSupplements,
      supplements,
      supplementLogs,
      steroidCycles,
      steroidCompounds,
      weeklyRecoveryData,
      weeklyRoutines,
      workoutTemplates,
      prLifts,
      exercises,
      trainingBlocks,
      weakPoints,
      workoutPlans,
      reminders,
      moodLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ironlog-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertWeight = (value: number, fromUnit: string, toUnit: string) => {
    if (fromUnit === toUnit) return value;
    const conversionFactors: { [key: string]: number } = {
      kg: 1,
      lbs: 2.20462,
    };
    return value * (conversionFactors[toUnit] / conversionFactors[fromUnit]);
  };

  const convertMeasurement = (value: number, fromUnit: string, toUnit: string) => {
    if (fromUnit === toUnit) return value;
    const conversionFactors: { [key: string]: number } = {
      cm: 1,
      inches: 0.393701,
    };
    return value * (conversionFactors[toUnit] / conversionFactors[fromUnit]);
  };

  const getWeightUnitDisplay = () => unitSystem.liftingWeightUnit;
  const getMeasurementUnitDisplay = () => unitSystem.bodyMeasurementUnit;

  const updateUnitSystem = async (newSystem: { bodyWeightUnit: string; bodyMeasurementUnit: string; liftingWeightUnit: string }) => {
    setUnitSystem(newSystem);
  };

  const value = useMemo(
    () => ({
      user,
      userProfile,
      workouts,
      setWorkouts,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      markWorkoutCompleted,
      progressPhotos,
      setProgressPhotos,
      bodyMeasurements,
      setBodyMeasurements,
      userSupplements,
      setUserSupplements,
      supplements,
      supplementLogs,
      steroidCycles,
      steroidCompounds,
      addSupplement,
      updateSupplement,
      addSupplementLog,
      updateSupplementLog,
      addSteroidCycle,
      updateSteroidCycle,
      addCompound,
      updateCompound,
      deleteCompound,
      weeklyRecoveryData,
      setWeeklyRecoveryData,
      weeklyRoutines,
      setWeeklyRoutines,
      addWeeklyRoutine,
      updateWeeklyRoutine,
      deleteWeeklyRoutine,
      duplicateWeeklyRoutine,
      archiveWeeklyRoutine,
      workoutTemplates,
      setWorkoutTemplates,
      addWorkoutTemplate,
      updateWorkoutTemplate,
      getWorkoutById,
      prLifts,
      setPRLifts,
      addPRLift,
      unitSystem,
      convertWeight,
      convertMeasurement,
      getWeightUnitDisplay,
      getMeasurementUnitDisplay,
      updateUnitSystem,
      exercises,
      addExercise,
      updateExercise,
      trainingBlocks,
      addTrainingBlock,
      updateTrainingBlock,
      weakPoints,
      addWeakPoint,
      deleteWeakPoint,
      workoutPlans,
      addWorkoutPlan,
      updateWorkoutPlan,
      deleteWorkoutPlan,
      duplicateWorkoutPlan,
      setActivePlan,
      addTemplateToPlan,
      removeTemplateFromPlan,
      duplicateWorkoutTemplate,
      reminders,
      addReminder,
      getDueReminders,
      markReminderAsSeen,
      dismissReminder,
      moodLogs,
      addMoodLog,
      updateMoodLog,
      toggleDeloadMode,
      exportData,
    }),
    [
      user,
      userProfile,
      workouts,
      progressPhotos,
      bodyMeasurements,
      userSupplements,
      supplements,
      supplementLogs,
      steroidCycles,
      steroidCompounds,
      weeklyRecoveryData,
      weeklyRoutines,
      workoutTemplates,
      prLifts,
      exercises,
      trainingBlocks,
      weakPoints,
      workoutPlans,
      reminders,
      moodLogs,
      unitSystem,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
