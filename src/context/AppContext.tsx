
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Set {
  id: string;
  reps: number;
  weight: number;
  isPersonalBest?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Sample data for demonstration
const sampleWorkouts: Workout[] = [
  {
    id: "1",
    name: "Push Day",
    date: new Date(2025, 3, 20),
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        sets: [
          { id: "s1", reps: 8, weight: 225, isPersonalBest: true },
          { id: "s2", reps: 8, weight: 225 },
          { id: "s3", reps: 6, weight: 225 }
        ],
        notes: "Felt strong today"
      },
      {
        id: "e2",
        name: "Overhead Press",
        sets: [
          { id: "s4", reps: 8, weight: 135 },
          { id: "s5", reps: 8, weight: 135 },
          { id: "s6", reps: 7, weight: 135 }
        ]
      }
    ],
    notes: "Great pump in shoulders",
    completed: true
  },
  {
    id: "2",
    name: "Pull Day",
    date: new Date(2025, 3, 21),
    exercises: [
      {
        id: "e3",
        name: "Deadlift",
        sets: [
          { id: "s7", reps: 5, weight: 315 },
          { id: "s8", reps: 5, weight: 315 },
          { id: "s9", reps: 4, weight: 315 }
        ]
      },
      {
        id: "e4",
        name: "Barbell Row",
        sets: [
          { id: "s10", reps: 10, weight: 185, isPersonalBest: true },
          { id: "s11", reps: 10, weight: 185 },
          { id: "s12", reps: 8, weight: 185 }
        ],
        notes: "Focus on form"
      }
    ],
    completed: true
  }
];

const sampleBodyMeasurements: BodyMeasurement[] = [
  {
    id: "1",
    date: new Date(2025, 3, 1),
    weight: 185,
    arms: 16,
    chest: 42,
    waist: 34,
    legs: 24,
    bodyFatPercentage: 15
  },
  {
    id: "2",
    date: new Date(2025, 3, 15),
    weight: 183,
    arms: 16.25,
    chest: 42.5,
    waist: 33.5,
    legs: 24.25,
    bodyFatPercentage: 14.5
  }
];

const sampleSupplements: Supplement[] = [
  {
    id: "1",
    name: "Creatine",
    dosage: "5g",
    schedule: {
      morning: true,
      afternoon: false,
      evening: false,
      workoutDays: true
    }
  },
  {
    id: "2",
    name: "Protein Powder",
    dosage: "25g",
    schedule: {
      morning: false,
      afternoon: false,
      evening: false,
      workoutDays: true
    },
    reminder: new Date()
  }
];

const sampleSupplementLogs: SupplementLog[] = [
  {
    id: "1",
    supplementId: "1",
    date: new Date(2025, 3, 21),
    taken: true,
    time: new Date(2025, 3, 21, 8, 0)
  },
  {
    id: "2",
    supplementId: "2",
    date: new Date(2025, 3, 21),
    taken: true,
    time: new Date(2025, 3, 21, 17, 30)
  }
];

const sampleMoodLogs: MoodLog[] = [
  {
    id: "1",
    date: new Date(2025, 3, 21),
    sleep: 7,
    energy: 8,
    mood: "good",
    notes: "Felt well-rested"
  },
  {
    id: "2",
    date: new Date(2025, 3, 20),
    sleep: 6,
    energy: 6,
    mood: "neutral",
    notes: "Slight fatigue in the afternoon"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(sampleBodyMeasurements);
  const [supplements, setSupplements] = useState<Supplement[]>(sampleSupplements);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>(sampleSupplementLogs);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(sampleMoodLogs);

  // Load data from localStorage on mount
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
  }, []);

  // Save data to localStorage on changes
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

  // Workout functions
  const addWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout]);
  };

  const updateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  // Body measurement functions
  const addBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements([...bodyMeasurements, measurement]);
  };

  const updateBodyMeasurement = (updatedMeasurement: BodyMeasurement) => {
    setBodyMeasurements(bodyMeasurements.map(m => m.id === updatedMeasurement.id ? updatedMeasurement : m));
  };

  const deleteBodyMeasurement = (id: string) => {
    setBodyMeasurements(bodyMeasurements.filter(m => m.id !== id));
  };

  // Supplement functions
  const addSupplement = (supplement: Supplement) => {
    setSupplements([...supplements, supplement]);
  };

  const updateSupplement = (updatedSupplement: Supplement) => {
    setSupplements(supplements.map(s => s.id === updatedSupplement.id ? updatedSupplement : s));
  };

  const deleteSupplement = (id: string) => {
    setSupplements(supplements.filter(s => s.id !== id));
  };

  // Supplement log functions
  const addSupplementLog = (log: SupplementLog) => {
    setSupplementLogs([...supplementLogs, log]);
  };

  const updateSupplementLog = (updatedLog: SupplementLog) => {
    setSupplementLogs(supplementLogs.map(l => l.id === updatedLog.id ? updatedLog : l));
  };

  const deleteSupplementLog = (id: string) => {
    setSupplementLogs(supplementLogs.filter(l => l.id !== id));
  };

  // Mood log functions
  const addMoodLog = (log: MoodLog) => {
    setMoodLogs([...moodLogs, log]);
  };

  const updateMoodLog = (updatedLog: MoodLog) => {
    setMoodLogs(moodLogs.map(l => l.id === updatedLog.id ? updatedLog : l));
  };

  const deleteMoodLog = (id: string) => {
    setMoodLogs(moodLogs.filter(l => l.id !== id));
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
        deleteMoodLog
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
