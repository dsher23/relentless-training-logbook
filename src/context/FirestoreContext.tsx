
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAppContext } from './AppContext';
import { BodyMeasurement, MoodLog, PRLift, ProgressPhoto, Workout, WeeklyRoutine, SteroidCycle } from '@/types';

interface MoodLogData extends MoodLog {}

interface FirestoreContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  syncData: () => Promise<void>;
  user: User | null;
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export const FirestoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    setWorkouts, 
    setWorkoutTemplates, 
    setBodyMeasurements, 
    setProgressPhotos,
    // Handle properties that might be missing from AppContextType
    setMoodLogs = () => {},
    setTrainingBlocks = () => {},
    setWeeklyRoutines = () => {},
    setPRLifts = () => {},
    setSupplements = () => {},
    workouts,
    workoutTemplates,
    bodyMeasurements,
    progressPhotos,
    moodLogs = [],
    trainingBlocks = [],
    weeklyRoutines = [],
    prLifts = [],
    supplements = [],
    setUserProfile = () => {}
  } = useAppContext();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      if (currentUser) {
        // Load user data from Firestore when authenticated
        syncData();
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to sync data between local state and Firestore
  const syncData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userId = user.uid;
      
      // Load user profile
      const userProfileRef = doc(db, `users/${userId}/profile/info`);
      const userProfileSnap = await getDoc(userProfileRef);
      if (userProfileSnap.exists()) {
        setUserProfile(userProfileSnap.data());
      } else {
        // Create default profile if it doesn't exist
        await setDoc(userProfileRef, {
          displayName: user.displayName || "User",
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }
      
      // Load workouts
      const workoutsRef = collection(db, `users/${userId}/workouts`);
      const workoutsSnap = await getDocs(workoutsRef);
      const workoutsData = workoutsSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        name: doc.data().name || "Workout",
        exercises: doc.data().exercises || [],
        completed: doc.data().completed || false,
        date: doc.data().date || new Date().toISOString()
      })) as Workout[];
      setWorkouts(workoutsData);
      
      // Load workout templates
      const templatesRef = collection(db, `users/${userId}/workoutTemplates`);
      const templatesSnap = await getDocs(templatesRef);
      const templatesData = templatesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkoutTemplates(templatesData);
      
      // Load body measurements
      const measurementsRef = collection(db, `users/${userId}/bodyMeasurements`);
      const measurementsSnap = await getDocs(measurementsRef);
      const measurementsData = measurementsSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        date: doc.data().date || new Date().toISOString()
      })) as BodyMeasurement[];
      setBodyMeasurements(measurementsData);
      
      // Load progress photos
      const photosRef = collection(db, `users/${userId}/progressPhotos`);
      const photosSnap = await getDocs(photosRef);
      const photosData = photosSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        url: doc.data().url || "",
        date: doc.data().date || new Date().toISOString()
      })) as ProgressPhoto[];
      setProgressPhotos(photosData);
      
      // Fetch mood logs
      try {
        const moodLogsSnapshot = await getDocs(collection(db, `users/${userId}/moodLogs`));
        const moodLogsData = moodLogsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMoodLogs(moodLogsData as MoodLog[]);
      } catch (error) {
        console.error("Error fetching mood logs:", error);
      }
      
      // Load training blocks
      const blocksRef = collection(db, `users/${userId}/trainingBlocks`);
      const blocksSnap = await getDocs(blocksRef);
      const blocksData = blocksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrainingBlocks(blocksData);
      
      // Load weekly routines
      const routinesRef = collection(db, `users/${userId}/weeklyRoutines`);
      const routinesSnap = await getDocs(routinesRef);
      const routinesData = routinesSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        name: doc.data().name || "Routine",
        workouts: doc.data().workouts || [],
        startDate: doc.data().startDate || new Date().toISOString(),
        endDate: doc.data().endDate || new Date().toISOString(),
        workoutDays: doc.data().workoutDays || [],
        days: doc.data().days || {},
        archived: doc.data().archived || false
      })) as WeeklyRoutine[];
      setWeeklyRoutines(routinesData);
      
      // Load PR lifts
      const prLiftsRef = collection(db, `users/${userId}/prLifts`);
      const prLiftsSnap = await getDocs(prLiftsRef);
      const prLiftsData = prLiftsSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        exercise: doc.data().exercise || "",
        weight: doc.data().weight || 0,
        date: doc.data().date || new Date().toISOString(),
        reps: doc.data().reps || 0
      })) as PRLift[];
      setPRLifts(prLiftsData);
      
      // Load supplements
      const supplementsRef = collection(db, `users/${userId}/supplements`);
      const supplementsSnap = await getDocs(supplementsRef);
      const supplementsData = supplementsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSupplements(supplementsData);
      
    } catch (error) {
      console.error("Error syncing data with Firestore:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync data back to Firestore when local state changes
  useEffect(() => {
    if (!user) return;
    
    const saveToFirestore = async (collectionName: string, data: any[]) => {
      try {
        const userId = user.uid;
        
        for (const item of data) {
          if (!item.id) continue;
          
          const itemRef = doc(db, `users/${userId}/${collectionName}/${item.id}`);
          await setDoc(itemRef, item, { merge: true });
        }
      } catch (error) {
        console.error(`Error saving ${collectionName} to Firestore:`, error);
      }
    };
    
    saveToFirestore('workouts', workouts);
    saveToFirestore('workoutTemplates', workoutTemplates);
    saveToFirestore('bodyMeasurements', bodyMeasurements);
    saveToFirestore('progressPhotos', progressPhotos);
    saveToFirestore('moodLogs', moodLogs);
    saveToFirestore('trainingBlocks', trainingBlocks);
    saveToFirestore('weeklyRoutines', weeklyRoutines);
    saveToFirestore('prLifts', prLifts);
    saveToFirestore('supplements', supplements);
    
  }, [
    user,
    workouts,
    workoutTemplates,
    bodyMeasurements,
    progressPhotos,
    moodLogs,
    trainingBlocks,
    weeklyRoutines,
    prLifts,
    supplements
  ]);

  return (
    <FirestoreContext.Provider value={{ 
      isAuthenticated: !!user, 
      isLoading, 
      syncData,
      user
    }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
};
