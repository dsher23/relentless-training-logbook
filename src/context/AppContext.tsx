import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Workout,
  Exercise,
  Measurement,
  BodyMeasurement,
  Supplement,
  Cycle,
  SteroidCompound,
  SteroidCycle,
  SupplementLog,
  PR,
  WorkoutDay,
  WeeklyRoutine,
  WorkoutTemplate,
  WorkoutPlan,
  Reminder,
  MoodLog,
  TrainingBlock,
  WeakPoint,
  CycleCompound,
  ProgressPhoto,
  UnitSystem,
  WeightUnit,
  MeasurementUnit,
  PRLift,
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import { addDays, isSameDay, subDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, "id">) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  markWorkoutCompleted: (id: string) => void;
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, "id">) => void;
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  measurements: Measurement[];
  addMeasurement: (measurement: Omit<Measurement, "id">) => void;
  updateMeasurement: (measurement: Measurement) => void;
  deleteMeasurement: (id: string) => void;
  bodyMeasurements: BodyMeasurement[];
  addBodyMeasurement: (measurement: Omit<BodyMeasurement, "id">) => void;
  updateBodyMeasurement: (measurement: BodyMeasurement) => void;
  deleteBodyMeasurement: (id: string) => void;
  supplements: Supplement[];
  addSupplement: (supplement: Omit<Supplement, "id">) => void;
  updateSupplement: (supplement: Supplement) => void;
  deleteSupplement: (id: string) => void;
  cycles: Cycle[];
  addCycle: (cycle: Omit<Cycle, "id">) => void;
  updateCycle: (cycle: Cycle) => void;
  deleteCycle: (id: string) => void;
  steroidCompounds: SteroidCompound[];
  addSteroidCompound: (compound: Omit<SteroidCompound, "id">) => void;
  updateSteroidCompound: (compound: SteroidCompound) => void;
  deleteSteroidCompound: (id: string) => void;
  steroidCycles: SteroidCycle[];
  addSteroidCycle: (cycle: Omit<SteroidCycle, "id">) => void;
  updateSteroidCycle: (cycle: SteroidCycle) => void;
  deleteSteroidCycle: (id: string) => void;
  supplementLogs: SupplementLog[];
  addSupplementLog: (log: Omit<SupplementLog, "id">) => void;
  updateSupplementLog: (log: SupplementLog) => void;
  deleteSupplementLog: (id: string) => void;
  prs: PR[];
  addPR: (pr: Omit<PR, "id">) => void;
  updatePR: (pr: PR) => void;
  deletePR: (id: string) => void;
  workoutDays: WorkoutDay[];
  addWorkoutDay: (workoutDay: Omit<WorkoutDay, "id">) => void;
  updateWorkoutDay: (workoutDay: WorkoutDay) => void;
  deleteWorkoutDay: (id: string) => void;
  weeklyRoutines: WeeklyRoutine[];
  addWeeklyRoutine: (weeklyRoutine: Omit<WeeklyRoutine, "id">) => void;
  updateWeeklyRoutine: (weeklyRoutine: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  workoutTemplates: WorkoutTemplate[];
  addWorkoutTemplate: (workoutTemplate: Omit<WorkoutTemplate, "id">) => void;
  updateWorkoutTemplate: (workoutTemplate: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  duplicateWorkoutTemplate: (id: string) => void;
  workoutPlans: WorkoutPlan[];
  addWorkoutPlan: (workoutPlan: Omit<WorkoutPlan, "id">) => void;
  updateWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  addTemplateToPlan: (planId: string, templateId: string) => void;
  removeTemplateFromPlan: (planId: string, templateId: string) => void;
  activePlanId: string | null;
  setActivePlan: (planId: string | null) => void;
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  updateReminder: (reminder: Reminder) => void;
  dismissReminder: (id: string) => void;
  markReminderAsSeen: (id: string) => void;
  moodLogs: MoodLog[];
  addMoodLog: (moodLog: Omit<MoodLog, "id">) => void;
  updateMoodLog: (moodLog: MoodLog) => void;
  deleteMoodLog: (id: string) => void;
  trainingBlocks: TrainingBlock[];
  addTrainingBlock: (trainingBlock: Omit<TrainingBlock, "id">) => void;
  updateTrainingBlock: (trainingBlock: TrainingBlock) => void;
  deleteTrainingBlock: (id: string) => void;
  weakPoints: WeakPoint[];
  addWeakPoint: (weakPoint: Omit<WeakPoint, "id">) => void;
  updateWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  cycleCompounds: CycleCompound[];
  addCycleCompound: (cycleCompound: Omit<CycleCompound, "id">) => void;
  updateCycleCompound: (cycleCompound: CycleCompound) => void;
  deleteCycleCompound: (id: string) => void;
  progressPhotos: ProgressPhoto[];
  addProgressPhoto: (progressPhoto: Omit<ProgressPhoto, "id">) => void;
  updateProgressPhoto: (progressPhoto: ProgressPhoto) => void;
  deleteProgressPhoto: (id: string) => void;
  unitSystem: UnitSystem;
  updateUnitSystem: (newUnitSystem: UnitSystem) => void;
  convertWeight: (
    weight: number,
    fromUnit: WeightUnit,
    toUnit: WeightUnit
  ) => number;
  getWeightUnitDisplay: () => string;
  prLifts: PRLift[];
  addPRLift: (prLift: Omit<PRLift, "id">) => void;
  updatePRLift: (prLift: PRLift) => void;
  deletePRLift: (id: string) => void;
  getDueReminders: () => Reminder[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const storedWorkouts = localStorage.getItem("workouts");
    return storedWorkouts ? JSON.parse(storedWorkouts) : [];
  });
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const storedExercises = localStorage.getItem("exercises");
    return storedExercises ? JSON.parse(storedExercises) : [];
  });
  const [measurements, setMeasurements] = useState<Measurement[]>(() => {
    const storedMeasurements = localStorage.getItem("measurements");
    return storedMeasurements ? JSON.parse(storedMeasurements) : [];
  });
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(
    () => {
      const storedBodyMeasurements = localStorage.getItem("bodyMeasurements");
      return storedBodyMeasurements ? JSON.parse(storedBodyMeasurements) : [];
    }
  );
  const [supplements, setSupplements] = useState<Supplement[]>(() => {
    const storedSupplements = localStorage.getItem("supplements");
    return storedSupplements ? JSON.parse(storedSupplements) : [];
  });
  const [cycles, setCycles] = useState<Cycle[]>(() => {
    const storedCycles = localStorage.getItem("cycles");
    return storedCycles ? JSON.parse(storedCycles) : [];
  });
  const [steroidCompounds, setSteroidCompounds] = useState<SteroidCompound[]>(
    () => {
      const storedSteroidCompounds = localStorage.getItem("steroidCompounds");
      return storedSteroidCompounds ? JSON.parse(storedSteroidCompounds) : [];
    }
  );
  const [steroidCycles, setSteroidCycles] = useState<SteroidCycle[]>(() => {
    const storedSteroidCycles = localStorage.getItem("steroidCycles");
    return storedSteroidCycles ? JSON.parse(storedSteroidCycles) : [];
  });
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>(() => {
    const storedSupplementLogs = localStorage.getItem("supplementLogs");
    return storedSupplementLogs ? JSON.parse(storedSupplementLogs) : [];
  });
  const [prs, setPRs] = useState<PR[]>(() => {
    const storedPRs = localStorage.getItem("prs");
    return storedPRs ? JSON.parse(storedPRs) : [];
  });
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>(() => {
    const storedWorkoutDays = localStorage.getItem("workoutDays");
    return storedWorkoutDays ? JSON.parse(storedWorkoutDays) : [];
  });
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>(() => {
    const storedWeeklyRoutines = localStorage.getItem("weeklyRoutines");
    return storedWeeklyRoutines ? JSON.parse(storedWeeklyRoutines) : [];
  });
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(
    () => {
      const storedWorkoutTemplates = localStorage.getItem("workoutTemplates");
      return storedWorkoutTemplates ? JSON.parse(storedWorkoutTemplates) : [];
    }
  );
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(() => {
    const storedWorkoutPlans = localStorage.getItem("workoutPlans");
    return storedWorkoutPlans ? JSON.parse(storedWorkoutPlans) : [];
  });
  const [activePlanId, setActivePlanId] = useState<string | null>(() => {
    const storedActivePlanId = localStorage.getItem("activePlanId");
    return storedActivePlanId ? storedActivePlanId : null;
  });
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const storedReminders = localStorage.getItem("reminders");
    return storedReminders ? JSON.parse(storedReminders) : [];
  });
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
    const storedMoodLogs = localStorage.getItem("moodLogs");
    return storedMoodLogs ? JSON.parse(storedMoodLogs) : [];
  });
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>(() => {
    const storedTrainingBlocks = localStorage.getItem("trainingBlocks");
    return storedTrainingBlocks ? JSON.parse(storedTrainingBlocks) : [];
  });
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>(() => {
    const storedWeakPoints = localStorage.getItem("weakPoints");
    return storedWeakPoints ? JSON.parse(storedWeakPoints) : [];
  });
  const [cycleCompounds, setCycleCompounds] = useState<CycleCompound[]>(() => {
    const storedCycleCompounds = localStorage.getItem("cycleCompounds");
    return storedCycleCompounds ? JSON.parse(storedCycleCompounds) : [];
  });
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>(() => {
    const storedProgressPhotos = localStorage.getItem("progressPhotos");
    return storedProgressPhotos ? JSON.parse(storedProgressPhotos) : [];
  });
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    const storedUnitSystem = localStorage.getItem("unitSystem");
    return storedUnitSystem
      ? JSON.parse(storedUnitSystem)
      : { bodyWeightUnit: "kg", bodyMeasurementUnit: "cm", liftingWeightUnit: "kg" };
  });
  const [prLifts, setPRLifts] = useState<PRLift[]>(() => {
    const storedPRLifts = localStorage.getItem("prLifts");
    return storedPRLifts ? JSON.parse(storedPRLifts) : [];
  });

  const { toast } = useToast();

  // Function to get due reminders
  const getDueReminders = useCallback(() => {
    const now = new Date();
    return reminders.filter(reminder => {
      if (!reminder.dateTime) return false;
      const reminderDateTime = new Date(reminder.dateTime);
      return reminderDateTime <= now && !reminder.dismissed;
    });
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem("measurements", JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem("bodyMeasurements", JSON.stringify(bodyMeasurements));
  }, [bodyMeasurements]);

  useEffect(() => {
    localStorage.setItem("supplements", JSON.stringify(supplements));
  }, [supplements]);

  useEffect(() => {
    localStorage.setItem("cycles", JSON.stringify(cycles));
  }, [cycles]);

  useEffect(() => {
    localStorage.setItem("steroidCompounds", JSON.stringify(steroidCompounds));
  }, [steroidCompounds]);

  useEffect(() => {
    localStorage.setItem("steroidCycles", JSON.stringify(steroidCycles));
  }, [steroidCycles]);

  useEffect(() => {
    localStorage.setItem("supplementLogs", JSON.stringify(supplementLogs));
  }, [supplementLogs]);

  useEffect(() => {
    localStorage.setItem("prs", JSON.stringify(prs));
  }, [prs]);

  useEffect(() => {
    localStorage.setItem("workoutDays", JSON.stringify(workoutDays));
  }, [workoutDays]);

  useEffect(() => {
    localStorage.setItem("weeklyRoutines", JSON.stringify(weeklyRoutines));
  }, [weeklyRoutines]);

  useEffect(() => {
    localStorage.setItem("workoutTemplates", JSON.stringify(workoutTemplates));
  }, [workoutTemplates]);

  useEffect(() => {
    localStorage.setItem("workoutPlans", JSON.stringify(workoutPlans));
  }, [workoutPlans]);

  useEffect(() => {
    localStorage.setItem("activePlanId", activePlanId || "");
  }, [activePlanId]);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("moodLogs", JSON.stringify(moodLogs));
  }, [moodLogs]);

  useEffect(() => {
    localStorage.setItem("trainingBlocks", JSON.stringify(trainingBlocks));
  }, [trainingBlocks]);

  useEffect(() => {
    localStorage.setItem("weakPoints", JSON.stringify(weakPoints));
  }, [weakPoints]);

  useEffect(() => {
    localStorage.setItem("cycleCompounds", JSON.stringify(cycleCompounds));
  }, [cycleCompounds]);

  useEffect(() => {
    localStorage.setItem("progressPhotos", JSON.stringify(progressPhotos));
  }, [progressPhotos]);

  useEffect(() => {
    localStorage.setItem("unitSystem", JSON.stringify(unitSystem));
  }, [unitSystem]);

  useEffect(() => {
    localStorage.setItem("prLifts", JSON.stringify(prLifts));
  }, [prLifts]);

  const addWorkout = (workout: Omit<Workout, "id">) => {
    const newWorkout: Workout = { id: uuidv4(), ...workout };
    setWorkouts([...workouts, newWorkout]);
    toast({
      title: "Success",
      description: `Added workout ${workout.name}`,
    });
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts(
      workouts.map((w) => (w.id === workout.id ? { ...workout } : w))
    );
    toast({
      title: "Success",
      description: `Updated workout ${workout.name}`,
    });
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter((workout) => workout.id !== id));
    toast({
      title: "Success",
      description: "Deleted workout",
    });
  };

  const markWorkoutCompleted = (id: string) => {
    setWorkouts(
      workouts.map((workout) =>
        workout.id === id ? { ...workout, completed: !workout.completed } : workout
      )
    );
    toast({
      title: "Success",
      description: "Workout updated",
    });
  };

  const addExercise = (exercise: Omit<Exercise, "id">) => {
    const newExercise: Exercise = { id: uuidv4(), ...exercise };
    setExercises([...exercises, newExercise]);
    toast({
      title: "Success",
      description: `Added exercise ${exercise.name}`,
    });
  };

  const updateExercise = (exercise: Exercise) => {
    setExercises(
      exercises.map((e) => (e.id === exercise.id ? { ...exercise } : e))
    );
    toast({
      title: "Success",
      description: `Updated exercise ${exercise.name}`,
    });
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
    toast({
      title: "Success",
      description: "Deleted exercise",
    });
  };

  const addMeasurement = (measurement: Omit<Measurement, "id">) => {
    const newMeasurement: Measurement = { id: uuidv4(), ...measurement };
    setMeasurements([...measurements, newMeasurement]);
    toast({
      title: "Success",
      description: "Added measurement",
    });
  };

  const updateMeasurement = (measurement: Measurement) => {
    setMeasurements(
      measurements.map((m) =>
        m.id === measurement.id ? { ...measurement } : m
      )
    );
    toast({
      title: "Success",
      description: "Updated measurement",
    });
  };

  const deleteMeasurement = (id: string) => {
    setMeasurements(measurements.filter((measurement) => measurement.id !== id));
    toast({
      title: "Success",
      description: "Deleted measurement",
    });
  };

  const addBodyMeasurement = (measurement: Omit<BodyMeasurement, "id">) => {
    const newBodyMeasurement: BodyMeasurement = { id: uuidv4(), ...measurement };
    setBodyMeasurements([...bodyMeasurements, newBodyMeasurement]);
    toast({
      title: "Success",
      description: "Added body measurement",
    });
  };

  const updateBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements(
      bodyMeasurements.map((bm) =>
        bm.id === measurement.id ? { ...measurement } : bm
      )
    );
    toast({
      title: "Success",
      description: "Updated body measurement",
    });
  };

  const deleteBodyMeasurement = (id: string) => {
    setBodyMeasurements(
      bodyMeasurements.filter((measurement) => measurement.id !== id)
    );
    toast({
      title: "Success",
      description: "Deleted body measurement",
    });
  };

  const addSupplement = (supplement: Omit<Supplement, "id">) => {
    const newSupplement: Supplement = { id: uuidv4(), ...supplement };
    setSupplements([...supplements, newSupplement]);
    toast({
      title: "Success",
      description: `Added supplement ${supplement.name}`,
    });
  };

  const updateSupplement = (supplement: Supplement) => {
    setSupplements(
      supplements.map((s) => (s.id === supplement.id ? { ...supplement } : s))
    );
    toast({
      title: "Success",
      description: `Updated supplement ${supplement.name}`,
    });
  };

  const deleteSupplement = (id: string) => {
    setSupplements(supplements.filter((supplement) => supplement.id !== id));
    toast({
      title: "Success",
      description: "Deleted supplement",
    });
  };

  const addCycle = (cycle: Omit<Cycle, "id">) => {
    const newCycle: Cycle = { id: uuidv4(), ...cycle };
    setCycles([...cycles, newCycle]);
    toast({
      title: "Success",
      description: `Added cycle ${cycle.name}`,
    });
  };

  const updateCycle = (cycle: Cycle) => {
    setCycles(cycles.map((c) => (c.id === cycle.id ? { ...cycle } : c)));
    toast({
      title: "Success",
      description: `Updated cycle ${cycle.name}`,
    });
  };

  const deleteCycle = (id: string) => {
    setCycles(cycles.filter((cycle) => cycle.id !== id));
    toast({
      title: "Success",
      description: "Deleted cycle",
    });
  };

  const addSteroidCompound = (compound: Omit<SteroidCompound, "id">) => {
    const newSteroidCompound: SteroidCompound = { id: uuidv4(), ...compound };
    setSteroidCompounds([...steroidCompounds, newSteroidCompound]);
    toast({
      title: "Success",
      description: `Added compound ${compound.name}`,
    });
  };

  const updateSteroidCompound = (compound: SteroidCompound) => {
    setSteroidCompounds(
      steroidCompounds.map((sc) => (sc.id === compound.id ? { ...compound } : sc))
    );
    toast({
      title: "Success",
      description: `Updated compound ${compound.name}`,
    });
  };

  const deleteSteroidCompound = (id: string) => {
    setSteroidCompounds(
      steroidCompounds.filter((compound) => compound.id !== id)
    );
    toast({
      title: "Success",
      description: "Deleted steroid compound",
    });
  };

  const addSteroidCycle = (cycle: Omit<SteroidCycle, "id">) => {
    const newSteroidCycle: SteroidCycle = { id: uuidv4(), ...cycle };
    setSteroidCycles([...steroidCycles, newSteroidCycle]);
    toast({
      title: "Success",
      description: `Added cycle ${cycle.name}`,
    });
  };

  const updateSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles(
      steroidCycles.map((sc) => (sc.id === cycle.id ? { ...cycle } : sc))
    );
    toast({
      title: "Success",
      description: `Updated cycle ${cycle.name}`,
    });
  };

  const deleteSteroidCycle = (id: string) => {
    setSteroidCycles(steroidCycles.filter((cycle) => cycle.id !== id));
    toast({
      title: "Success",
      description: "Deleted steroid cycle",
    });
  };

  const addSupplementLog = (log: Omit<SupplementLog, "id">) => {
    const newSupplementLog: SupplementLog = { id: uuidv4(), ...log };
    setSupplementLogs([...supplementLogs, newSupplementLog]);
    toast({
      title: "Success",
      description: "Added supplement log",
    });
  };

  const updateSupplementLog = (log: SupplementLog) => {
    setSupplementLogs(
      supplementLogs.map((sl) => (sl.id === log.id ? { ...log } : sl))
    );
    toast({
      title: "Success",
      description: "Updated supplement log",
    });
  };

  const deleteSupplementLog = (id: string) => {
    setSupplementLogs(supplementLogs.filter((log) => log.id !== id));
    toast({
      title: "Success",
      description: "Deleted supplement log",
    });
  };

  const addPR = (pr: Omit<PR, "id">) => {
    const newPR: PR = { id: uuidv4(), ...pr };
    setPRs([...prs, newPR]);
    toast({
      title: "Success",
      description: `Added PR for exercise ${pr.exerciseId}`,
    });
  };

  const updatePR = (pr: PR) => {
    setPRs(prs.map((p) => (p.id === pr.id ? { ...pr } : p)));
    toast({
      title: "Success",
      description: `Updated PR for exercise ${pr.exerciseId}`,
    });
  };

  const deletePR = (id: string) => {
    setPRs(prs.filter((pr) => pr.id !== id));
    toast({
      title: "Success",
      description: "Deleted PR",
    });
  };

  const addWorkoutDay = (workoutDay: Omit<WorkoutDay, "id">) => {
    const newWorkoutDay: WorkoutDay = { id: uuidv4(), ...workoutDay };
    setWorkoutDays([...workoutDays, newWorkoutDay]);
    toast({
      title: "Success",
      description: "Added workout day",
    });
  };

  const updateWorkoutDay = (workoutDay: WorkoutDay) => {
    setWorkoutDays(
      workoutDays.map((wd) => (wd.id === workoutDay.id ? { ...workoutDay } : wd))
    );
    toast({
      title: "Success",
      description: "Updated workout day",
    });
  };

  const deleteWorkoutDay = (id: string) => {
    setWorkoutDays(workoutDays.filter((workoutDay) => workoutDay.id !== id));
    toast({
      title: "Success",
      description: "Deleted workout day",
    });
  };

  const addWeeklyRoutine = (weeklyRoutine: Omit<WeeklyRoutine, "id">) => {
    const newWeeklyRoutine: WeeklyRoutine = { id: uuidv4(), ...weeklyRoutine };
    setWeeklyRoutines([...weeklyRoutines, newWeeklyRoutine]);
    toast({
      title: "Success",
      description: `Added weekly routine ${weeklyRoutine.name}`,
    });
  };

  const updateWeeklyRoutine = (weeklyRoutine: WeeklyRoutine) => {
    setWeeklyRoutines(
      weeklyRoutines.map((wr) =>
        wr.id === weeklyRoutine.id ? { ...weeklyRoutine } : wr
      )
    );
    toast({
      title: "Success",
      description: `Updated weekly routine ${weeklyRoutine.name}`,
    });
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(weeklyRoutines.filter((weeklyRoutine) => weeklyRoutine.id !== id));
    toast({
      title: "Success",
      description: "Deleted weekly routine",
    });
  };

  const addWorkoutTemplate = (workoutTemplate: Omit<WorkoutTemplate, "id">) => {
    const newWorkoutTemplate: WorkoutTemplate = {
      id: uuidv4(),
      ...workoutTemplate,
    };
    setWorkoutTemplates([...workoutTemplates, newWorkoutTemplate]);
    toast({
      title: "Success",
      description: `Added workout template ${workoutTemplate.name}`,
    });
  };

  const updateWorkoutTemplate = (workoutTemplate: WorkoutTemplate) => {
    setWorkoutTemplates(
      workoutTemplates.map((wt) =>
        wt.id === workoutTemplate.id ? { ...workoutTemplate } : wt
      )
    );
    toast({
      title: "Success",
      description: `Updated workout template ${workoutTemplate.name}`,
    });
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(
      workoutTemplates.filter((workoutTemplate) => workoutTemplate.id !== id)
    );
    // Remove template from any workout plans that include it
    setWorkoutPlans(workoutPlans.map(plan => ({
      ...plan,
      workoutTemplates: plan.workoutTemplates.filter(template => template.id !== id)
    })));
    toast({
      title: "Success",
      description: "Deleted workout template",
    });
  };

  const duplicateWorkoutTemplate = (id: string) => {
    const templateToDuplicate = workoutTemplates.find(t => t.id === id);
    if (templateToDuplicate) {
      const duplicatedTemplate: WorkoutTemplate = {
        ...templateToDuplicate,
        id: uuidv4(),
        name: `${templateToDuplicate.name} (Copy)`
      };
      setWorkoutTemplates([...workoutTemplates, duplicatedTemplate]);
      toast({
        title: "Success",
        description: `Duplicated workout template ${templateToDuplicate.name}`,
      });
    }
  };

  const addWorkoutPlan = (workoutPlan: Omit<WorkoutPlan, "id">) => {
    const newWorkoutPlan: WorkoutPlan = { id: uuidv4(), ...workoutPlan };
    setWorkoutPlans([...workoutPlans, newWorkoutPlan]);
    toast({
      title: "Success",
      description: `Added workout plan ${workoutPlan.name}`,
    });
  };

  const updateWorkoutPlan = (workoutPlan: WorkoutPlan) => {
    setWorkoutPlans(
      workoutPlans.map((wp) => (wp.id === workoutPlan.id ? { ...workoutPlan } : wp))
    );
    toast({
      title: "Success",
      description: `Updated workout plan ${workoutPlan.name}`,
    });
  };

  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans(workoutPlans.filter((workoutPlan) => workoutPlan.id !== id));
    toast({
      title: "Success",
      description: "Deleted workout plan",
    });
  };

  const addTemplateToPlan = (planId: string, templateId: string) => {
    setWorkoutPlans(
      workoutPlans.map((plan) => {
        if (plan.id === planId) {
          const templateToAdd = workoutTemplates.find(
            (template) => template.id === templateId
          );
          if (templateToAdd) {
            return {
              ...plan,
              workoutTemplates: [...(plan.workoutTemplates || []), templateToAdd],
            };
          }
        }
        return plan;
      })
    );
  };

  const removeTemplateFromPlan = (planId: string, templateId: string) => {
    setWorkoutPlans(
      workoutPlans.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            workoutTemplates: (plan.workoutTemplates || []).filter(
              (template) => template.id !== templateId
            ),
          };
        }
        return plan;
      })
    );
  };

  const setActivePlan = (planId: string | null) => {
    setActivePlanId(planId);
    setWorkoutPlans(
      workoutPlans.map((plan) => ({
        ...plan,
        isActive: plan.id === planId,
      }))
    );
  };

  const addReminder = (reminder: Omit<Reminder, "id">) => {
    const newReminder: Reminder = { id: uuidv4(), ...reminder };
    setReminders([...reminders, newReminder]);
    toast({
      title: "Success",
      description: "Added reminder",
    });
  };

  const updateReminder = (reminder: Reminder) => {
    setReminders(
      reminders.map((r) => (r.id === reminder.id ? { ...reminder } : r))
    );
    toast({
      title: "Success",
      description: "Updated reminder",
    });
  };

  const dismissReminder = (id: string) => {
    setReminders(
      reminders.map(reminder =>
        reminder.id === id ? { ...reminder, dismissed: true } : reminder
      )
    );
  };

  const markReminderAsSeen = (id: string) => {
    setReminders(
      reminders.map(reminder =>
        reminder.id === id ? { ...reminder, seen: true } : reminder
      )
    );
  };

  const addMoodLog = (moodLog: Omit<MoodLog, "id">) => {
    const newMoodLog: MoodLog = { id: uuidv4(), ...moodLog };
    setMoodLogs([...moodLogs, newMoodLog]);
    toast({
      title: "Success",
      description: "Added mood log",
    });
  };

  const updateMoodLog = (moodLog: MoodLog) => {
    setMoodLogs(
      moodLogs.map((ml) => (ml.id === moodLog.id ? { ...moodLog } : ml))
    );
    toast({
      title: "Success",
      description: "Updated mood log",
    });
  };

  const deleteMoodLog = (id: string) => {
    setMoodLogs(moodLogs.filter((moodLog) => moodLog.id !== id));
    toast({
      title: "Success",
      description: "Deleted mood log",
    });
  };

  const addTrainingBlock = (trainingBlock: Omit<TrainingBlock, "id">) => {
    const newTrainingBlock: TrainingBlock = { id: uuidv4(), ...trainingBlock };
    setTrainingBlocks([...trainingBlocks, newTrainingBlock]);
    toast({
      title: "Success",
      description: `Added training block ${trainingBlock.name}`,
    });
  };

  const updateTrainingBlock = (trainingBlock: TrainingBlock) => {
    setTrainingBlocks(
      trainingBlocks.map((tb) =>
        tb.id === trainingBlock.id ? { ...trainingBlock } : tb
      )
    );
    toast({
      title: "Success",
      description: `Updated training block ${trainingBlock.name}`,
    });
  };

  const deleteTrainingBlock = (id: string) => {
    setTrainingBlocks(trainingBlocks.filter((trainingBlock) => trainingBlock.id !== id));
    toast({
      title: "Success",
      description: "Deleted training block",
    });
  };

  const addWeakPoint = (weakPoint: Omit<WeakPoint
