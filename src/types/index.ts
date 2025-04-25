export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises?: Exercise[];
  completed?: boolean;
  deloadMode?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  category: 'upper' | 'lower' | 'core' | 'other';
}

export interface Measurement {
  id: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  photos?: string[];
}

export interface Supplement {
  id: string;
  name: string;
  days: string[];
  reminderTime?: string;
  history: { date: Date; taken: boolean }[];
}

export interface Cycle {
  id: string;
  name: string;
  supplements: Supplement[];
  startDate: Date;
  endDate: Date;
  history: { date: Date; taken: boolean }[];
}

export interface AppContextType {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  measurements: Measurement[];
  setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  cycles: Cycle[];
  setCycles: React.Dispatch<React.SetStateAction<Cycle[]>>;
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  addWorkout: (name: string, exercises?: Exercise[]) => string;
  updateWorkout: (updated: Workout) => void;
  markWorkoutCompleted: (id: string) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  duplicateWorkout: (id: string) => void;
  toggleDeloadMode: (id: string) => void;
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (updated: Supplement) => void;
  deleteSupplement: (id: string) => void;
  addCycle: (cycle: Cycle) => void;
  updateCycle: (updated: Cycle) => void;
  deleteCycle: (id: string) => void;
  markSupplementTaken: (supplementId: string, date: Date, taken: boolean) => void;
  markCycleTaken: (cycleId: string, date: Date, taken: boolean) => void;
  addExercise: (exercise: Exercise) => void;
}
