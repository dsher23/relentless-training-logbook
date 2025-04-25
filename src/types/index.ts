
export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises?: Exercise[];
  completed?: boolean;
  deloadMode?: boolean;
  notes?: string;
  scheduledTime?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  category: 'upper' | 'lower' | 'core' | 'other';
  lastProgressDate?: Date;
  isWeakPoint?: boolean;
  restTime?: number;
  notes?: string;
  prExerciseType?: string;
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
  arms?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  notes?: string;
  photoData?: string;
}

export interface Supplement {
  id: string;
  name: string;
  days: string[];
  reminderTime?: string;
  history: { date: Date; taken: boolean }[];
  dosage?: string;
  notes?: string;
  schedule?: string[];
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
  weeklyDosage?: number;
  dosageUnit?: string;
  duration?: number;
  notes?: string;
  cycleId?: string;
  active?: boolean;
}

export interface SteroidCycle {
  id: string;
  name: string;
  compounds: SteroidCompound[];
  startDate: Date;
  endDate: Date;
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: Date;
  taken: boolean;
}

export interface PR {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  date: Date;
  workoutId?: string;
  isDirectEntry?: boolean;
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  days: { [key: string]: WorkoutTemplate[] };
  archived?: boolean;
  workoutDays?: any[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  isFavorite?: boolean;
  scheduledTime?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  routines: WeeklyRoutine[];
}

export interface Reminder {
  id: string;
  type: 'supplement' | 'workout';
  time: string;
  days: string[];
  seen?: boolean;
}

export interface MoodLog {
  id: string;
  date: Date;
  mood: string;
  notes?: string;
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  routines: WeeklyRoutine[];
  weeklyRoutineId?: string;
  durationWeeks?: number;
  goal?: string;
  notes?: string;
}

export interface WeakPoint {
  id: string;
  exerciseId: string;
  description: string;
  muscleGroup?: string;
  priority?: number;
  sessionsPerWeekGoal?: number;
}

export interface CycleCompound {
  id: string;
  steroidCompoundId: string;
  dosage: string;
}

export interface ProgressPhoto {
  id: string;
  date: Date;
  url: string;
}

export type WeightUnit = 'kg' | 'lbs' | 'stone';
export type MeasurementUnit = 'cm' | 'in';

export interface UnitSystem {
  bodyWeightUnit: WeightUnit;
  bodyMeasurementUnit: MeasurementUnit;
  liftingWeightUnit: WeightUnit;
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
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
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
  addSteroidCycle: (cycle: SteroidCycle) => void;
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (updated: SupplementLog) => void;
  addReminder: (reminder: Reminder) => void;
  dismissReminder: (id: string) => void;
  markReminderAsSeen: (id: string) => void;
  getDueReminders: () => Reminder[];
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (updated: TrainingBlock) => void;
  addWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  addMoodLog: (log: MoodLog) => void;
  updateMoodLog: (updated: MoodLog) => void;
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (updated: WeeklyRoutine) => void;
  unitSystem: UnitSystem;
  setUnitSystem: React.Dispatch<React.SetStateAction<UnitSystem>>;
  convertWeight: (weight: number, from: WeightUnit, to: WeightUnit) => number;
  getWeightUnitDisplay: (unit: WeightUnit) => string;
  exportData: () => any;
}
