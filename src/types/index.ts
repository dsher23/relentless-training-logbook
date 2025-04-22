
export interface Exercise {
  id: string;
  name: string;
  sets: { reps: number; weight: number }[];
  lastProgressDate: Date;
  isWeakPoint: boolean;
}

export interface Workout {
  id: string;
  date: Date;
  name: string;
  exercises: Exercise[];
  notes?: string;
  completed?: boolean;
  isDeload?: boolean;
  scheduledTime?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  dayName?: string;
  exercises: Omit<Exercise, "sets">[];
  scheduledTime?: string;
}

export interface BodyMeasurement {
  id: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
  photoUrl?: string;
  arms?: number;
  chest?: number;
  waist?: number;
  legs?: number;
  bodyFatPercentage?: number;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  notes?: string;
  reminder?: Date;
  schedule?: {
    workoutDays?: boolean;
    times?: string[];
  };
}

export interface SupplementLog {
  id: string;
  date: Date;
  supplementId: string;
  dosageTaken: string;
  notes?: string;
  taken?: boolean;
  time?: Date;
}

export interface MoodLog {
  id: string;
  date: Date;
  mood: "terrible" | "bad" | "neutral" | "good" | "great";
  energyLevel: number;
  sleepQuality: number;
  notes?: string;
  sleep?: number;
  energy?: number;
}

export interface WeakPoint {
  id: string;
  muscleGroup: string;
  priority: number;
  sessionsPerWeekGoal: number;
}

export interface WorkoutDay {
  dayOfWeek: number;
  workoutTemplateId: string | null;
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  workoutDays: WorkoutDay[];
  archived?: boolean;
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: Date;
  durationWeeks: number;
  weeklyRoutineId: string;
  notes?: string;
  reminderEnabled?: boolean;
}

export interface Reminder {
  id: string;
  type: "supplement" | "workout" | "routineChange";
  referenceId: string;
  dateTime: Date;
  title: string;
  message: string;
  seen: boolean;
  dismissed: boolean;
}

export interface SteroidCycle {
  id: string;
  name: string;
  startWeek: number;
  totalWeeks: number;
  currentWeek?: number;
  isPrivate?: boolean;
  notes?: string;
  compounds: CycleCompound[];
}

export interface CycleCompound {
  id: string;
  name: string;
  dosagePerWeek: number;
  startWeek: number;
  endWeek: number;
  isOral: boolean;
  injectionDays?: number[];
  notes?: string;
}
