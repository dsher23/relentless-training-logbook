
// Supplement types
export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  days?: string[];
  time?: string;
  notes?: string;
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: string;
  taken: boolean;
  notes?: string;
}

export interface SteroidCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  compounds: SteroidCompound[];
  notes?: string;
  isPrivate: boolean;
}

export interface SteroidCompound {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
  weeklyDosage?: string;
  dosageUnit?: string;
  duration?: string;
  cycleId?: string;
  active?: boolean;
}

// Form interfaces
export interface SupplementFormProps {
  supplementId?: string;
  onClose: () => void;
}

export interface CycleFormProps {
  cycleId?: string;
  onClose: () => void;
}

export interface MoodLog {
  id: string;
  date: string;
  time: string;
  mood: number;
  energy?: string;
  sleep?: number;
  notes?: string;
}

export interface Reminder {
  id: string;
  type: string;
  dueDate: string;
  time: string;
  days: string[];
  seen: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  templates: string[]; // IDs of workout templates
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  routines?: string[];
}

export interface ProgressPhoto {
  id: string;
  url: string;
  date: string;
  tags?: string[];
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  notes?: string;
}

export interface WeakPoint {
  id: string;
  muscleGroup: string;
  date: string;
  priority: string;
  sessionsPerWeekGoal: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: {
    reps: number;
    weight: number;
  }[];
  reps: number;
  weight: number;
  restTime?: number;
  notes?: string;
  isWeakPoint?: boolean;
  isPrRelevant?: boolean;
  prExerciseType?: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  completed: boolean;
  date: string;
  notes?: string;
  isTemplate?: boolean;
}

export interface WeeklyRecoveryData {
  id?: string;
  week: string;
  sleepAverage?: number;
  energyLevels?: string[];
  moodAverage?: number;
  notes?: string;
}

export interface PRLift {
  id: string;
  exercise: string;
  weight: number;
  date: string;
  reps: number;
  workoutId?: string;
  isDirectEntry?: boolean;
}

export interface UserProfile {
  displayName: string;
  email: string;
  createdAt: string;
  startWeight: number;
  currentWeight: number;
  goalWeight: number;
  bio: string;
  photoURL?: string;
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  workouts: string[];
  goals?: string;
  notes?: string;
  active?: boolean;
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  workouts: string[];
  startDate: string;
  endDate: string;
  workoutDays: string[];
  days: Record<string, string[]>;
  archived?: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises?: Exercise[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WeightUnit = 'kg' | 'lbs' | 'stone';
export type MeasurementUnit = 'cm' | 'in';

export interface UnitSystem {
  bodyWeightUnit: WeightUnit;
  bodyMeasurementUnit: MeasurementUnit;
  liftingWeightUnit: WeightUnit;
}
