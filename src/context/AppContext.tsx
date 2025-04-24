import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast'; // Ensure shadcn-ui toast component is installed: `npx shadcn-ui@latest add toast`
import { 
  Workout, Exercise, BodyMeasurement, Supplement, 
  SupplementLog, SteroidCycle, Reminder, SteroidCompound,
  MoodLog, WeeklyRoutine, TrainingBlock, WeakPoint, 
  WorkoutTemplate, WorkoutPlan, CycleCompound, ProgressPhoto
} from '@/types';
import { UnitSystem, WeightUnit, MeasurementUnit } from '@/types/pr';

export type { 
  Workout, Exercise, BodyMeasurement, Supplement, 
  SupplementLog, MoodLog, WeakPoint, WorkoutTemplate,
  WeeklyRoutine, TrainingBlock, Reminder, SteroidCycle,
  SteroidCompound, WorkoutPlan, CycleCompound, ProgressPhoto
} from '@/types';

export const convertWeight = (value: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  let inKg = value;
  if (fromUnit === 'lbs') inKg = value / 2.20462;
  if (fromUnit === 'stone') inKg = (value * 14) / 2.20462;

  if (toUnit === 'kg') return Math.round(inKg * 10) / 10;
  if (toUnit === 'lbs') return Math.round(inKg * 2.20462 * 10) / 10;
  if (toUnit === 'stone') return Math.round((inKg * 2.20462) / 14 * 10) / 10;
  return value;
};

export const convertMeasurement = (value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit): number => {
  if (fromUnit === toUnit) return value;
  if (fromUnit === 'in' && toUnit === 'cm') return Math.round(value * 2.54 * 10) / 10;
  if (fromUnit === 'cm' && toUnit === 'in') return Math.round(value / 2.54 * 10) / 10;
  return value;
};

export interface AppContextType {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  addWorkout: (workout: Workout) => void;
  addWorkoutByName?: (workoutName: string) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout;
  duplicateWorkout?: (id: string) => void;
  toggleDeloadMode?: (workoutId: string, isDeload: boolean) => void;
  
