
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

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
  }
};

export const migrateLocalData = async (userId: string) => {
  try {
    // Check if migration has already been done
    const migrationFlag = localStorage.getItem("hasMigrated");
    if (migrationFlag) {
      console.log("Migration already completed.");
      return;
    }

    // Migrate workouts
    const workouts = safeLocalStorage.getItem("workouts", []);
    if (Array.isArray(workouts) && workouts.length > 0) {
      for (const workout of workouts) {
        await setDoc(doc(db, `users/${userId}/workouts/${workout.id}`), workout);
      }
      console.log("Migrated workouts to Firestore:", workouts.length);
    }

    // Migrate progress photos
    const progressPhotos = safeLocalStorage.getItem("progressPhotos", []);
    if (Array.isArray(progressPhotos) && progressPhotos.length > 0) {
      for (const photo of progressPhotos) {
        await setDoc(doc(db, `users/${userId}/progressPhotos/${photo.id}`), photo);
      }
      console.log("Migrated progress photos to Firestore:", progressPhotos.length);
    }

    // Migrate body measurements
    const bodyMeasurements = safeLocalStorage.getItem("bodyMeasurements", []);
    if (Array.isArray(bodyMeasurements) && bodyMeasurements.length > 0) {
      for (const measurement of bodyMeasurements) {
        await setDoc(doc(db, `users/${userId}/bodyMeasurements/${measurement.id}`), measurement);
      }
      console.log("Migrated body measurements to Firestore:", bodyMeasurements.length);
    }

    // Migrate weekly recovery data
    const weeklyRecoveryData = safeLocalStorage.getItem("weeklyRecoveryData");
    if (weeklyRecoveryData) {
      await setDoc(doc(db, `users/${userId}/weeklyRecoveryData/current`), weeklyRecoveryData);
      console.log("Migrated weekly recovery data to Firestore");
    }

    // Migrate weekly routines
    const weeklyRoutines = safeLocalStorage.getItem("weeklyRoutines", []);
    if (Array.isArray(weeklyRoutines) && weeklyRoutines.length > 0) {
      for (const routine of weeklyRoutines) {
        await setDoc(doc(db, `users/${userId}/weeklyRoutines/${routine.id}`), routine);
      }
      console.log("Migrated weekly routines to Firestore:", weeklyRoutines.length);
    }

    // Migrate workout templates
    const workoutTemplates = safeLocalStorage.getItem("workoutTemplates", []);
    if (Array.isArray(workoutTemplates) && workoutTemplates.length > 0) {
      for (const template of workoutTemplates) {
        await setDoc(doc(db, `users/${userId}/workoutTemplates/${template.id}`), template);
      }
      console.log("Migrated workout templates to Firestore:", workoutTemplates.length);
    }

    // Set migration flag
    localStorage.setItem("hasMigrated", "true");
    console.log("Migration completed.");
  } catch (error) {
    console.error("Migration error:", error);
  }
};
