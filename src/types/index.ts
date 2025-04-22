export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
  isDeload?: boolean;
  scheduledTime?: string;
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
  workoutDays: {
    dayOfWeek: number;
    workoutTemplateId: string | null;
  }[];
  archived: boolean;
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
}

export interface CycleCompound {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  workoutTemplates: WorkoutTemplate[];
  isActive: boolean;
}
