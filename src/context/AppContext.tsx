import React, { createContext, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type { 
  Workout, 
  Measurement, 
  BodyMeasurement, 
  Supplement, 
  Cycle, 
  Exercise, 
  Reminder, 
  MoodLog, 
  WeeklyRoutine, 
  TrainingBlock, 
  WeakPoint, 
  SteroidCycle, 
  SupplementLog, 
  WorkoutTemplate, 
  WorkoutPlan 
} from '@/types';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'Bench Press', category: 'upper', sets: [{ reps: 10, weight: 0 }], reps: 10, weight: 0 },
    { id: '2', name: 'Squat', category: 'lower', sets: [{ reps: 8, weight: 0 }], reps: 8, weight: 0 },
    { id: '3', name: 'Deadlift', category: 'lower', sets: [{ reps: 6, weight: 0 }], reps: 6, weight: 0 },
    { id: '4', name: 'Pull-Up', category: 'upper', sets: [{ reps: 8, weight: 0 }], reps: 8, weight: 0 },
    { id: '5', name: 'Plank', category: 'core', sets: [{ reps: 30, weight: 0 }], reps: 30, weight: 0 },
  ]);
  const [steroidCycles, setSteroidCycles] = useState<SteroidCycle[]>([]);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>([]);
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);

  const addWorkout = (name: string, exercises: Exercise[] = [], additionalData: Partial<Workout> = {}) => {
    const id = additionalData.id || uuidv4();
    const newWorkout: Workout = { id, name, date: new Date(), exercises, completed: false, ...additionalData };
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

  const toggleDeloadMode = (id: string, isDeload: boolean) => {
    setWorkouts(workouts.map((w) => (w.id === id ? { ...w, deloadMode: isDeload } : w)));
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

  const addSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles([...steroidCycles, cycle]);
  };

  const exportData = () => {
    const data = {
      workouts,
      measurements,
      bodyMeasurements,
      supplements,
      cycles,
      exercises,
      steroidCycles,
      supplementLogs,
      weeklyRoutines,
      trainingBlocks,
      weakPoints,
      moodLogs,
      reminders,
      workoutTemplates,
      workoutPlans,
    };
    return JSON.stringify(data);
  };

  const unitSystem = 'metric';
  const convertWeight = (weight: number) => weight;
  const getWeightUnitDisplay = () => 'kg';

  const getDueReminders = () => {
    return reminders.filter((reminder) => !reminder.dismissed);
  };

  const markReminderAsSeen = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, dismissed: true } : r)));
  };

  const dismissReminder = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, dismissed: true } : r)));
  };

  const addSupplementLog = (log: SupplementLog) => {
    setSupplementLogs([...supplementLogs, log]);
  };

  const updateSupplementLog = (updated: SupplementLog) => {
    setSupplementLogs(supplementLogs.map((log) => (log.id === updated.id ? updated : log)));
  };

  const addReminder = (reminder: Reminder) => {
    setReminders([...reminders, reminder]);
  };

  const addTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks([...trainingBlocks, block]);
  };

  const updateTrainingBlock = (updated: TrainingBlock) => {
    setTrainingBlocks(trainingBlocks.map((b) => (b.id === updated.id ? updated : b)));
  };

  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines([...weeklyRoutines, routine]);
  };

  const updateWeeklyRoutine = (updated: WeeklyRoutine) => {
    setWeeklyRoutines(weeklyRoutines.map((r) => (r.id === updated.id ? updated : r)));
  };

  const addWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints([...weakPoints, weakPoint]);
  };

  const deleteWeakPoint = (id: string) => {
    setWeakPoints(weakPoints.filter((wp) => wp.id !== id));
  };

  const addMoodLog = (moodLog: MoodLog) => {
    setMoodLogs([...moodLogs, moodLog]);
  };

  const updateMoodLog = (updated: MoodLog) => {
    setMoodLogs(moodLogs.map((ml) => (ml.id === updated.id ? updated : ml)));
  };

  const addWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates([...workoutTemplates, template]);
  };

  const updateWorkoutTemplate = (updated: WorkoutTemplate) => {
    setWorkoutTemplates(workoutTemplates.map((t) => (t.id === updated.id ? updated : t)));
  };

  const addWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans([...workoutPlans, plan]);
  };

  const updateWorkoutPlan = (updated: WorkoutPlan) => {
    setWorkoutPlans(workoutPlans.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans(workoutPlans.filter((p) => p.id !== id));
  };

  const duplicateWorkoutPlan = (id: string) => {
    const plan = workoutPlans.find((p) => p.id === id);
    if (plan) {
      const newPlan = { ...plan, id: uuidv4(), name: `${plan.name} (Copy)` };
      setWorkoutPlans([...workoutPlans, newPlan]);
    }
  };

  const setActivePlan = (id: string) => {
    setWorkoutPlans(workoutPlans.map((p) => ({
      ...p,
      isActive: p.id === id,
    })));
  };

  const removeTemplateFromPlan = (planId: string, templateId: string) => {
    setWorkoutPlans(workoutPlans.map((p) => {
      if (p.id !== planId) return p;
      return {
        ...p,
        routines: p.routines.map((r) => ({
          ...r,
          days: Object.fromEntries(
            Object.entries(r.days).map(([day, templates]) => [
              day,
              templates.filter((t: WorkoutTemplate) => t.id !== templateId),
            ])
          ),
        })),
      };
    }));
  };

  const value = useMemo(
    () => ({
      workouts,
      setWorkouts,
      measurements,
      setMeasurements,
      bodyMeasurements,
      setBodyMeasurements,
      supplements,
      setSupplements,
      cycles,
      setCycles,
      exercises,
      setExercises,
      steroidCycles,
      setSteroidCycles,
      supplementLogs,
      setSupplementLogs,
      weeklyRoutines,
      setWeeklyRoutines,
      trainingBlocks,
      setTrainingBlocks,
      weakPoints,
      setWeakPoints,
      moodLogs,
      setMoodLogs,
      reminders,
      setReminders,
      workoutTemplates,
      setWorkoutTemplates,
      workoutPlans,
      setWorkoutPlans,
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
      addSteroidCycle,
      exportData,
      unitSystem,
      convertWeight,
      getWeightUnitDisplay,
      getDueReminders,
      markReminderAsSeen,
      dismissReminder,
      addSupplementLog,
      updateSupplementLog,
      addReminder,
      addTrainingBlock,
      updateTrainingBlock,
      addWeeklyRoutine,
      updateWeeklyRoutine,
      addWeakPoint,
      deleteWeakPoint,
      addMoodLog,
      updateMoodLog,
      addWorkoutTemplate,
      updateWorkoutTemplate,
      addWorkoutPlan,
      updateWorkoutPlan,
      deleteWorkoutPlan,
      duplicateWorkoutPlan,
      setActivePlan,
      removeTemplateFromPlan,
    }),
    [workouts, measurements, bodyMeasurements, supplements, cycles, exercises, steroidCycles, supplementLogs, weeklyRoutines, trainingBlocks, weakPoints, moodLogs, reminders, workoutTemplates, workoutPlans]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
