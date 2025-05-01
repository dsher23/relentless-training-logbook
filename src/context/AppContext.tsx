import React, { createContext, useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContextType, Workout, Measurement, Supplement, Cycle, Exercise, Reminder, MoodLog, WeeklyRoutine, TrainingBlock, WeakPoint, SteroidCycle, SupplementLog, WorkoutTemplate, WorkoutPlan, BodyMeasurement, UnitSystem, SteroidCompound, CycleCompound, ProgressPhoto, WeightUnit, MeasurementUnit, PR } from '@/types';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultTemplate: WorkoutTemplate = {
    id: "6d45c3b7-5708-4961-8090-5951d810dd0a",
    name: "Chest Workout",
    exercises: [
      {
        id: "ac565875-3781-46ee-a4b2-f1cc492af01f",
        name: "Bench Press",
        sets: 3,
        reps: 10,
        weight: 0,
        prExerciseType: "Bench Press",
        restTime: 60,
        category: "upper",
        notes: ""
      },
      {
        id: "bd8b1abb-e229-481a-84a3-4478d0c57fde",
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: 12,
        weight: 0,
        restTime: 60,
        category: "upper",
        notes: ""
      },
      {
        id: "cff401a2-9f01-4627-91ea-8c8db47f2f86",
        name: "Chest Fly",
        sets: 3,
        reps: 15,
        weight: 0,
        restTime: 60,
        category: "upper",
        notes: ""
      }
    ],
    isFavorite: false
  };

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });

  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(() => {
    const savedTemplates = localStorage.getItem('workoutTemplates');
    let templates = savedTemplates ? JSON.parse(savedTemplates) : [];
    if (!templates.some((t: WorkoutTemplate) => t.id === defaultTemplate.id)) {
      templates = [defaultTemplate, ...templates];
      try {
        localStorage.setItem('workoutTemplates', JSON.stringify(templates));
      } catch (error) {
        console.error("Failed to save workoutTemplates to localStorage:", error);
        localStorage.clear(); // Clear localStorage to free space
        localStorage.setItem('workoutTemplates', JSON.stringify(templates));
      }
    }
    return templates;
  });

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
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [cycleCompounds, setCycleCompounds] = useState<CycleCompound[]>([]);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>({
    bodyWeightUnit: 'kg',
    bodyMeasurementUnit: 'cm',
    liftingWeightUnit: 'kg',
  });
  const [prLifts, setPRLifts] = useState<PR[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('workouts', JSON.stringify(workouts));
    } catch (error) {
      console.error("Failed to save workouts to localStorage:", error);
      localStorage.clear(); // Clear localStorage to free space
      localStorage.setItem('workouts', JSON.stringify(workouts));
    }
  }, [workouts]);

  useEffect(() => {
    try {
      localStorage.setItem('workoutTemplates', JSON.stringify(workoutTemplates));
    } catch (error) {
      console.error("Failed to save workoutTemplates to localStorage:", error);
      localStorage.clear(); // Clear localStorage to free space
      localStorage.setItem('workoutTemplates', JSON.stringify(workoutTemplates));
    }
  }, [workoutTemplates]);

  const addWorkout = (name: string, exercises: Exercise[] = [], additionalData: Partial<Workout> = {}) => {
    const newWorkout: Workout = {
      id: additionalData.id || uuidv4(),
      name: name || "New Workout",
      date: new Date(),
      exercises,
      completed: false,
      ...additionalData
    };
    setWorkouts(prevWorkouts => {
      const updatedWorkouts = [...prevWorkouts, newWorkout];
      console.log("Updated workouts:", updatedWorkouts);
      return updatedWorkouts;
    });
    return newWorkout.id;
  };

  const updateWorkout = (updated: Workout) => {
    setWorkouts(prevWorkouts => {
      const updatedWorkouts = prevWorkouts.map(workout => workout.id === updated.id ? updated : workout);
      console.log("Updated workouts:", updatedWorkouts);
      return updatedWorkouts;
    });
  };

  const markWorkoutCompleted = (id: string) => {
    setWorkouts(prevWorkouts =>
      prevWorkouts.map(workout =>
        workout.id === id ? { ...workout, completed: !workout.completed } : workout
      )
    );
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== id));
  };

  const getWorkoutById = (id: string) => {
    return workouts.find(w => w.id === id);
  };

  const duplicateWorkout = (id: string) => {
    const workout = workouts.find(w => w.id === id);
    if (workout) {
      const newWorkout = { ...workout, id: uuidv4(), name: `${workout.name} (Copy)` };
      setWorkouts(prevWorkouts => [...prevWorkouts, newWorkout]);
    }
  };

  const toggleDeloadMode = (id: string, isDeload: boolean) => {
    setWorkouts(prevWorkouts => prevWorkouts.map(w => w.id === id ? { ...w, deloadMode: isDeload } : w));
  };

  const addSupplement = (supplement: Supplement) => {
    setSupplements(prevSupplements => [...prevSupplements, supplement]);
  };

  const updateSupplement = (updated: Supplement) => {
    setSupplements(prevSupplements => prevSupplements.map(s => s.id === updated.id ? updated : s));
  };

  const deleteSupplement = (id: string) => {
    setSupplements(prevSupplements => prevSupplements.filter(s => s.id !== id));
  };

  const addCycle = (cycle: Cycle) => {
    setCycles(prevCycles => [...prevCycles, cycle]);
  };

  const updateCycle = (updated: Cycle) => {
    setCycles(prevCycles => prevCycles.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCycle = (id: string) => {
    setCycles(prevCycles => prevCycles.filter(c => c.id !== id));
  };

  const markSupplementTaken = (supplementId: string, date: Date, taken: boolean) => {
    setSupplements(prevSupplements =>
      prevSupplements.map(s =>
        s.id === supplementId ? { ...s, history: [...s.history, { date, taken }] } : s
      )
    );
  };

  const markCycleTaken = (cycleId: string, date: Date, taken: boolean) => {
    setCycles(prevCycles =>
      prevCycles.map(c =>
        c.id === cycleId ? { ...c, history: [...c.history, { date, taken }] } : c
      )
    );
  };

  const addExercise = (exercise: Exercise) => {
    setExercises(prevExercises => [...prevExercises, exercise]);
  };

  const addSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles(prevCycles => [...prevCycles, cycle]);
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
      return weight;
    }

    if (fromUnit === 'kg') {
      if (toUnit === 'lbs') {
        return weight * 2.20462;
      }
      if (toUnit === 'stone') {
        return weight * 0.157473;
      }
    } else if (fromUnit === 'lbs') {
      if (toUnit === 'kg') {
        return weight / 2.20462;
      }
      if (toUnit === 'stone') {
        return weight / 14;
      }
    } else if (fromUnit === 'stone') {
      if (toUnit === 'kg') {
        return weight / 0.157473;
      }
      if (toUnit === 'lbs') {
        return weight * 14;
      }
    }
    return weight;
  };

  const convertMeasurement = (value: number, fromUnit?: MeasurementUnit, toUnit?: MeasurementUnit) => {
    if (!fromUnit || !toUnit || fromUnit === toUnit) {
      return value;
    }

    if (fromUnit === 'cm' && toUnit === 'in') {
      return value / 2.54;
    } else if (fromUnit === 'in' && toUnit === 'cm') {
      return value * 2.54;
    }
    
    return value;
  };

  const getWeightUnitDisplay = () => unitSystem.liftingWeightUnit;
  const getMeasurementUnitDisplay = () => unitSystem.bodyMeasurementUnit;
  const updateUnitSystem = (update: Partial<UnitSystem>) => {
    setUnitSystem(prev => ({ ...prev, ...update }));
  };

  const getDueReminders = () => {
    return reminders.filter(reminder => !reminder.dismissed);
  };

  const markReminderAsSeen = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, dismissed: true } : r));
  };

  const dismissReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, dismissed: true } : r));
  };

  const addSupplementLog = (log: SupplementLog) => {
    setSupplementLogs(prevLogs => [...prevLogs, log]);
  };

  const updateSupplementLog = (updated: SupplementLog) => {
    setSupplementLogs(prevLogs => prevLogs.map(log => log.id === updated.id ? updated : log));
  };

  const addReminder = (reminder: Reminder) => {
    setReminders(prevReminders => [...prevReminders, reminder]);
  };

  const addTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks(prevBlocks => [...prevBlocks, block]);
  };

  const updateTrainingBlock = (updated: TrainingBlock) => {
    setTrainingBlocks(prevBlocks => prevBlocks.map(b => b.id === updated.id ? updated : b));
  };

  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines(prevRoutines => [...prevRoutines, routine]);
  };

  const updateWeeklyRoutine = (updated: WeeklyRoutine) => {
    setWeeklyRoutines(prevRoutines => prevRoutines.map(r => r.id === updated.id ? updated : r));
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(prevRoutines => prevRoutines.filter(r => r.id !== id));
  };

  const duplicateWeeklyRoutine = (id: string) => {
    const routine = weeklyRoutines.find(r => r.id === id);
    if (routine) {
      const newRoutine = { ...routine, id: uuidv4(), name: `${routine.name} (Copy)` };
      setWeeklyRoutines(prevRoutines => [...prevRoutines, newRoutine]);
    }
  };

  const archiveWeeklyRoutine = (id: string, archived: boolean) => {
    setWeeklyRoutines(prevRoutines => prevRoutines.map(r => r.id === id ? { ...r, archived } : r));
  };

  const addWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints(prevWeakPoints => [...prevWeakPoints, weakPoint]);
  };

  const deleteWeakPoint = (id: string) => {
    setWeakPoints(prevWeakPoints => prevWeakPoints.filter(wp => wp.id !== id));
  };

  const addMoodLog = (moodLog: MoodLog) => {
    setMoodLogs(prevMoodLogs => [...moodLogs, moodLog]);
  };

  const updateMoodLog = (updated: MoodLog) => {
    setMoodLogs(prevMoodLogs => prevMoodLogs.map(ml => ml.id === updated.id ? updated : ml));
  };

  const addWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates(prevTemplates => {
      const updatedTemplates = [...prevTemplates, template];
      console.log("Updated workoutTemplates after adding:", updatedTemplates);
      return updatedTemplates;
    });
  };

  const updateWorkoutTemplate = (updated: WorkoutTemplate) => {
    setWorkoutTemplates(prevTemplates => {
      const updatedTemplates = prevTemplates.map(t => t.id === updated.id ? updated : t);
      console.log("Updated workoutTemplates after updating:", updatedTemplates);
      return updatedTemplates;
    });
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(prevTemplates => prevTemplates.filter(t => t.id !== id));
  };

  const duplicateWorkoutTemplate = (id: string) => {
    const template = workoutTemplates.find(t => t.id === id);
    if (template) {
      const newTemplate = { ...template, id: uuidv4(), name: `${template.name} (Copy)` };
      setWorkoutTemplates(prevTemplates => {
        const updatedTemplates = [...prevTemplates, newTemplate];
        console.log("Updated workoutTemplates after duplicating:", updatedTemplates);
        return updatedTemplates;
      });
      return newTemplate.id;
    }
    return null;
  };

  const addWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans(prevPlans => [...prevPlans, plan]);
  };

  const updateWorkoutPlan = (updated: WorkoutPlan) => {
    setWorkoutPlans(prevPlans => prevPlans.map(p => p.id === updated.id ? updated : p));
  };

  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans(prevPlans => prevPlans.filter(p => p.id !== id));
  };

  const duplicateWorkoutPlan = (id: string) => {
    const plan = workoutPlans.find(p => p.id === id);
    if (plan) {
      const newPlan = { ...plan, id: uuidv4(), name: `${plan.name} (Copy)` };
      setWorkoutPlans(prevPlans => [...prevPlans, newPlan]);
    }
  };

  const setActivePlan = (id: string) => {
    setWorkoutPlans(prevPlans => prevPlans.map(p => ({ ...p, isActive: p.id === id })));
  };

  const addTemplateToPlan = (planId: string, templateId: string, day: string) => {
    setWorkoutPlans(prevPlans => prevPlans.map(plan => {
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
    setWorkoutPlans(prevPlans => prevPlans.map(p => {
      if (p.id !== planId) return p;
      return {
        ...p,
        routines: p.routines.map(r => ({
          ...r,
          days: Object.fromEntries(
            Object.entries(r.days).map(([day, templates]) => [
              day,
              (templates as WorkoutTemplate[]).filter(t => t.id !== templateId),
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
    setPRLifts(prevPRLifts => [...prevPRLifts, newPR]);
  };

  const updatePR = (prData: PR) => {
    setPRLifts(prevPRLifts => prevPRLifts.map(pr => pr.id === prData.id ? prData : pr));
  };

  const deletePR = (id: string) => {
    setPRLifts(prevPRLifts => prevPRLifts.filter(pr => pr.id !== id));
  };

  const addCompound = (compound: SteroidCompound) => {
    setSteroidCompounds(prevCompounds => [...prevCompounds, { ...compound, id: compound.id || uuidv4() }]);
  };

  const updateCompound = (compound: SteroidCompound) => {
    setSteroidCompounds(prevCompounds => prevCompounds.map(c => c.id === compound.id ? compound : c));
  };

  const deleteCompound = (id: string) => {
    setSteroidCompounds(prevCompounds => prevCompounds.filter(c => c.id !== id));
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