  workoutTemplates: WorkoutTemplate[];
  setWorkoutTemplates: React.Dispatch<React.SetStateAction<WorkoutTemplate[]>>;
  addWorkoutTemplate: (workoutTemplate: WorkoutTemplate) => void;
  updateWorkoutTemplate: (workoutTemplate: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  duplicateWorkoutTemplate: (id: string) => void;
  
  workoutPlans: WorkoutPlan[];
  setWorkoutPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
  addWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  updateWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  duplicateWorkoutPlan: (id: string) => void;
  setActivePlan: (id: string) => void;
  addTemplateToPlan: (planId: string, templateId: string) => void;
  removeTemplateFromPlan: (planId: string, templateId: string) => void;
  
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  supplementLogs: SupplementLog[];
  setSupplementLogs: React.Dispatch<React.SetStateAction<SupplementLog[]>>;
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (supplement: Supplement) => void;
  deleteSupplement: (id: string) => void;
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (log: SupplementLog) => void;
  deleteSupplementLog: (id: string) => void;

  steroidCycles: SteroidCycle[];
  setSteroidCycles: React.Dispatch<React.SetStateAction<SteroidCycle[]>>;
  addSteroidCycle: (cycle: SteroidCycle) => void;
  updateSteroidCycle: (cycle: SteroidCycle) => void;
  deleteSteroidCycle: (id: string) => void;
  
  compounds: SteroidCompound[];
  setCompounds: React.Dispatch<React.SetStateAction<SteroidCompound[]>>;
  addCompound: (compound: SteroidCompound) => void;
  updateCompound: (compound: SteroidCompound) => void;
  deleteCompound: (id: string) => void;
  getCompoundsByCycleId: (cycleId: string) => SteroidCompound[];

  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  getDueReminders: () => Reminder[];
  markReminderAsSeen: (id: string) => void;
  dismissReminder: (id: string) => void;

  bodyMeasurements: BodyMeasurement[];
  setBodyMeasurements: React.Dispatch<React.SetStateAction<BodyMeasurement[]>>;
  addBodyMeasurement: (measurement: BodyMeasurement) => void;
  updateBodyMeasurement: (measurement: BodyMeasurement) => void;
  deleteBodyMeasurement: (id: string) => void;
  getBodyMeasurementById: (id: string) => BodyMeasurement;

  moodLogs: MoodLog[];
  setMoodLogs: React.Dispatch<React.SetStateAction<MoodLog[]>>;
  addMoodLog: (log: MoodLog) => void;
  updateMoodLog: (log: MoodLog) => void;
  deleteMoodLog: (id: string) => void;
  getMoodLogById: (id: string) => MoodLog;

  weakPoints: WeakPoint[];
  setWeakPoints: React.Dispatch<React.SetStateAction<WeakPoint[]>>;
  addWeakPoint: (weakPoint: WeakPoint) => void;
  updateWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  getWeakPointById: (id: string) => WeakPoint;

  weeklyRoutines: WeeklyRoutine[];
  setWeeklyRoutines: React.Dispatch<React.SetStateAction<WeeklyRoutine[]>>;
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (routine: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  getWeeklyRoutineById: (id: string) => WeeklyRoutine;
  duplicateWeeklyRoutine: (id: string) => void;
  archiveWeeklyRoutine: (id: string, archived: boolean) => void;

  trainingBlocks: TrainingBlock[];
  setTrainingBlocks: React.Dispatch<React.SetStateAction<TrainingBlock[]>>;
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (block: TrainingBlock) => void;
  deleteTrainingBlock: (id: string) => void;
  getTrainingBlockById: (id: string) => TrainingBlock;
  checkTrainingBlockStatus: () => { needsUpdate: boolean; trainingBlock: TrainingBlock | null };

  progressPhotos: ProgressPhoto[];
  setProgressPhotos: React.Dispatch<React.SetStateAction<ProgressPhoto[]>>;
  addProgressPhoto: (photo: ProgressPhoto) => void;
  updateProgressPhoto: (photo: ProgressPhoto) => void;
  deleteProgressPhoto: (id: string) => void;

  unitSystem: UnitSystem;
  setUnitSystem: React.Dispatch<React.SetStateAction<UnitSystem>>;
  updateUnitSystem: (update: Partial<UnitSystem>) => void;
  convertWeight: (value: number, fromUnit: WeightUnit, toUnit: WeightUnit) => number;
  convertMeasurement: (value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit) => number;
  getWeightUnitDisplay: (unit: WeightUnit) => string;
  getMeasurementUnitDisplay: (unit: MeasurementUnit) => string;
  
  exportData: (type: string) => string;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('workouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(() => {
    const saved = localStorage.getItem('workoutTemplates');
    return saved ? JSON.parse(saved) : [];
  });

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => {
    const saved = localStorage.getItem('workoutPlans');
    return saved ? JSON.parse(saved) : [];
  });

