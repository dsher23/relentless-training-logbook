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

  /** Create a blank workout (completed = false) */
  const addWorkout = useCallback(
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

  /* ----------  Expose API ---------- */
  return {
    workouts,
    addWorkout,
    updateWorkout,
    markWorkoutCompleted,
    deleteWorkout,
    /* expose setter in case higher-level components need it */
    setWorkouts,
  };
}
