export interface Workout {
  id: string;
  name: string;
  date: Date | string;
  exercises?: Exercise[];
  completed?: boolean;
  deloadMode?: boolean;
  notes?: string;
  scheduledTime?: string;
  isTemplate?: boolean; // Added for WeeklyRoutineBuilder and WorkoutDetailsCard
}

export interface Set {
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  reps: number;
  weight?: number;
  category: 'upper' | 'lower' | 'core' | 'other';
  lastProgressDate?: Date | string;
  isWeakPoint?: boolean;
  isPrRelevant?: boolean;
  restTime?: number;
  notes?: string;
  prExerciseType?: string;
  previousStats?: any;
}

export interface Measurement {
  id: string;
  date: Date | string;
  weight?: number;
  bodyFat?: number;
  photos?: string[];
}

export interface BodyMeasurement extends Measurement {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  legs?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  notes?: string;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  date: string;
  days?: string[];
  reminderTime?: string;
  history?: { date: Date | string; taken: boolean }[];
  schedule?: {
    times?: string[];
    workoutDays?: boolean;
  };
}

export interface Cycle {
  id: string;
  name: string;
  supplements: Supplement[];
  startDate: Date | string;
  endDate: Date | string;
  history: { date: Date | string; taken: boolean }[];
}

export interface SteroidCompound {
  id: string;
  name: string;
  description?: string;
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
  compound: string;
  dosage: string;
  startDate: string;
  endDate: string;
  name?: string;
  compounds?: SteroidCompound[];
  notes?: string;
  isPrivate?: boolean;
  currentWeek?: number;
  totalWeeks?: number;
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: Date | string;
  taken: boolean;
  time?: Date | string;
  dosageTaken?: string;
}

export interface PR {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  date: Date | string;
  workoutId?: string;
  isDirectEntry?: boolean;
}

export interface WorkoutDay {
  dayOfWeek: number;
  workoutTemplateId?: string;
  workoutName?: string;
  id?: string;
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  workouts: Workout[];
  startDate: string;
  endDate: string;
  archived: boolean;
  workoutDays: WorkoutDay[];
  days: { [key: string]: any };
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  isFavorite?: boolean;
  scheduledTime?: string;
  dayName?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  routines: WeeklyRoutine[];
  workoutTemplates: WorkoutTemplate[];
  active: boolean;
  archived: boolean;
  description?: string;
}

export interface Reminder {
  id: string;
  type: 'supplement' | 'workout' | 'routineChange';
  time: string;
  days: string[];
  dateTime?: Date | string;
  dueDate?: Date | string;
  dismissed?: boolean;
  supplementId?: string;
  seen: boolean;
  title?: string;
  message?: string;
}

export interface MoodLog {
  id: string;
  date: Date | string;
  mood: string | number;
  notes?: string;
  sleepQuality?: number;
  sleep?: number;
  energyLevel?: number;
  energy?: number;
  stressLevel?: number;
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: Date | string;
  endDate?: Date | string;
  routines?: WeeklyRoutine[];
  weeklyRoutineId?: string;
  durationWeeks?: number;
  goal?: string;
  notes?: string;
  workouts: Workout[];
}

export interface WeeklyRecoveryData {
  id: string;
  weekStartDate: string;
  sleepHours: number[];
  feeling: 'Energized' | 'Normal' | 'Tired' | 'Exhausted';
  generalFeeling?: 'Energized' | 'Normal' | 'Tired' | 'Exhausted';
  weekStart?: string;
  recoveryScore?: number;
}

export interface WeakPoint {
  id: string;
  muscleGroup: string;
  notes?: string;
  date: string;
  priority: string;
  sessionsPerWeekGoal: number;
  exerciseId?: string;
  description?: string;
  name?: string;
}

export interface CycleCompound {
  id: string;
  steroidCompoundId: string;
  dosage: string;
  name?: string;
}

export interface ProgressPhoto {
  id: string;
  date: Date | string;
  imageData: string;
  caption?: string;
  url?: string;
}

export interface UnitSystem {
  bodyWeightUnit: WeightUnit;
  bodyMeasurementUnit: MeasurementUnit;
  liftingWeightUnit: WeightUnit;
}

export type WeightUnit = 'kg' | 'lbs' | 'stone';
export type MeasurementUnit = 'cm' | 'in';

export interface PRLift {
  id: string;
  exercise: string;
  weight: number;
  date: string;
  reps: number;
  workoutId?: string;
  isDirectEntry: boolean;
}
