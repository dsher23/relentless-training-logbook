import React, { createContext, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Workout, Measurement, Supplement, Cycle, Exercise, Reminder, 
  MoodLog, WeeklyRoutine, TrainingBlock, WeakPoint, SteroidCycle, 
  SupplementLog, WorkoutTemplate, WorkoutPlan, BodyMeasurement, 
  SteroidCompound, CycleCompound, ProgressPhoto, UnitSystem
} from '@/types';

export interface AppContextType {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  measurements: Measurement[];
  setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
  bodyMeasurements: BodyMeasurement[];
  setBodyMeasurements: React.Dispatch<React.SetStateAction<BodyMeasurement[]>>;
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  cycles: Cycle[];
  setCycles: React.Dispatch<React.SetStateAction<Cycle[]>>;
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  steroidCycles: SteroidCycle[];
  setSteroidCycles: React.Dispatch<React.SetStateAction<SteroidCycle[]>>;
  supplementLogs: SupplementLog[];
  setSupplementLogs: React.Dispatch<React.SetStateAction<SupplementLog[]>>;
  weeklyRoutines: WeeklyRoutine[];
  setWeeklyRoutines: React.Dispatch<React.SetStateAction<WeeklyRoutine[]>>;
  trainingBlocks: TrainingBlock[];
  setTrainingBlocks: React.Dispatch<React.SetStateAction<TrainingBlock[]>>;
  weakPoints: WeakPoint[];
  setWeakPoints: React.Dispatch<React.SetStateAction<WeakPoint[]>>;
  moodLogs: MoodLog[];
  setMoodLogs: React.Dispatch<React.SetStateAction<MoodLog[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  workoutTemplates: WorkoutTemplate[];
  setWorkoutTemplates: React.Dispatch<React.SetStateAction<WorkoutTemplate[]>>;
  workoutPlans: WorkoutPlan[];
  setWorkoutPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
  steroidCompounds: SteroidCompound[];
  setSteroidCompounds: React.Dispatch<React.SetStateAction<SteroidCompound[]>>;
  cycleCompounds: CycleCompound[];
  setCycleCompounds: React.Dispatch<React.SetStateAction<CycleCompound[]>>;
  progressPhotos: ProgressPhoto[];
  setProgressPhotos: React.Dispatch<React.SetStateAction<ProgressPhoto[]>>;
  unitSystem: UnitSystem;
  updateUnitSystem: (updates: Partial<UnitSystem>) => void;
  addWorkout: (name: string, exercises?: Exercise[], additionalData?: Partial<Workout>) => string;
  updateWorkout: (updated: Workout) => void;
  markWorkoutCompleted: (id: string) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  duplicateWorkout: (id: string) => void;
  toggleDeloadMode: (id: string, isDeload: boolean) => void;
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (updated: Supplement) => void;
  deleteSupplement: (id: string) => void;
  addCycle: (cycle: Cycle) => void;
  updateCycle: (updated: Cycle) => void;
  deleteCycle: (id: string) => void;
  markSupplementTaken: (supplementId: string, date: Date, taken: boolean) => void;
  markCycleTaken: (cycleId: string, date: Date, taken: boolean) => void;
  addExercise: (exercise: Exercise) => void;
  addSteroidCycle: (cycle: SteroidCycle) => void;
  exportData: (type?: "workouts" | "measurements" | "supplements") => string;
  convertWeight: (weight: number, from?: string, to?: string) => number;
  convertMeasurement: (measurement: number, from?: string, to?: string) => number;
  getWeightUnitDisplay: () => string;
  getMeasurementUnitDisplay: () => string;
  getDueReminders: () => Reminder[];
  markReminderAsSeen: (id: string) => void;
  dismissReminder: (id: string) => void;
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (updated: SupplementLog) => void;
  addReminder: (reminder: Reminder) => void;
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (updated: TrainingBlock) => void;
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (updated: WeeklyRoutine) => void;
  addWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  addMoodLog: (moodLog: MoodLog) => void;
  updateMoodLog: (updated: MoodLog) => void;
  addWorkoutTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutTemplate: (updated: WorkoutTemplate) => void;
  addWorkoutPlan: (plan: WorkoutPlan) => void;
  updateWorkoutPlan: (updated: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  duplicateWorkoutPlan: (id: string) => void;
  setActivePlan: (id: string) => void;
  removeTemplateFromPlan: (planId: string, templateId: string) => void;
  compounds?: SteroidCompound[];
  addCompound?: (compound: SteroidCompound) => void;
  updateCompound?: (compound: SteroidCompound) => void;
  deleteCompound?: (id: string) => void;
  duplicateWorkoutTemplate?: (id: string) => void;
  addTemplateToPlan?: (planId: string, templateId: string) => void;
  deleteWeeklyRoutine?: (id: string) => void;
  duplicateWeeklyRoutine?: (id: string) => void;
  archiveWeeklyRoutine?: (id: string, archived: boolean) => void;
  deleteWorkoutTemplate?: (id: string) => void;
}

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
  const [steroidCompounds, setSteroidCompounds] = useState<SteroidCompound[]>([]);
  const [cycleCompounds, setCycleCompounds] = useState<CycleCompound[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  
  const [unitSystem, setUnitSystem] = useState<UnitSystem>({
    bodyWeightUnit: 'kg',
    bodyMeasurementUnit: 'cm',
    liftingWeightUnit: 'kg'
  });

  const updateUnitSystem = (updates: Partial<UnitSystem>) => {
    setUnitSystem(prev => ({
      ...prev,
      ...updates
    }));
  };

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

  const convertWeight = (weight: number, from?: string, to?: string): number => {
    const sourceUnit = from || unitSystem.liftingWeightUnit;
    const targetUnit = to || unitSystem.liftingWeightUnit;
    
    if (sourceUnit === targetUnit) return weight;
    
    if (sourceUnit === 'kg' && targetUnit === 'lbs') {
      return weight * 2.20462;
    } else if (sourceUnit === 'lbs' && targetUnit === 'kg') {
      return weight / 2.20462;
    }
    
    return weight;
  };

  const convertMeasurement = (value: number, from?: string, to?: string): number => {
    const sourceUnit = from || unitSystem.bodyMeasurementUnit;
    const targetUnit = to || unitSystem.bodyMeasurementUnit;
    
    if (sourceUnit === targetUnit) return value;
    
    if (sourceUnit === 'cm' && targetUnit === 'in') {
      return value * 0.393701;
    } else if (sourceUnit === 'in' && targetUnit === 'cm') {
      return value / 0.393701;
    }
    
    return value;
  };

  const getWeightUnitDisplay = (): string => {
    return unitSystem.liftingWeightUnit;
  };

  const getMeasurementUnitDisplay = (): string => {
    return unitSystem.bodyMeasurementUnit;
  };

  const exportData = (type: "workouts" | "measurements" | "supplements" = "workouts"): string => {
    let data = [];
    switch (type) {
      case "workouts":
        data = workouts;
        break;
      case "measurements":
        data = measurements;
        break;
      case "supplements":
        data = supplements;
        break;
    }
    return JSON.stringify(data);
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(workoutTemplates.filter(t => t.id !== id));
  };

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

  const addCompound = (compound: SteroidCompound) => {
    setSteroidCompounds([...steroidCompounds, compound]);
  };

  const updateCompound = (updated: SteroidCompound) => {
    setSteroidCompounds(steroidCompounds.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCompound = (id: string) => {
    setSteroidCompounds(steroidCompounds.filter((c) => c.id !== id));
  };

  const duplicateWorkoutTemplate = (id: string) => {
    const template = workoutTemplates.find((t) => t.id === id);
    if (template) {
      const newTemplate = { ...template, id: uuidv4(), name: `${template.name} (Copy)` };
      setWorkoutTemplates([...workoutTemplates, newTemplate]);
      return newTemplate.id;
    }
    return null;
  };

  const addTemplateToPlan = (planId: string, templateId: string) => {
    setWorkoutPlans(workoutPlans.map((p) => {
      if (p.id !== planId) return p;
      const template = workoutTemplates.find(t => t.id === templateId);
      if (!template) return p;
      
      return {
        ...p,
        workoutTemplates: [...(p.workoutTemplates || []), template]
      };
    }));
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(weeklyRoutines.filter((r) => r.id !== id));
  };

  const duplicateWeeklyRoutine = (id: string) => {
    const routine = weeklyRoutines.find((r) => r.id === id);
    if (routine) {
      const newRoutine = { ...routine, id: uuidv4(), name: `${routine.name} (Copy)` };
      setWeeklyRoutines([...weeklyRoutines, newRoutine]);
    }
  };

  const archiveWeeklyRoutine = (id: string, archived: boolean) => {
    setWeeklyRoutines(weeklyRoutines.map((r) => (r.id === id ? { ...r, archived } : r)));
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(workoutTemplates.filter(t => t.id !== id));
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
      steroidCompounds,
      setSteroidCompounds,
      cycleCompounds,
      setCycleCompounds,
      progressPhotos,
      setProgressPhotos,
      unitSystem,
      updateUnitSystem,
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
      convertWeight,
      convertMeasurement,
      getWeightUnitDisplay,
      getMeasurementUnitDisplay,
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
      compounds: steroidCompounds,
      addCompound,
      updateCompound,
      deleteCompound,
      duplicateWorkoutTemplate,
      addTemplateToPlan,
      deleteWeeklyRoutine,
      duplicateWeeklyRoutine,
      archiveWeeklyRoutine,
      deleteWorkoutTemplate,
    }),
    [workouts, measurements, bodyMeasurements, supplements, cycles, exercises, steroidCycles, supplementLogs, weeklyRoutines, trainingBlocks, weakPoints, moodLogs, reminders, workoutTemplates, workoutPlans, steroidCompounds, cycleCompounds, progressPhotos, unitSystem]
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
