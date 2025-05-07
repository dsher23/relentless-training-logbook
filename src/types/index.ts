export interface UserProfile {
  id?: string;
  displayName: string;
  email: string;
  createdAt: string;
  photoURL?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  darkMode?: boolean;
  notifications?: boolean;
  measurementSystem?: 'metric' | 'imperial';
}

export interface Exercise {
  id: string;
  name: string;
  category: 'upper' | 'lower' | 'core' | 'other';
  sets: Array<{
    reps: number;
    weight?: number;
    completed?: boolean;
  }>;
  reps: number;
  weight?: number;
  notes?: string;
  restTime?: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  duration?: number;
  notes?: string;
  completed: boolean;
  scheduledTime?: string;
  templateId?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  description?: string;
  scheduledTime?: string;
  estimatedDuration?: number;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
    calves?: number;
  };
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  url: string;
  type?: 'front' | 'back' | 'side' | 'other';
  notes?: string;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  energy: number;
  stress: number;
  sleep: number;
  notes?: string;
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  focus?: string;
  workouts?: Workout[];
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  dayOfWeek: number;
  workoutTemplateId: string;
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  workouts: Workout[];
  startDate: string;
  endDate: string;
  workoutDays: WorkoutDay[];
  days: {
    [key: string]: {
      workoutId?: string;
      completed?: boolean;
    };
  };
  archived: boolean;
}

export interface PRLift {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  date: string;
  notes?: string;
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  date: string;
  notes?: string;
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
  active: boolean;
}

export interface SteroidCycle {
  id: string;
  name: string;
  compounds: SteroidCompound[];
  startDate: string;
  endDate: string;
  isPrivate: boolean;
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  workoutTemplates?: WorkoutTemplate[];
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'reminder' | 'achievement' | 'system' | 'other';
}

export interface AppSettings {
  darkMode: boolean;
  measurementSystem: 'metric' | 'imperial';
  notifications: boolean;
  sound: boolean;
  language: string;
}