  const [supplements, setSupplements] = useState<Supplement[]>(() => {
    const saved = localStorage.getItem('supplements');
    return saved ? JSON.parse(saved) : [];
  });

  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>(() => {
    const saved = localStorage.getItem('supplementLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [steroidCycles, setSteroidCycles] = useState<SteroidCycle[]>(() => {
    const saved = localStorage.getItem('steroidCycles');
    return saved ? JSON.parse(saved) : [];
  });

  const [compounds, setCompounds] = useState<SteroidCompound[]>(() => {
    const saved = localStorage.getItem('compounds');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem('bodyMeasurements');
    return saved ? JSON.parse(saved) : [];
  });

  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
    const saved = localStorage.getItem('moodLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>(() => {
    const saved = localStorage.getItem('weakPoints');
    return saved ? JSON.parse(saved) : [];
  });

  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>(() => {
    const saved = localStorage.getItem('weeklyRoutines');
    return saved ? JSON.parse(saved) : [];
  });

  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>(() => {
    const saved = localStorage.getItem('trainingBlocks');
    return saved ? JSON.parse(saved) : [];
  });

  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>(() => {
    const saved = localStorage.getItem('progressPhotos');
    return saved ? JSON.parse(saved) : [];
  });

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    const storedSystem = localStorage.getItem('ironlog_unit_system');
    if (storedSystem) {
      try {
        return JSON.parse(storedSystem);
      } catch (error) {
        console.error("Failed to parse unit system from localStorage", error);
      }
    }
    return {
      bodyWeightUnit: 'lbs',
      bodyMeasurementUnit: 'in',
      liftingWeightUnit: 'kg'
    };
  });

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [...prev, workout]);
    toast({
      title: "Workout Added",
      description: "Your workout has been saved.",
    });
  };

  const addWorkoutByName = (workoutName: string) => {
    const newWorkout: Workout = {
      id: uuidv4(),
      name: workoutName,
      date: new Date().toISOString(),
      exercises: [],
      completed: false,
    };
    setWorkouts((prev) => [...prev, newWorkout]);
    toast({
      title: "Workout Added",
      description: `Workout "${workoutName}" has been created.`,
    });
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts((prev) => prev.map((w) => (w.id === workout.id ? workout : w)));
    toast({
      title: "Workout Updated",
      description: "Your workout has been updated.",
    });
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    toast({
      title: "Workout Deleted",
      description: "Your workout has been removed.",
    });
  };

  const getWorkoutById = (id: string): Workout => {
    return workouts.find((w) => w.id === id) || {} as Workout;
  };

  const duplicateWorkout = (id: string) => {
    const workout = workouts.find((w) => w.id === id);
    if (workout) {
      const newWorkout = {
        ...workout,
        id: uuidv4(),
        name: `${workout.name} (Copy)`,
        date: new Date().toISOString(),
      };
      setWorkouts((prev) => [...prev, newWorkout]);
      toast({
        title: "Workout Duplicated",
        description: "A copy of your workout has been created.",
      });
    }
  };

  const toggleDeloadMode = (workoutId: string, isDeload: boolean) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId ? { ...w, isDeload } : w
      )
    );
    toast({
      title: isDeload ? "Deload Mode Enabled" : "Deload Mode Disabled",
      description: isDeload
        ? "Your workout is now in deload mode."
        : "Deload mode has been turned off.",
    });
  };

  const addWorkoutTemplate = (workoutTemplate: WorkoutTemplate) => {
    setWorkoutTemplates((prev) => [...prev, workoutTemplate]);
    toast({
      title: "Template Added",
      description: "Your workout template has been saved.",
    });
  };

  const updateWorkoutTemplate = (workoutTemplate: WorkoutTemplate) => {
    setWorkoutTemplates((prev) =>
      prev.map((t) => (t.id === workoutTemplate.id ? workoutTemplate : t))
    );
    toast({
      title: "Template Updated",
      description: "Your workout template has been updated.",
    });
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Template Deleted",
      description: "Your workout template has been removed.",
    });
  };

  const duplicateWorkoutTemplate = (id: string) => {
    const template = workoutTemplates.find((t) => t.id === id);
    if (template) {
      const newTemplate = {
        ...template,
        id: uuidv4(),
        name: `${template.name} (Copy)`,
      };
      setWorkoutTemplates((prev) => [...prev, newTemplate]);
      toast({
        title: "Template Duplicated",
        description: "A copy of your workout template has been created.",
      });
    }
  };

  const addWorkoutPlan = (workoutPlan: WorkoutPlan) => {
    setWorkoutPlans((prev) => [...prev, workoutPlan]);
    toast({
      title: "Plan Added",
      description: "Your workout plan has been saved.",
    });
  };

  const updateWorkoutPlan = (workoutPlan: WorkoutPlan) => {
    setWorkoutPlans((prev) =>
      prev.map((p) => (p.id === workoutPlan.id ? workoutPlan : p))
    );
    toast({
      title: "Plan Updated",
      description: "Your workout plan has been updated.",
    });
  };

  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Plan Deleted",
      description: "Your workout plan has been removed.",
    });
  };

  const duplicateWorkoutPlan = (id: string) => {
    const plan = workoutPlans.find((p) => p.id === id);
    if (plan) {
      const newPlan = {
        ...plan,
        id: uuidv4(),
        name: `${plan.name} (Copy)`,
        isActive: false,
      };
      setWorkoutPlans((prev) => [...prev, newPlan]);
      toast({
        title: "Plan Duplicated",
        description: "A copy of your workout plan has been created.",
      });
    }
  };

  const setActivePlan = (id: string) => {
    setWorkoutPlans((prev) =>
      prev.map((plan) => ({
        ...plan,
        isActive: plan.id === id ? true : false,
      }))
    );
    toast({
      title: "Active Plan Set",
      description: "Your active workout plan has been updated.",
    });
  };

  const addTemplateToPlan = (planId: string, templateId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId);
    const template = workoutTemplates.find((t) => t.id === templateId);
    if (plan && template) {
      setWorkoutPlans((prev) =>
        prev.map((p) =>
          p.id === planId
            ? { ...p, workoutTemplates: [...p.workoutTemplates, template] }
            : p
        )
      );
      toast({
        title: "Template Added to Plan",
        description: "The template has been added to your plan.",
      });
    }
  };

  const removeTemplateFromPlan = (planId: string, templateId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId);
    if (plan) {
      setWorkoutPlans((prev) =>
        prev.map((p) =>
          p.id === planId
            ? {
                ...p,
                workoutTemplates: p.workoutTemplates.filter((t) => t.id !== templateId),
              }
            : p
        )
      );
      toast({
        title: "Template Removed from Plan",
        description: "The template has been removed from your plan.",
      });
    }
  };

  const addSupplement = (supplement: Supplement) => {
    setSupplements((prev) => [...prev, supplement]);
    toast({
      title: "Supplement Added",
      description: "Your supplement has been saved.",
    });
  };

  const updateSupplement = (supplement: Supplement) => {
    setSupplements((prev) =>
      prev.map((s) => (s.id === supplement.id ? supplement : s))
    );
    toast({
      title: "Supplement Updated",
      description: "Your supplement has been updated.",
    });
  };

  const deleteSupplement = (id: string) => {
    setSupplements((prev) => prev.filter((s) => s.id !== id));
    toast({
      title: "Supplement Deleted",
      description: "Your supplement has been removed.",
    });
  };

  const addSupplementLog = (log: SupplementLog) => {
    setSupplementLogs((prev) => [...prev, log]);
    toast({
      title: "Supplement Log Added",
      description: "Your supplement log has been saved.",
    });
  };

  const updateSupplementLog = (log: SupplementLog) => {
    setSupplementLogs((prev) => prev.map((l) => (l.id === log.id ? log : l)));
    toast({
      title: "Supplement Log Updated",
      description: "Your supplement log has been updated.",
    });
  };

  const deleteSupplementLog = (id: string) => {
    setSupplementLogs((prev) => prev.filter((l) => l.id !== id));
    toast({
      title: "Supplement Log Deleted",
      description: "Your supplement log has been removed.",
    });
  };

  const addSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles((prev) => [...prev, cycle]);
    toast({
      title: "Steroid Cycle Added",
      description: "Your steroid cycle has been saved.",
    });
  };

  const updateSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles((prev) => prev.map((c) => (c.id === cycle.id ? cycle : c)));
    toast({
      title: "Steroid Cycle Updated",
      description: "Your steroid cycle has been updated.",
    });
  };

  const deleteSteroidCycle = (id: string) => {
    setSteroidCycles((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Steroid Cycle Deleted",
      description: "Your steroid cycle has been removed.",
    });
  };

  const addCompound = (compound: SteroidCompound) => {
    setCompounds((prev) => [...prev, compound]);
    toast({
      title: "Compound Added",
      description: "Your compound has been saved.",
    });
  };

  const updateCompound = (compound: SteroidCompound) => {
    setCompounds((prev) => prev.map((c) => (c.id === compound.id ? compound : c)));
    toast({
      title: "Compound Updated",
      description: "Your compound has been updated.",
    });
  };

  const deleteCompound = (id: string) => {
    setCompounds((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: "Compound Deleted",
      description: "Your compound has been removed.",
    });
  };

  const getCompoundsByCycleId = (cycleId: string): SteroidCompound[] => {
    return compounds.filter((c) => c.cycleId === cycleId);
  };

  const addReminder = (reminder: Reminder) => {
    setReminders((prev) => [...prev, reminder]);
    toast({
      title: "Reminder Added",
      description: "Your reminder has been saved.",
    });
  };

  const updateReminder = (reminder: Reminder) => {
    setReminders((prev) => prev.map((r) => (r.id === reminder.id ? reminder : r)));
    toast({
      title: "Reminder Updated",
      description: "Your reminder has been updated.",
    });
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "Your reminder has been removed.",
    });
  };

  const getDueReminders = (): Reminder[] => {
    const now = new Date();
    return reminders.filter((r) => {
      if (r.dismissed) return false;
      const dueDate = new Date(r.dueDate);
      return dueDate <= now && !r.seen;
    });
  };

  const markReminderAsSeen = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, seen: true } : r))
    );
    toast({
      title: "Reminder Marked as Seen",
      description: "The reminder has been marked as seen.",
    });
  };

  const dismissReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, dismissed: true } : r))
    );
    toast({
      title: "Reminder Dismissed",
      description: "The reminder has been dismissed.",
    });
  };

  const addBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements((prev) => [...prev, measurement]);
    toast({
      title: "Measurement Added",
      description: "Your body measurement has been saved.",
    });
  };

  const updateBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements((prev) =>
      prev.map((m) => (m.id === measurement.id ? measurement : m))
    );
    toast({
      title: "Measurement Updated",
      description: "Your body measurement has been updated.",
    });
  };

  const deleteBodyMeasurement = (id: string) => {
    setBodyMeasurements((prev) => prev.filter((m) => m.id !== id));
    toast({
      title: "Measurement Deleted",
      description: "Your body measurement has been removed.",
    });
  };

  const getBodyMeasurementById = (id: string): BodyMeasurement => {
    return bodyMeasurements.find((m) => m.id === id) || {} as BodyMeasurement;
  };

  const addMoodLog = (log: MoodLog) => {
    setMoodLogs((prev) => [...prev, log]);
    toast({
      title: "Mood Log Added",
      description: "Your mood log has been saved.",
    });
  };

  const updateMoodLog = (log: MoodLog) => {
    setMoodLogs((prev) => prev.map((l) => (l.id === log.id ? log : l)));
    toast({
      title: "Mood Log Updated",
      description: "Your mood log has been updated.",
    });
  };

  const deleteMoodLog = (id: string) => {
    setMoodLogs((prev) => prev.filter((l) => l.id !== id));
    toast({
      title: "Mood Log Deleted",
      description: "Your mood log has been removed.",
    });
  };

  const getMoodLogById = (id: string): MoodLog => {
    return moodLogs.find((m) => m.id === id) || {} as MoodLog;
  };

  const addWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints((prev) => [...prev, weakPoint]);
    toast({
      title: "Weak Point Added",
      description: "Your weak point has been saved.",
    });
  };

  const updateWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints((prev) => prev.map((w) => (w.id === weakPoint.id ? weakPoint : w)));
    toast({
      title: "Weak Point Updated",
      description: "Your weak point has been updated.",
    });
  };

  const deleteWeakPoint = (id: string) => {
    setWeakPoints((prev) => prev.filter((w) => w.id !== id));
    toast({
      title: "Weak Point Deleted",
      description: "Your weak point has been removed.",
    });
  };

  const getWeakPointById = (id: string): WeakPoint => {
    return weakPoints.find((w) => w.id === id) || {} as WeakPoint;
  };

  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines((prev) => [...prev, routine]);
    toast({
      title: "Routine Added",
      description: "Your weekly routine has been saved.",
    });
  };

  const updateWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines((prev) => prev.map((r) => (r.id === routine.id ? routine : r)));
    toast({
      title: "Routine Updated",
      description: "Your weekly routine has been updated.",
    });
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines((prev) => prev.filter((r) => r.id !== id));
    toast({
      title: "Routine Deleted",
      description: "Your weekly routine has been removed.",
    });
  };

  const getWeeklyRoutineById = (id: string): WeeklyRoutine => {
    return weeklyRoutines.find((r) => r.id === id) || {} as WeeklyRoutine;
  };

  const duplicateWeeklyRoutine = (id: string) => {
    const routine = weeklyRoutines.find((r) => r.id === id);
    if (routine) {
      const newRoutine = {
        ...routine,
        id: uuidv4(),
        name: `${routine.name} (Copy)`,
      };
      setWeeklyRoutines((prev) => [...prev, newRoutine]);
      toast({
        title: "Routine Duplicated",
        description: "A copy of your weekly routine has been created.",
      });
    }
  };

  const archiveWeeklyRoutine = (id: string, archived: boolean) => {
    const routine = weeklyRoutines.find((r) => r.id === id);
    if (routine) {
      setWeeklyRoutines((prev) =>
        prev.map((r) => (r.id === id ? { ...r, archived } : r))
      );
      toast({
        title: archived ? "Routine Archived" : "Routine Unarchived",
        description: archived
          ? "Your weekly routine has been archived."
          : "Your weekly routine has been unarchived.",
      });
    }
  };

  const addTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks((prev) => [...prev, block]);
    toast({
      title: "Training Block Added",
      description: "Your training block has been saved.",
    });
  };

  const updateTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks((prev) => prev.map((b) => (b.id === block.id ? block : b)));
    toast({
      title: "Training Block Updated",
      description: "Your training block has been updated.",
    });
  };

  const deleteTrainingBlock = (id: string) => {
    setTrainingBlocks((prev) => prev.filter((b) => b.id !== id));
    toast({
      title: "Training Block Deleted",
      description: "Your training block has been removed.",
    });
  };

  const getTrainingBlockById = (id: string): TrainingBlock => {
    return trainingBlocks.find((b) => b.id === id) || {} as TrainingBlock;
  };

  const checkTrainingBlockStatus = (): { needsUpdate: boolean; trainingBlock: TrainingBlock | null } => {
    const now = new Date();
    const activeBlock = trainingBlocks.find((block) => {
      const start = new Date(block.startDate);
      const endDate = new Date(start);
      endDate.setDate(start.getDate() + block.durationWeeks * 7);
      return now >= start && now <= endDate;
    });

    if (!activeBlock) return { needsUpdate: false, trainingBlock: null };

    const start = new Date(activeBlock.startDate);
    const endDate = new Date(start);
    endDate.setDate(start.getDate() + activeBlock.durationWeeks * 7);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const needsUpdate = daysRemaining <= 7;

    return { needsUpdate, trainingBlock: activeBlock };
  };

  const addProgressPhoto = (photo: ProgressPhoto) => {
    setProgressPhotos((prev) => [...prev, photo]);
    toast({
      title: "Progress Photo Added",
      description: "Your progress photo has been saved.",
    });
  };

  const updateProgressPhoto = (photo: ProgressPhoto) => {
    setProgressPhotos((prev) => prev.map((p) => (p.id === photo.id ? photo : p)));
    toast({
      title: "Progress Photo Updated",
      description: "Your progress photo has been updated.",
    });
  };

  const deleteProgressPhoto = (id: string) => {
    setProgressPhotos((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Progress Photo Deleted",
      description: "Your progress photo has been removed.",
    });
  };

  const updateUnitSystem = (update: Partial<UnitSystem>) => {
    setUnitSystem((prev) => {
      const newSystem = { ...prev, ...update };
      localStorage.setItem('ironlog_unit_system', JSON.stringify(newSystem));
      return newSystem;
    });
    toast({
      title: "Unit System Updated",
      description: "Your unit preferences have been updated.",
    });
  };

  const getWeightUnitDisplay = (unit: WeightUnit): string => {
    switch (unit) {
      case 'kg': return 'kg';
      case 'lbs': return 'lbs';
      case 'stone': return 'st';
      default: return 'kg';
    }
  };

  const getMeasurementUnitDisplay = (unit: MeasurementUnit): string => {
    switch (unit) {
      case 'cm': return 'cm';
      case 'in': return 'in';
      default: return 'cm';
    }
  };

  const exportData = (type: string): string => {
    let csvData = '';
    switch (type) {
      case 'workouts':
        csvData = 'Date,Name,Exercises,Sets,Reps,Weight,Completed\n';
        workouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
            exercise.sets.forEach((set, index) => {
              csvData += `${new Date(workout.date).toISOString()},${workout.name},${exercise.name},${index + 1},${set.reps},${set.weight},${workout.completed}\n`;
            });
          });
        });
        break;
      case 'measurements':
        csvData = 'Date,Weight,BodyFat,MuscleMass,Arms,Chest,Waist,Legs,Notes\n';
        bodyMeasurements.forEach(m => {
          csvData += `${new Date(m.date).toISOString()},${m.weight},${m.bodyFat || ''},${m.muscleMass || ''},${m.arms || ''},${m.chest || ''},${m.waist || ''},${m.legs || ''},${m.notes || ''}\n`;
        });
        break;
      case 'supplements':
        csvData = 'Date,Supplement,Dosage,Taken,Notes\n';
        supplementLogs.forEach(log => {
          const supplement = supplements.find(s => s.id === log.supplementId);
          csvData += `${new Date(log.date).toISOString()},${supplement?.name || ''},${log.dosageTaken},${log.taken},${log.notes || ''}\n`;
        });
        break;
      case 'progressPhotos':
        csvData = 'Date,Photo\n';
        progressPhotos.forEach(photo => {
          csvData += `${new Date(photo.date).toISOString()},${photo.url}\n`;
        });
        break;
      default:
        csvData = 'No data to export';
    }
    return csvData;
  };

  const safeLocalStorage = {
    setItem: (key: string, value: string): boolean => {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
        toast({
          title: "Storage error",
          description: `Unable to save ${key}. Consider exporting your data.`,
          variant: "destructive",
        });
        return false;
      }
    }
  };

  useEffect(() => {
    if (workoutTemplates.length > 0) {
      safeLocalStorage.setItem('workoutTemplates', JSON.stringify(workoutTemplates));
    }
    
    if (workoutPlans.length > 0) {
      safeLocalStorage.setItem('workoutPlans', JSON.stringify(workoutPlans));
    }
    
    if (supplements.length > 0) {
      safeLocalStorage.setItem('supplements', JSON.stringify(supplements));
    }
    
    if (supplementLogs.length > 0) {
      safeLocalStorage.setItem('supplementLogs', JSON.stringify(supplementLogs));
    }
    
    if (steroidCycles.length > 0) {
      safeLocalStorage.setItem('steroidCycles', JSON.stringify(steroidCycles));
    }
    
    if (compounds.length > 0) {
      safeLocalStorage.setItem('compounds', JSON.stringify(compounds));
    }
    
    if (reminders.length > 0) {
      safeLocalStorage.setItem('reminders', JSON.stringify(reminders));
    }
    
    if (bodyMeasurements.length > 0) {
      safeLocalStorage.setItem('bodyMeasurements', JSON.stringify(bodyMeasurements));
    }
    
    if (moodLogs.length > 0) {
      safeLocalStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    }
    
    if (weakPoints.length > 0) {
      safeLocalStorage.setItem('weakPoints', JSON.stringify(weakPoints));
    }
    
    if (weeklyRoutines.length > 0) {
      safeLocalStorage.setItem('weeklyRoutines', JSON.stringify(weeklyRoutines));
    }
    
    if (trainingBlocks.length > 0) {
      safeLocalStorage.setItem('trainingBlocks', JSON.stringify(trainingBlocks));
    }
    
    if (progressPhotos && progressPhotos.length > 0) {
      safeLocalStorage.setItem('progressPhotos', JSON.stringify(progressPhotos));
    }
  }, [
    workoutTemplates, workoutPlans, 
    supplements, supplementLogs, steroidCycles, 
    compounds, reminders, bodyMeasurements,
    moodLogs, weakPoints, weeklyRoutines, trainingBlocks,
    progressPhotos
  ]);

  useEffect(() => {
    localStorage.setItem('ironlog_unit_system', JSON.stringify(unitSystem));
  }, [unitSystem]);

  const value = {
    workouts,
    setWorkouts,
    addWorkout,
    addWorkoutByName,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
    duplicateWorkout,
    toggleDeloadMode,
    
    workoutTemplates,
    setWorkoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
    duplicateWorkoutTemplate,
    
    workoutPlans,
    setWorkoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    duplicateWorkoutPlan,
    setActivePlan,
    addTemplateToPlan,
    removeTemplateFromPlan,
    
    supplements,
    setSupplements,
    supplementLogs,
    setSupplementLogs,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    addSupplementLog,
    updateSupplementLog,
    deleteSupplementLog,

    steroidCycles,
    setSteroidCycles,
    addSteroidCycle,
    updateSteroidCycle,
    deleteSteroidCycle,
    
    compounds,
    setCompounds,
    addCompound,
    updateCompound,
    deleteCompound,
    getCompoundsByCycleId,

    reminders,
    setReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getDueReminders,
    markReminderAsSeen,
    dismissReminder,
    
    bodyMeasurements,
    setBodyMeasurements,
    addBodyMeasurement,
    updateBodyMeasurement,
    deleteBodyMeasurement,
    getBodyMeasurementById,
    
    moodLogs,
    setMoodLogs,
    addMoodLog,
    updateMoodLog,
    deleteMoodLog,
    getMoodLogById,
    
    weakPoints,
    setWeakPoints,
    addWeakPoint,
    updateWeakPoint,
    deleteWeakPoint,
    getWeakPointById,
    
    weeklyRoutines,
    setWeeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    getWeeklyRoutineById,
    duplicateWeeklyRoutine,
    archiveWeeklyRoutine,
    
    trainingBlocks,
    setTrainingBlocks,
    addTrainingBlock,
    updateTrainingBlock,
    deleteTrainingBlock,
    getTrainingBlockById,
    checkTrainingBlockStatus,
    
    progressPhotos,
    setProgressPhotos,
    addProgressPhoto,
    updateProgressPhoto,
    deleteProgressPhoto,
    
    unitSystem,
    setUnitSystem,
    updateUnitSystem,
    convertWeight,
    convertMeasurement,
    getWeightUnitDisplay,
    getMeasurementUnitDisplay,
    
    exportData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
