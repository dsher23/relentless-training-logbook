export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
  isDeload?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: { reps: number; weight: number }[];
  notes?: string;
  lastProgressDate: Date;
  isWeakPoint?: boolean;
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
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  notes?: string;
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
}

export interface WeakPoint {
  id: string;
  name: string;
  description?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  dayName?: string;
  exercises: Exercise[];
  isFavorite?: boolean;
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
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  seen: boolean;
  dismissed: boolean;
}

export interface SteroidCycle {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  compounds: CycleCompound[];
}

export interface CycleCompound {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}
