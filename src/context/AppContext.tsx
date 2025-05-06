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
}

interface UserProfile {
  displayName?: string;
  email?: string;
  createdAt?: string;
}

interface AppContextType {
  user: User | null;
  userProfile: UserProfile | null;
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  progressPhotos: ProgressPhoto[];
  setProgressPhotos: (photos: ProgressPhoto[]) => void;
  bodyMeasurements: BodyMeasurement[];
  setBodyMeasurements: (measurements: BodyMeasurement[]) => void;
  userSupplements: Supplement[];
  setUserSupplements: (supplements: Supplement[]) => void;
  weeklyRecoveryData: WeeklyRecoveryData | null;
  setWeeklyRecoveryData: (data: WeeklyRecoveryData | null) => void;
  weeklyRoutines: any[];
  setWeeklyRoutines: (routines: any[]) => void;
  workoutTemplates: any[];
  setWorkoutTemplates: (templates: any[]) => void;
  addWorkoutTemplate: (template: any) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  prLifts: PRLift[];
  setPRLifts: (prLifts: PRLift[]) => void;
  addPRLift: (prLift: Omit<PRLift, "id">) => void;
  unitSystem: { bodyWeightUnit: string; bodyMeasurementUnit: string; liftingWeightUnit: string };
  convertWeight: (value: number, fromUnit: string, toUnit: string) => number;
  getWeightUnitDisplay: () => string;
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
  const [weeklyRecoveryData, setWeeklyRecoveryData] = useState<WeeklyRecoveryData | null>(null);
  const [weeklyRoutines, setWeeklyRoutines] = useState<any[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<any[]>([]);
  const [prLifts, setPRLifts] = useState<PRLift[]>([]);
  const [unitSystem] = useState({
    bodyWeightUnit: "kg",
    bodyMeasurementUnit: "cm",
    liftingWeightUnit: "kg",
  });

  // Firebase Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log("Auth state changed:", firebaseUser ? `User logged in: ${firebaseUser.uid}` : "User logged out");

      // Run migration after user signs in
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
        });
      }
    }, (error) => {
      console.error("Error syncing user profile from Firestore:", error.message);
      // Fallback to default values if Firestore fetch fails
      setUserProfile({
        displayName: user.displayName || "User",
        email: user.email || "",
        createdAt: new Date().toISOString(),
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
      setWeeklyRecoveryData(null);
      setWeeklyRoutines([]);
      setWorkoutTemplates([]);
      setPRLifts([]);
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
    const supplementsRef = collection(db, `users/${userId}/userSupplements`);
    const unsubscribeSupplements = onSnapshot(supplementsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Supplement[];
      console.log("User supplements synced from Firestore:", data);
      setUserSupplements(data);
    }, (error) => {
      console.error("Error syncing user supplements:", error.message);
      setUserSupplements([]);
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
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
  useEffect(() => { if (user && weeklyRecoveryData) updateFirestore("weeklyRecoveryData/current", weeklyRecoveryData, true); }, [weeklyRecoveryData, user]);
  useEffect(() => { if (user) updateFirestore("weeklyRoutines", weeklyRoutines); }, [weeklyRoutines, user]);
  useEffect(() => { if (user) updateFirestore("workoutTemplates", workoutTemplates); }, [workoutTemplates, user]);
  useEffect(() => { if (user) updateFirestore("prLifts", prLifts); }, [prLifts, user]);

  const addWorkoutTemplate = async (template: any) => {
    const updatedTemplates = [...workoutTemplates, template];
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

  const convertWeight = (value: number, fromUnit: string, toUnit: string) => {
    if (fromUnit === toUnit) return value;
    const conversionFactors: { [key: string]: number } = {
      kg: 1,
      lbs: 2.20462,
    };
    return value * (conversionFactors[toUnit] / conversionFactors[fromUnit]);
  };

  const getWeightUnitDisplay = () => unitSystem.liftingWeightUnit;

  const value = useMemo(
    () => ({
      user,
      userProfile,
      workouts,
      setWorkouts,
      progressPhotos,
      setProgressPhotos,
      bodyMeasurements,
      setBodyMeasurements,
      userSupplements,
      setUserSupplements,
      weeklyRecoveryData,
      setWeeklyRecoveryData,
      weeklyRoutines,
      setWeeklyRoutines,
      workoutTemplates,
      setWorkoutTemplates,
      addWorkoutTemplate,
      getWorkoutById,
      prLifts,
      setPRLifts,
      addPRLift,
      unitSystem,
      convertWeight,
      getWeightUnitDisplay,
    }),
    [
      user,
      userProfile,
      workouts,
      progressPhotos,
      bodyMeasurements,
      userSupplements,
      weeklyRecoveryData,
      weeklyRoutines,
      workoutTemplates,
      prLifts,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
