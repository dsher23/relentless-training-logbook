import React, { createContext, useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContextType, Workout, Measurement, Supplement, Cycle, Exercise, Reminder, MoodLog, WeeklyRoutine, TrainingBlock, WeakPoint, SteroidCycle, SupplementLog, WorkoutTemplate, WorkoutPlan, BodyMeasurement, UnitSystem, SteroidCompound, CycleCompound, ProgressPhoto, PR } from '@/types';

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

  const convertWeight = (weight: number) => weight;
  const convertMeasurement = (value: number) => value;
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
              (templates as WorkoutTemplate[]).filter((t) => t.id !== templateId),
            ])
          ),
        })),
      };
    }));
  };

  const addSteroidCompound = (compound: SteroidCompound) => {
    setSteroidCompounds([...steroidCompounds, compound]);
  };

  const updateSteroidCompound = (updated: SteroidCompound) => {
    setSteroidCompounds(steroidCompounds.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteSteroidCompound = (id: string) => {
    setSteroidCompounds(steroidCompounds.filter((c) => c.id !== id));
  };

  const addCycleCompound = (compound: CycleCompound) => {
    setCycleCompounds([...cycleCompounds, compound]);
  };

  const updateCycleCompound = (updated: CycleCompound) => {
    setCycleCompounds(cycleCompounds.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCycleCompound = (id: string) => {
    setCycleCompounds(cycleCompounds.filter((c) => c.id !== id));
  };

  const addProgressPhoto = (photo: ProgressPhoto) => {
    setProgressPhotos([...progressPhotos, photo]);
  };

  const updateProgressPhoto = (updated: ProgressPhoto) => {
    setProgressPhotos(progressPhotos.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProgressPhoto = (id: string) => {
    setProgressPhotos(progressPhotos.filter((p) => p.id !== id));
  };

  const getWorkoutByDate = (date: Date) => {
    return workouts.find((w) => new Date(w.date).toDateString() === date.toDateString());
  };

  const getWorkoutsByRange = (startDate: Date, endDate: Date) => {
    return workouts.filter((w) => {
      const workoutDate = new Date(w.date);
      return workoutDate >= startDate && workoutDate <= endDate;
    });
  };

  const getMeasurementsByRange = (startDate: Date, endDate: Date) => {
    return measurements.filter((m) => {
      const measurementDate = new Date(m.date);
      return measurementDate >= startDate && measurementDate <= endDate;
    });
  };

  const getBodyMeasurementsByRange = (startDate: Date, endDate: Date) => {
    return bodyMeasurements.filter((m) => {
      const measurementDate = new Date(m.date);
      return measurementDate >= startDate && measurementDate <= endDate;
    });
  };

  const getSupplementsByDate = (date: Date) => {
    return supplements.filter((s) =>
      s.history.some((h) => new Date(h.date).toDateString() === date.toDateString())
    );
  };

  const getCyclesByRange = (startDate: Date, endDate: Date) => {
    return cycles.filter((c) => {
      const cycleStart = new Date(c.startDate);
      const cycleEnd = new Date(c.endDate);
      return cycleStart <= endDate && cycleEnd >= startDate;
    });
  };

  const getSteroidCyclesByRange = (startDate: Date, endDate: Date) => {
    return steroidCycles.filter((c) => {
      const cycleStart = new Date(c.startDate);
      const cycleEnd = new Date(c.endDate);
      return cycleStart <= endDate && cycleEnd >= startDate;
    });
  };

  const getSupplementLogsByRange = (startDate: Date, endDate: Date) => {
    return supplementLogs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startDate && logDate <= endDate;
    });
  };

  const getWeeklyRoutinesByRange = (startDate: Date, endDate: Date) => {
    return weeklyRoutines.filter((r) => {
      const routineStart = new Date(r.days[Object.keys(r.days)[0]]?.[0]?.scheduledTime || r.workoutDays?.[0]?.dayOfWeek || 0);
      return routineStart >= startDate && routineStart <= endDate;
    });
  };

  const getTrainingBlocksByRange = (startDate: Date, endDate: Date) => {
    return trainingBlocks.filter((b) => {
      const blockStart = new Date(b.startDate);
      const blockEnd = new Date(b.endDate);
      return blockStart <= endDate && blockEnd >= startDate;
    });
  };

  const getWeakPointsByPriority = (priority: number) => {
    return weakPoints.filter((wp) => wp.priority === priority);
  };

  const getMoodLogsByRange = (startDate: Date, endDate: Date) => {
    return moodLogs.filter((m) => {
      const moodDate = new Date(m.date);
      return moodDate >= startDate && moodDate <= endDate;
    });
  };

  const getRemindersByDate = (date: Date) => {
    return reminders.filter((r) => {
      const reminderDate = r.dueDate ? new Date(r.dueDate) : new Date(r.dateTime || 0);
      return reminderDate.toDateString() === date.toDateString();
    });
  };

  const getWorkoutTemplatesByCategory = (category: string) => {
    return workoutTemplates.filter((t) => t.exercises.some((e) => e.category === category));
  };

  const getWorkoutPlansByStatus = (isActive: boolean) => {
    return workoutPlans.filter((p) => p.isActive === isActive);
  };

  const getCycleCompoundsByCycleId = (cycleId: string) => {
    return cycleCompounds.filter((c) => c.steroidCompoundId === cycleId);
  };

  const getProgressPhotosByRange = (startDate: Date, endDate: Date) => {
    return progressPhotos.filter((p) => {
      const photoDate = new Date(p.date);
      return photoDate >= startDate && photoDate <= endDate;
    });
  };

  const getExerciseById = (id: string) => {
    return exercises.find((e) => e.id === id);
  };

  const getSupplementById = (id: string) => {
    return supplements.find((s) => s.id === id);
  };

  const getCycleById = (id: string) => {
    return cycles.find((c) => c.id === id);
  };

  const getSteroidCycleById = (id: string) => {
    return steroidCycles.find((c) => c.id === id);
  };

  const getSteroidCompoundById = (id: string) => {
    return steroidCompounds.find((c) => c.id === id);
  };

  const getSupplementLogById = (id: string) => {
    return supplementLogs.find((log) => log.id === id);
  };

  const getWeeklyRoutineById = (id: string) => {
    return weeklyRoutines.find((r) => r.id === id);
  };

  const getTrainingBlockById = (id: string) => {
    return trainingBlocks.find((b) => b.id === id);
  };

  const getWeakPointById = (id: string) => {
    return weakPoints.find((wp) => wp.id === id);
  };

  const getMoodLogById = (id: string) => {
    return moodLogs.find((m) => m.id === id);
  };

  const getReminderById = (id: string) => {
    return reminders.find((r) => r.id === id);
  };

  const getWorkoutTemplateById = (id: string) => {
    return workoutTemplates.find((t) => t.id === id);
  };

  const getWorkoutPlanById = (id: string) => {
    return workoutPlans.find((p) => p.id === id);
  };

  const getCycleCompoundById = (id: string) => {
    return cycleCompounds.find((c) => c.id === id);
  };

  const getProgressPhotoById = (id: string) => {
    return progressPhotos.find((p) => p.id === id);
  };

  const getActiveWorkoutPlan = () => {
    return workoutPlans.find((p) => p.isActive);
  };

  const getActiveWeeklyRoutine = () => {
    return weeklyRoutines.find((r) => !r.archived);
  };

  const getActiveTrainingBlock = () => {
    const now = new Date();
    return trainingBlocks.find((b) => {
      const startDate = new Date(b.startDate);
      const endDate = new Date(b.endDate);
      return now >= startDate && now <= endDate;
    });
  };

  const getRecentWorkouts = (limit: number) => {
    return [...workouts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getRecentMeasurements = (limit: number) => {
    return [...measurements]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getRecentBodyMeasurements = (limit: number) => {
    return [...bodyMeasurements]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getRecentSupplements = (limit: number) => {
    return [...supplements]
      .sort((a, b) => {
        const aDate = a.history[a.history.length - 1]?.date || new Date(0);
        const bDate = b.history[b.history.length - 1]?.date || new Date(0);
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, limit);
  };

  const getRecentCycles = (limit: number) => {
    return [...cycles]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, limit);
  };

  const getRecentSteroidCycles = (limit: number) => {
    return [...steroidCycles]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, limit);
  };

  const getRecentSupplementLogs = (limit: number) => {
    return [...supplementLogs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getRecentWeeklyRoutines = (limit: number) => {
    return [...weeklyRoutines]
      .sort((a, b) => {
        const aDate = a.days[Object.keys(a.days)[0]]?.[0]?.scheduledTime || 0;
        const bDate = b.days[Object.keys(b.days)[0]]?.[0]?.scheduledTime || 0;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, limit);
  };

  const getRecentTrainingBlocks = (limit: number) => {
    return [...trainingBlocks]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, limit);
  };

  const getRecentWeakPoints = (limit: number) => {
    return [...weakPoints]
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, limit);
  };

  const getRecentMoodLogs = (limit: number) => {
    return [...moodLogs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getRecentReminders = (limit: number) => {
    return [...reminders]
      .sort((a, b) => {
        const aDate = a.dueDate ? new Date(a.dueDate) : new Date(a.dateTime || 0);
        const bDate = b.dueDate ? new Date(b.dueDate) : new Date(b.dateTime || 0);
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, limit);
  };

  const getRecentWorkoutTemplates = (limit: number) => {
    return [...workoutTemplates]
      .sort((a, b) => {
        const aDate = new Date(a.scheduledTime || 0);
        const bDate = new Date(b.scheduledTime || 0);
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, limit);
  };

  const getRecentWorkoutPlans = (limit: number) => {
    return [...workoutPlans]
      .sort((a, b) => {
        const aDate = a.routines[0]?.days[Object.keys(a.routines[0]?.days || {})[0]]?.[0]?.scheduledTime || 0;
        const bDate = b.routines[0]?.days[Object.keys(b.routines[0]?.days || {})[0]]?.[0]?.scheduledTime || 0;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .slice(0, limit);
  };

  const getRecentCycleCompounds = (limit: number) => {
    return [...cycleCompounds].slice(0, limit);
  };

  const getRecentProgressPhotos = (limit: number) => {
    return [...progressPhotos]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const addPRLift = (prData: Omit<PR, 'id'>) => {
    console.log("Adding PR lift:", prData);
  };

  const updatePR = (prData: PR) => {
    console.log("Updating PR:", prData);
  };

  const deletePR = (id: string) => {
    console.log("Deleting PR:", id);
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
      steroidCompounds,
      setSteroidCompounds,
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
      cycleCompounds,
      setCycleCompounds,
      progressPhotos,
      setProgressPhotos,
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
      addSteroidCompound,
      updateSteroidCompound,
      deleteSteroidCompound,
      addCycleCompound,
      updateCycleCompound,
      deleteCycleCompound,
      addProgressPhoto,
      updateProgressPhoto,
      deleteProgressPhoto,
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
      getWorkoutByDate,
      getWorkoutsByRange,
      getMeasurementsByRange,
      getBodyMeasurementsByRange,
      getSupplementsByDate,
      getCyclesByRange,
      getSteroidCyclesByRange,
      getSupplementLogsByRange,
      getWeeklyRoutinesByRange,
      getTrainingBlocksByRange,
      getWeakPointsByPriority,
      getMoodLogsByRange,
      getRemindersByDate,
      getWorkoutTemplatesByCategory,
      getWorkoutPlansByStatus,
      getCycleCompoundsByCycleId,
      getProgressPhotosByRange,
      getExerciseById,
      getSupplementById,
      getCycleById,
      getSteroidCycleById,
      getSteroidCompoundById,
      getSupplementLogById,
      getWeeklyRoutineById,
      getTrainingBlockById,
      getWeakPointById,
      getMoodLogById,
      getReminderById,
      getWorkoutTemplateById,
      getWorkoutPlanById,
      getCycleCompoundById,
      getProgressPhotoById,
      getActiveWorkoutPlan,
      getActiveWeeklyRoutine,
      getActiveTrainingBlock,
      getRecentWorkouts,
      getRecentMeasurements,
      getRecentBodyMeasurements,
      getRecentSupplements,
      getRecentCycles,
      getRecentSteroidCycles,
      getRecentSupplementLogs,
      getRecentWeeklyRoutines,
      getRecentTrainingBlocks,
      getRecentWeakPoints,
      getRecentMoodLogs,
      getRecentReminders,
      getRecentWorkoutTemplates,
      getRecentWorkoutPlans,
      getRecentCycleCompounds,
      getRecentProgressPhotos,
      addPRLift,
      updatePR,
      deletePR
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
      unitSystem
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
