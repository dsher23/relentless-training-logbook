export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises?: Exercise[];
  completed?: boolean;
  deloadMode?: boolean;
  notes?: string; // Added for WorkoutCard.tsx, WorkoutDetailsCard.tsx
  scheduledTime?: string; // Added for WeeklyCalendarView.tsx
}

export interface Exercise {
  id: string;
  name: string;
  sets: number; // Fixed to number for AddExerciseForm.tsx
  reps: number;
  weight?: number;
  category: 'upper' | 'lower' | 'core' | 'other';
  lastProgressDate?: Date; // Added for AddExerciseForm.tsx
  isWeakPoint?: boolean; // Added for ExercisesList.tsx
  restTime?: number; // Added for ExerciseDetailCard.tsx
  notes?: string; // Added for ExerciseDetailCard.tsx
  prExerciseType?: string; // Added for CorePRTracker.tsx
}

export interface Measurement {
  id: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  photos?: string[];
}

export interface BodyMeasurement extends Measurement {
  chest?: number;
  waist?: number;
  hips?: number;
  // Added for MeasurementForm.tsx
}

export interface Supplement {
  id: string;
  name: string;
  days: string[];
  reminderTime?: string;
  history: { date: Date; taken: boolean }[];
  dosage?: string; // Added for SupplementItem.tsx
  notes?: string; // Added for SupplementItem.tsx
  schedule?: string[]; // Added for SupplementItem.tsx
}

export interface Cycle {
  id: string;
  name: string;
  supplements: Supplement[];
  startDate: Date;
  endDate: Date;
  history: { date: Date; taken: boolean }[];
}

export interface SteroidCompound {
  id: string;
  name: string;
  dosage?: string;
  frequency?: string;
  // Added for AddCompoundForm.tsx
}

export interface SteroidCycle {
  id: string;
  name: string;
  compounds: SteroidCompound[];
  startDate: Date;
  endDate: Date;
  // Added for AppContext.tsx
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: Date;
  taken: boolean;
  // Added for AppContext.tsx
}

export interface PR {
  id: string;
  exerciseId: string;
  weight: number; // Added for CorePRTracker.tsx
  reps: number; // Added for CorePRTracker.tsx
  date: Date; // Added for CorePRTracker.tsx
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  days: { [key: string]: WorkoutTemplate[] };
  // Added for WeeklyPlanView.tsx
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  isFavorite?: boolean; // Added for WorkoutBuilder.tsx
}

export interface WorkoutPlan {
  id: string;
  name: string;
  routines: WeeklyRoutine[];
  // Added for WorkoutPlanList.tsx
}

export interface Reminder {
  id: string;
  type: 'supplement' | 'workout';
  time: string;
  days: string[];
  // Added for AppContext.tsx
}

export interface MoodLog {
  id: string;
  date: Date;
  mood: string;
  notes?: string;
  // Added for AppContext.tsx
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  routines: WeeklyRoutine[];
  // Added for AppContext.tsx
}

export interface WeakPoint {
  id: string;
  exerciseId: string;
  description: string;
  // Added for AppContext.tsx
}

export interface CycleCompound {
  id: string;
  steroidCompoundId: string;
  dosage: string;
  // Added for AppContext.tsx
}

export interface ProgressPhoto {
  id: string;
  date: Date;
  url: string;
  // Added for AppContext.tsx
}

export interface AppContextType {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  measurements: Measurement[];
  setMeasurements: React.Dispatch<React.SetStateAction<Measurement[]>>;
  bodyMeasurements: BodyMeasurement[];
  setBodyMeasurements: React.Dispatch<React.SetStateAction<BodyMeasurement[]>>;
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  supplementLogs: SupplementLog[];
  setSupplementLogs: React.Dispatch<React.SetStateAction<SupplementLog[]>>;
  cycles: Cycle[];
  setCycles: React.Dispatch<React.SetStateAction<Cycle[]>>;
  steroidCycles: SteroidCycle[];
  setSteroidCycles: React.Dispatch<React.SetStateAction<SteroidCycle[]>>;
  steroidCompounds: SteroidCompound[];
  setSteroidCompounds: React.Dispatch<React.SetStateAction<SteroidCompound[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  moodLogs: MoodLog[];
  setMoodLogs: React.Dispatch<React.SetStateAction<MoodLog[]>>;
  weeklyRoutines: WeeklyRoutine[];
  setWeeklyRoutines: React.Dispatch<React.SetStateAction<WeeklyRoutine[]>>;
  trainingBlocks: TrainingBlock[];
  setTrainingBlocks: React.Dispatch<React.SetStateAction<TrainingBlock[]>>;
  weakPoints: WeakPoint[];
  setWeakPoints: React.Dispatch<React.SetStateAction<WeakPoint[]>>;
  workoutTemplates: WorkoutTemplate[];
  setWorkoutTemplates: React.Dispatch<React.SetStateAction<WorkoutTemplate[]>>;
  workoutPlans: WorkoutPlan[];
  setWorkoutPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
  cycleCompounds: CycleCompound[];
  setCycleCompounds: React.Dispatch<React.SetStateAction<CycleCompound[]>>;
  progressPhotos: ProgressPhoto[];
  setProgressPhotos: React.Dispatch<React.SetStateAction<ProgressPhoto[]>>;
  addWorkout: (name: string, exercises?: Exercise[], additionalData?: Partial<Workout>) => string;
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
  addWorkoutTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutTemplate: (template: WorkoutTemplate) => void;
}
