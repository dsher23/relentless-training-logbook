import React, { createContext, useContext, useState, useEffect } from "react";

export interface Set {
  id: string;
  reps: number;
  weight: number;
  isPersonalBest?: boolean;
  type?: "normal" | "warmup" | "dropset" | "superset";
  restTime?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
  lastProgressDate?: Date;
  isWeakPoint?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
  dayName?: string;
  isDeload?: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Omit<Exercise, "sets">[];
  dayName?: string;
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  workoutDays: {
    dayOfWeek: number;
    workoutTemplateId: string | null;
  }[];
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: Date;
  durationWeeks: number;
  weeklyRoutineId: string;
  notes: string;
}

export interface WeakPoint {
  id: string;
  muscleGroup: string;
  priority: number;
  sessionsPerWeekGoal: number;
}

export interface BodyMeasurement {
  id: string;
  date: Date;
  weight?: number;
  arms?: number;
  chest?: number;
  waist?: number;
  legs?: number;
  bodyFatPercentage?: number;
  photoUrl?: string;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  schedule: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    workoutDays: boolean;
  };
  reminder?: Date;
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: Date;
  taken: boolean;
  time?: Date;
}

export interface MoodLog {
  id: string;
  date: Date;
  sleep: number;
  energy: number;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  notes?: string;
}

export interface WeekNotes {
  id: string;
  weekStartDate: Date;
  notes: string;
}

interface AppContextType {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  
  bodyMeasurements: BodyMeasurement[];
  addBodyMeasurement: (measurement: BodyMeasurement) => void;
  updateBodyMeasurement: (measurement: BodyMeasurement) => void;
  deleteBodyMeasurement: (id: string) => void;
  
  supplements: Supplement[];
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (supplement: Supplement) => void;
  deleteSupplement: (id: string) => void;
  
  supplementLogs: SupplementLog[];
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (log: SupplementLog) => void;
  deleteSupplementLog: (id: string) => void;
  
  moodLogs: MoodLog[];
  addMoodLog: (log: MoodLog) => void;
  updateMoodLog: (log: MoodLog) => void;
  deleteMoodLog: (id: string) => void;

  workoutTemplates: WorkoutTemplate[];
  addWorkoutTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutTemplate: (template: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  
  weeklyRoutines: WeeklyRoutine[];
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (routine: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  
  trainingBlocks: TrainingBlock[];
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (block: TrainingBlock) => void;
  deleteTrainingBlock: (id: string) => void;
  
  weakPoints: WeakPoint[];
  addWeakPoint: (weakPoint: WeakPoint) => void;
  updateWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  
  weekNotes: WeekNotes[];
  addWeekNotes: (notes: WeekNotes) => void;
  updateWeekNotes: (notes: WeekNotes) => void;
  deleteWeekNotes: (id: string) => void;
  
  toggleDeloadMode: (workoutId: string, isDeload: boolean) => void;
  getStagnantExercises: () => { workout: Workout, exercise: Exercise }[];
  checkTrainingBlockStatus: () => { needsUpdate: boolean, trainingBlock: TrainingBlock | null };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

const sampleWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: "1",
    name: "Push Day Template",
    dayName: "Push",
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        lastProgressDate: new Date(2025, 3, 20),
        isWeakPoint: false
      },
      {
        id: "e2",
        name: "Shoulder Press",
        lastProgressDate: new Date(2025, 3, 20),
        isWeakPoint: false
      },
      {
        id: "e3",
        name: "Tricep Pushdown",
        lastProgressDate: new Date(2025, 3, 15),
        isWeakPoint: true
      }
    ]
  },
  {
    id: "2",
    name: "Pull Day Template",
    dayName: "Pull",
    exercises: [
      {
        id: "e4",
        name: "Deadlift",
        lastProgressDate: new Date(2025, 3, 21),
        isWeakPoint: false
      },
      {
        id: "e5",
        name: "Barbell Row",
        lastProgressDate: new Date(2025, 3, 14),
        isWeakPoint: false
      }
    ]
  }
];

const sampleWeeklyRoutines: WeeklyRoutine[] = [
  {
    id: "1",
    name: "PPL Split",
    workoutDays: [
      { dayOfWeek: 1, workoutTemplateId: "1" },
      { dayOfWeek: 3, workoutTemplateId: "2" },
      { dayOfWeek: 5, workoutTemplateId: null }
    ]
  }
];

const sampleTrainingBlocks: TrainingBlock[] = [
  {
    id: "1",
    name: "Strength Phase",
    startDate: new Date(2025, 3, 1),
    durationWeeks: 6,
    weeklyRoutineId: "1",
    notes: "Focus on progressive overload with lower rep ranges (3-6)"
  }
];

const sampleWeakPoints: WeakPoint[] = [
  {
    id: "1",
    muscleGroup: "Triceps",
    priority: 2,
    sessionsPerWeekGoal: 2
  },
  {
    id: "2", 
    muscleGroup: "Calves",
    priority: 3,
    sessionsPerWeekGoal: 3
  }
];

