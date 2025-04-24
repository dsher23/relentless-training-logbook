
import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";

/* ----------  Type defs ---------- */

export interface SetEntry {
  weight: number;
  reps: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: SetEntry[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;          // ISO string
  completed: boolean;    // ← ALWAYS boolean!
  exercises: Exercise[];
  isDeload?: boolean;    // Added for deload mode
}

/* ----------  Hook ---------- */

const STORAGE_KEY = "ironlog_workouts";

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  /* Load once on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Workout[] = JSON.parse(raw);

        // Force boolean for completed flag
        parsed.forEach((w) => (w.completed = w.completed === true));

        setWorkouts(parsed);
      }
    } catch (err) {
      console.error("Failed to parse workouts from localStorage", err);
    }
  }, []);

  /* Persist whenever workouts change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  /* ----------  CRUD helpers ---------- */

  /** Create a workout from provided workout object */
  const addWorkout = useCallback(
    (workout: Workout) => {
      const newWorkout: Workout = {
        id: workout.id || uuid(),
        name: workout.name,
        date: workout.date || new Date().toISOString(),
        completed: workout.completed === true,
        exercises: workout.exercises || [],
        isDeload: workout.isDeload
      };
      setWorkouts((prev) => [...prev, newWorkout]);
      return newWorkout.id;
    },
    []
  );

  // Legacy version for backward compatibility
  const addWorkoutByName = useCallback(
    (name: string, exercises: Exercise[] = []) => {
      const newWorkout: Workout = {
        id: uuid(),
        name,
        date: new Date().toISOString(),
        completed: false,
        exercises,
      };
      setWorkouts((prev) => [...prev, newWorkout]);
      return newWorkout.id;
    },
    []
  );

  /** Replace an existing workout (ensure boolean) */
  const updateWorkout = useCallback((updated: Workout) => {
    updated.completed = updated.completed === true;
    setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  }, []);

  /** Mark a workout finished */
  const markWorkoutCompleted = useCallback((id: string) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: true } : w))
    );
  }, []);

  /** Delete by id */
  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, []);
  
  /** Get workout by id */
  const getWorkoutById = useCallback((id: string) => {
    return workouts.find(w => w.id === id) || { 
      id: '', 
      name: '', 
      date: '', 
      completed: false, 
      exercises: [] 
    };
  }, [workouts]);
  
  /** Duplicate a workout */
  const duplicateWorkout = useCallback((id: string) => {
    const workoutToDuplicate = workouts.find(w => w.id === id);
    if (workoutToDuplicate) {
      const newWorkout = {
        ...workoutToDuplicate,
        id: uuid(),
        name: `${workoutToDuplicate.name} (Copy)`,
        completed: false,
        date: new Date().toISOString()
      };
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout.id;
    }
    return null;
  }, [workouts]);
  
  /** Toggle deload mode for a workout */
  const toggleDeloadMode = useCallback((id: string, isDeload: boolean) => {
    setWorkouts(prev => 
      prev.map(w => w.id === id ? { ...w, isDeload } : w)
    );
  }, []);

  /* ----------  Expose API ---------- */
  return {
    workouts,
    addWorkout,
    addWorkoutByName, // Backward compatibility
    updateWorkout,
    markWorkoutCompleted,
    deleteWorkout,
    getWorkoutById,
    duplicateWorkout,
    toggleDeloadMode,
    /* expose setter in case higher-level components need it */
    setWorkouts,
  };
}
