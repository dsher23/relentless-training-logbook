export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
  isDeload?: boolean;
  scheduledTime?: string;
  isTemplate?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: { reps: number; weight: number }[];
  notes?: string;
  lastProgressDate: Date;
  isWeakPoint?: boolean;
  restTime?: number;
}

export interface BodyMeasurement {
  id: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  arms?: number;
  chest?: number;
  waist?: number;
  legs?: number;
  notes?: string;
  photoUrl?: string;
  unit?: 'metric' | 'imperial';
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  notes?: string;
  schedule?: {
    times: string[];
    workoutDays: boolean;
  };
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: Date;
  time?: Date;
  dosageTaken: string;
  taken: boolean;
  notes?: string;
}

export interface MoodLog {
  id: string;
  date: Date;
  mood: number;
  energyLevel: number;
  sleepQuality: number;
  stressLevel: number;
  notes?: string;
  sleep?: number;
  energy?: number;
}

export interface WeakPoint {
  id: string;
  name: string;
  description?: string;
  muscleGroup?: string;
  priority?: number;
  sessionsPerWeekGoal?: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  dayName?: string;
  exercises: Exercise[];
  isFavorite?: boolean;
  scheduledTime?: string;
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  workoutDays: WeeklyRoutineEntry[];
  archived: boolean;
}

export interface WeeklyRoutineEntry {
  id: string;
  dayOfWeek: number;
  workoutTemplateId: string | null;
  workoutName: string;
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: Date;
  durationWeeks: number;
  goal: string;
  notes?: string;
  weeklyRoutineId?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  seen: boolean;
  dismissed: boolean;
  type?: string;
  message?: string;
  dateTime?: Date;
  supplementId?: string;
  referenceId?: string;
}

export interface SteroidCycle {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  compounds: CycleCompound[];
  isPrivate?: boolean;
  currentWeek?: number;
  totalWeeks?: number;
  startWeek?: number;
}

export interface CycleCompound {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface SteroidCompound {
  id: string;
  cycleId: string;
  name: string;
  weeklyDosage: number;
  dosageUnit: string;
  frequency: string;
  duration?: number;
  notes?: string;
  active?: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  workoutTemplates: WorkoutTemplate[];
  isActive: boolean;
  archived: boolean;
}

export interface ProgressPhoto {
  id: string;
  date: Date;
  url: string;
  notes?: string;
  weight?: number;
  isPrivate: boolean;
  tags?: string[];
}