const sampleWeekNotes: WeekNotes[] = [
  {
    id: "1",
    weekStartDate: new Date(2025, 3, 20),
    notes: "Right knee feeling better. Focusing on mind-muscle connection with quads."
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(sampleBodyMeasurements);
  const [supplements, setSupplements] = useState<Supplement[]>(sampleSupplements);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>(sampleSupplementLogs);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(sampleMoodLogs);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(sampleWorkoutTemplates);
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>(sampleWeeklyRoutines);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>(sampleTrainingBlocks);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>(sampleWeakPoints);
  const [weekNotes, setWeekNotes] = useState<WeekNotes[]>(sampleWeekNotes);

  useEffect(() => {
    const loadedWorkouts = localStorage.getItem("workouts");
    if (loadedWorkouts) {
      setWorkouts(JSON.parse(loadedWorkouts));
    }

    const loadedBodyMeasurements = localStorage.getItem("bodyMeasurements");
    if (loadedBodyMeasurements) {
      setBodyMeasurements(JSON.parse(loadedBodyMeasurements));
    }

    const loadedSupplements = localStorage.getItem("supplements");
    if (loadedSupplements) {
      setSupplements(JSON.parse(loadedSupplements));
    }

    const loadedSupplementLogs = localStorage.getItem("supplementLogs");
    if (loadedSupplementLogs) {
      setSupplementLogs(JSON.parse(loadedSupplementLogs));
    }

    const loadedMoodLogs = localStorage.getItem("moodLogs");
    if (loadedMoodLogs) {
      setMoodLogs(JSON.parse(loadedMoodLogs));
    }

    const loadedWorkoutTemplates = localStorage.getItem("workoutTemplates");
    if (loadedWorkoutTemplates) {
      setWorkoutTemplates(JSON.parse(loadedWorkoutTemplates));
    }

    const loadedWeeklyRoutines = localStorage.getItem("weeklyRoutines");
    if (loadedWeeklyRoutines) {
      setWeeklyRoutines(JSON.parse(loadedWeeklyRoutines));
    }

    const loadedTrainingBlocks = localStorage.getItem("trainingBlocks");
    if (loadedTrainingBlocks) {
      setTrainingBlocks(JSON.parse(loadedTrainingBlocks));
    }

    const loadedWeakPoints = localStorage.getItem("weakPoints");
    if (loadedWeakPoints) {
      setWeakPoints(JSON.parse(loadedWeakPoints));
    }

    const loadedWeekNotes = localStorage.getItem("weekNotes");
    if (loadedWeekNotes) {
      setWeekNotes(JSON.parse(loadedWeekNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem("bodyMeasurements", JSON.stringify(bodyMeasurements));
  }, [bodyMeasurements]);

  useEffect(() => {
    localStorage.setItem("supplements", JSON.stringify(supplements));
  }, [supplements]);

  useEffect(() => {
    localStorage.setItem("supplementLogs", JSON.stringify(supplementLogs));
  }, [supplementLogs]);

  useEffect(() => {
    localStorage.setItem("moodLogs", JSON.stringify(moodLogs));
  }, [moodLogs]);

  useEffect(() => {
    localStorage.setItem("workoutTemplates", JSON.stringify(workoutTemplates));
  }, [workoutTemplates]);

  useEffect(() => {
    localStorage.setItem("weeklyRoutines", JSON.stringify(weeklyRoutines));
  }, [weeklyRoutines]);

  useEffect(() => {
    localStorage.setItem("trainingBlocks", JSON.stringify(trainingBlocks));
  }, [trainingBlocks]);

  useEffect(() => {
    localStorage.setItem("weakPoints", JSON.stringify(weakPoints));
  }, [weakPoints]);

  useEffect(() => {
    localStorage.setItem("weekNotes", JSON.stringify(weekNotes));
  }, [weekNotes]);

  const addWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout]);
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const addBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements([...bodyMeasurements, measurement]);
  };

  const updateBodyMeasurement = (updatedMeasurement: BodyMeasurement) => {
    setBodyMeasurements(bodyMeasurements.map(m => m.id === updatedMeasurement.id ? updatedMeasurement : m));
  };

  const deleteBodyMeasurement = (id: string) => {
    setBodyMeasurements(bodyMeasurements.filter(m => m.id !== id));
  };

  const addSupplement = (supplement: Supplement) => {
    setSupplements([...supplements, supplement]);
  };

  const updateSupplement = (updatedSupplement: Supplement) => {
    setSupplements(supplements.map(s => s.id === updatedSupplement.id ? updatedSupplement : s));
  };

  const deleteSupplement = (id: string) => {
    setSupplements(supplements.filter(s => s.id !== id));
  };

  const addSupplementLog = (log: SupplementLog) => {
    setSupplementLogs([...supplementLogs, log]);
  };

  const updateSupplementLog = (updatedLog: SupplementLog) => {
    setSupplementLogs(supplementLogs.map(l => l.id === updatedLog.id ? updatedLog : l));
  };

  const deleteSupplementLog = (id: string) => {
    setSupplementLogs(supplementLogs.filter(l => l.id !== id));
  };

  const addMoodLog = (log: MoodLog) => {
    setMoodLogs([...moodLogs, log]);
  };

  const updateMoodLog = (updatedLog: MoodLog) => {
    setMoodLogs(moodLogs.map(l => l.id === updatedLog.id ? updatedLog : l));
  };

  const deleteMoodLog = (id: string) => {
    setMoodLogs(moodLogs.filter(l => l.id !== id));
  };

  const addWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates([...workoutTemplates, template]);
  };

  const updateWorkoutTemplate = (updatedTemplate: WorkoutTemplate) => {
    setWorkoutTemplates(workoutTemplates.map(t => 
      t.id === updatedTemplate.id ? updatedTemplate : t
    ));
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(workoutTemplates.filter(t => t.id !== id));
  };

  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines([...weeklyRoutines, routine]);
  };

  const updateWeeklyRoutine = (updatedRoutine: WeeklyRoutine) => {
    setWeeklyRoutines(weeklyRoutines.map(r => 
      r.id === updatedRoutine.id ? updatedRoutine : r
    ));
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(weeklyRoutines.filter(r => r.id !== id));
  };

  const addTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks([...trainingBlocks, block]);
  };

  const updateTrainingBlock = (updatedBlock: TrainingBlock) => {
    setTrainingBlocks(trainingBlocks.map(b => 
      b.id === updatedBlock.id ? updatedBlock : b
    ));
  };

  const deleteTrainingBlock = (id: string) => {
    setTrainingBlocks(trainingBlocks.filter(b => b.id !== id));
  };

  const addWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints([...weakPoints, weakPoint]);
  };

  const updateWeakPoint = (updatedWeakPoint: WeakPoint) => {
    setWeakPoints(weakPoints.map(wp => 
      wp.id === updatedWeakPoint.id ? updatedWeakPoint : wp
    ));
  };

  const deleteWeakPoint = (id: string) => {
    setWeakPoints(weakPoints.filter(wp => wp.id !== id));
  };

  const addWeekNotes = (notes: WeekNotes) => {
    setWeekNotes([...weekNotes, notes]);
  };

  const updateWeekNotes = (updatedNotes: WeekNotes) => {
    setWeekNotes(weekNotes.map(n => 
      n.id === updatedNotes.id ? updatedNotes : n
    ));
  };

  const deleteWeekNotes = (id: string) => {
    setWeekNotes(weekNotes.filter(n => n.id !== id));
  };

  const toggleDeloadMode = (workoutId: string, isDeload: boolean) => {
    setWorkouts(workouts.map(workout => 
      workout.id === workoutId ? { ...workout, isDeload } : workout
    ));
  };

  const getStagnantExercises = () => {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
    
    const results: { workout: Workout, exercise: Exercise }[] = [];
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.lastProgressDate && exercise.lastProgressDate < threeWeeksAgo) {
          results.push({ workout, exercise });
        }
      });
    });
    
    return results;
  };

  const checkTrainingBlockStatus = () => {
    const today = new Date();
    
    for (const block of trainingBlocks) {
      const endDate = new Date(block.startDate);
      endDate.setDate(endDate.getDate() + (block.durationWeeks * 7));
      
      if (today >= endDate) {
        return { needsUpdate: true, trainingBlock: block };
      }
    }
    
    return { needsUpdate: false, trainingBlock: null };
  };

  return (
    <AppContext.Provider
      value={{
        workouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        bodyMeasurements,
        addBodyMeasurement,
        updateBodyMeasurement,
        deleteBodyMeasurement,
        supplements,
        addSupplement,
        updateSupplement,
        deleteSupplement,
        supplementLogs,
        addSupplementLog,
        updateSupplementLog,
        deleteSupplementLog,
        moodLogs,
        addMoodLog,
        updateMoodLog,
        deleteMoodLog,
        workoutTemplates,
        addWorkoutTemplate,
        updateWorkoutTemplate,
        deleteWorkoutTemplate,
        weeklyRoutines,
        addWeeklyRoutine,
        updateWeeklyRoutine,
        deleteWeeklyRoutine,
        trainingBlocks,
        addTrainingBlock,
        updateTrainingBlock,
        deleteTrainingBlock,
        weakPoints,
        addWeakPoint,
        updateWeakPoint,
        deleteWeakPoint,
        weekNotes,
        addWeekNotes,
        updateWeekNotes,
        deleteWeekNotes,
        toggleDeloadMode,
        getStagnantExercises,
        checkTrainingBlockStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
