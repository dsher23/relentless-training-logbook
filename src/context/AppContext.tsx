import React, { createContext, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContextType, Workout, Measurement, Supplement, Cycle, Exercise, Reminder, MoodLog, WeeklyRoutine, TrainingBlock, WeakPoint, SteroidCycle, SupplementLog, WorkoutTemplate, WorkoutPlan, BodyMeasurement, UnitSystem, SteroidCompound, CycleCompound, ProgressPhoto, WeightUnit, MeasurementUnit, PR } from '@/types';

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
  const [steroidCompounds, setSteroidCompounds] = useState<SteroidCompound[]>([]);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>([]);
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [cycleCompounds, setCycleCompounds] = useState<CycleCompound[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>({
    bodyWeightUnit: 'kg',
    bodyMeasurementUnit: 'cm',
    liftingWeightUnit: 'kg',
  });
  const [prLifts, setPRLifts] = useState<PR[]>([]);

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

  const exportData = (type?: string) => {
    const data = {
      workouts,
      measurements,
      bodyMeasurements,
      supplements,
      cycles,
      exercises,
      steroidCycles,
      steroidCompounds,
      supplementLogs,
      weeklyRoutines,
      trainingBlocks,
      weakPoints,
      moodLogs,
      reminders,
      workoutTemplates,
      workoutPlans,
      cycleCompounds,
      progressPhotos,
    };
    if (type) {
      return JSON.stringify(data[type] || []);
    }
    return JSON.stringify(data);
  };

  const convertWeight = (weight: number, fromUnit?: WeightUnit, toUnit?: WeightUnit) => {
    if (!fromUnit || !toUnit || fromUnit === toUnit) {
      return weight; // No conversion needed if units match or are not specified
    }

    if (fromUnit === 'kg') {
      if (toUnit === 'lbs') {
        return weight * 2.20462; // kg to lbs
      }
      if (toUnit === 'stone') {
        return weight * 0.157473; // kg to stone
      }
    } else if (fromUnit === 'lbs') {
      if (toUnit === 'kg') {
        return weight / 2.20462; // lbs to kg
      }
      if (toUnit === 'stone') {
        return weight / 14; // lbs to stone
      }
    } else if (fromUnit === 'stone') {
      if (toUnit === 'kg') {
        return weight / 0.157473; // stone to kg
      }
      if (toUnit === 'lbs') {
        return weight * 14; // stone to lbs
      }
    }
    return weight; // Fallback
  };

  const convertMeasurement = (value: number, fromUnit?: MeasurementUnit, toUnit?: MeasurementUnit) => {
    if (!fromUnit || !toUnit || fromUnit === toUnit) {
      return value; // No conversion needed if units match or are not specified
    }

    if (fromUnit === 'cm' && toUnit === 'in') {
      return value / 2.54; // cm to inches
    } else if (fromUnit === 'in' && toUnit === 'cm') {
      return value * 2.54; // inches to cm
    }
    
    return value; // Fallback
  };

  const getWeightUnitDisplay = () => unitSystem.liftingWeightUnit;
  const getMeasurementUnitDisplay = () => unitSystem.bodyMeasurementUnit;
  const updateUnitSystem = (update: Partial<UnitSystem>) => {
    setUnitSystem((prev) => ({ ...prev, ...update }));
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

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(workoutTemplates.filter(t => t.id !== id));
  };

  const duplicateWorkoutTemplate = (id: string) => {
    const template = workoutTemplates.find(t => t.id === id);
    if (template) {
      const newTemplate = { ...template, id: uuidv4(), name: `${template.name} (Copy)` };
      setWorkoutTemplates([...workoutTemplates, newTemplate]);
      return newTemplate.id;
    }
    return null;
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

  const addTemplateToPlan = (planId: string, templateId: string, day: string) => {
    setWorkoutPlans(workoutPlans.map((plan) => {
      if (plan.id !== planId) return plan;
      
      const template = workoutTemplates.find(t => t.id === templateId);
      if (!template) return plan;
      
      const updatedRoutines = [...plan.routines];
      
      if (updatedRoutines.length > 0) {
        const routine = {...updatedRoutines[0]};
        
        if (!routine.days[day]) {
          routine.days[day] = [];
        }
        
        routine.days[day] = [...routine.days[day], template];
        
        updatedRoutines[0] = routine;
      }
      
      return {
        ...plan,
        routines: updatedRoutines,
      };
    }));
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
              (templates as WorkoutTemplate[]).filter((t) => t.id !== templateId),
            ])
          ),
        })),
      };
    }));
  };

  const addPRLift = (prData: Omit<PR, 'id'>) => {
    const newPR: PR = {
      ...prData,
      id: uuidv4(),
    };
    setPRLifts([...prLifts, newPR]);
  };

  const updatePR = (prData: PR) => {
    setPRLifts(prLifts.map(pr => pr.id === prData.id ? prData : pr));
  };

  const deletePR = (id: string) => {
    setPRLifts(prLifts.filter(pr => pr.id !== id));
  };

  const addCompound = (compound: SteroidCompound) => {
    setSteroidCompounds([...steroidCompounds, { ...compound, id: compound.id || uuidv4() }]);
  };

  const updateCompound = (compound: SteroidCompound) => {
    setSteroidCompounds(steroidCompounds.map(c => c.id === compound.id ? compound : c));
  };

  const deleteCompound = (id: string) => {
    setSteroidCompounds(steroidCompounds.filter(c => c.id !== id));
  };

  const value = useMemo(
    () => ({
      workouts,
      setWorkouts,
      measurements,
      bodyMeasurements,
      supplements,
      cycles,
      exercises,
      steroidCycles,
      steroidCompounds,
      supplementLogs,
      weeklyRoutines,
      trainingBlocks,
      weakPoints,
      moodLogs,
      reminders,
      workoutTemplates,
      workoutPlans,
      cycleCompounds,
      progressPhotos,
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
      addCompound,
      updateCompound,
      deleteCompound,
      supplementLogs,
      addSupplementLog,
      updateSupplementLog,
      exportData,
      unitSystem,
      convertWeight,
      convertMeasurement,
      getWeightUnitDisplay,
      getMeasurementUnitDisplay,
      updateUnitSystem,
      getDueReminders,
      markReminderAsSeen,
      dismissReminder,
      addReminder,
      addTrainingBlock,
      updateTrainingBlock,
      addWeeklyRoutine,
      updateWeeklyRoutine,
      deleteWeeklyRoutine,
      duplicateWeeklyRoutine,
      archiveWeeklyRoutine,
      addWeakPoint,
      deleteWeakPoint,
      addMoodLog,
      updateMoodLog,
      addWorkoutTemplate,
      updateWorkoutTemplate,
      deleteWorkoutTemplate,
      duplicateWorkoutTemplate,
      addWorkoutPlan,
      updateWorkoutPlan,
      deleteWorkoutPlan,
      duplicateWorkoutPlan,
      setActivePlan,
      addTemplateToPlan,
      removeTemplateFromPlan,
      addPRLift,
      updatePR,
      deletePR,
      prLifts
    }),
    [
      workouts,
      measurements,
      bodyMeasurements,
      supplements,
      cycles,
      exercises,
      steroidCycles,
      steroidCompounds,
      supplementLogs,
      weeklyRoutines,
      trainingBlocks,
      weakPoints,
      moodLogs,
      reminders,
      workoutTemplates,
      workoutPlans,
      cycleCompounds,
      progressPhotos,
      unitSystem,
      prLifts
    ]
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

export type { Supplement, Reminder, MoodLog, WeeklyRoutine, TrainingBlock, WeakPoint, Workout, SteroidCycle, SupplementLog, WorkoutTemplate, WorkoutPlan };
