import React, { createContext, useState, useMemo } from 'react';
import { AppContextType, Workout, Measurement, Supplement, Cycle, Exercise } from '@/types';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'Bench Press', category: 'upper', sets: 3, reps: 10, weight: 0 },
    { id: '2', name: 'Squat', category: 'lower', sets: 3, reps: 8, weight: 0 },
    { id: '3', name: 'Deadlift', category: 'lower', sets: 3, reps: 6, weight: 0 },
    { id: '4', name: 'Pull-Up', category: 'upper', sets: 3, reps: 8, weight: 0 },
    { id: '5', name: 'Plank', category: 'core', sets: 3, reps: 30, weight: 0 },
  ]);

  const addWorkout = (name: string, exercises: Exercise[] = [], additionalData: Partial<Workout> = {}) => {
    const id = uuidv4();
    const newWorkout: Workout = { id, name, date: new Date(), exercises, ...additionalData };
    setWorkouts([...workouts, newWorkout]);
    return id;
  };

  const updateWorkout = (updated: Workout) => {
    setWorkouts(workouts.map((w) => (w.id === updated.id ? updated : w)));
  };

  const markWorkoutCompleted = (id: string) => {
    setWorkouts(workouts.map((w) => (w.id === id ? { ...w, completed: true } : w)));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  const getWorkoutById = (id: string) => {
    return workouts.find((w) => w.id === id);
  };

  const duplicateWorkout = (id: string) => {
    const workout = workouts.find((w) => w.id === id);
    if (workout) {
      const newWorkout = { ...workout, id: uuidv4(), name: `${workout.name} (Copy)` };
      setWorkouts([...workouts, newWorkout]);
    }
  };

  const toggleDeloadMode = (id: string) => {
    setWorkouts(workouts.map((w) => (w.id === id ? { ...w, deloadMode: !w.deloadMode } : w)));
  };

  const addSupplement = (supplement: Supplement) => {
    setSupplements([...supplements, supplement]);
  };

  const updateSupplement = (updated: Supplement) => {
    setSupplements(supplements.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteSupplement = (id: string) => {
    setSupplements(supplements.filter((s) => s.id !== id));
  };

  const addCycle = (cycle: Cycle) => {
    setCycles([...cycles, cycle]);
  };

  const updateCycle = (updated: Cycle) => {
    setCycles(cycles.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCycle = (id: string) => {
    setCycles(cycles.filter((c) => c.id !== id));
  };

  const markSupplementTaken = (supplementId: string, date: Date, taken: boolean) => {
    setSupplements(
      supplements.map((s) =>
        s.id === supplementId ? { ...s, history: [...s.history, { date, taken }] } : s
      )
    );
  };

  const markCycleTaken = (cycleId: string, date: Date, taken: boolean) => {
    setCycles(
      cycles.map((c) =>
        c.id === cycleId ? { ...c, history: [...c.history, { date, taken }] } : c
      )
    );
  };

  const addExercise = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
  };

  const value = useMemo(
    () => ({
      workouts,
      setWorkouts,
      measurements,
      setMeasurements,
      supplements,
      setSupplements,
      cycles,
      setCycles,
      exercises,
      setExercises,
      addWorkout,
      updateWorkout,
      markWorkoutCompleted,
      deleteWorkout,
      getWorkoutById,
      duplicateWorkout,
      toggleDeloadMode,
      addSupplement,
      updateSupplement,
      deleteSupplement,
      addCycle,
      updateCycle,
      deleteCycle,
      markSupplementTaken,
      markCycleTaken,
      addExercise,
    }),
    [workouts, measurements, supplements, cycles, exercises]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
