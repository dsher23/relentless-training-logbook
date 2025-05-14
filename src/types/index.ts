
// Base types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
}

export interface UserProfile {
  id?: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  createdAt?: string;
  bio?: string;
  height?: number;
  weight?: number;
  birthDate?: string;
  gender?: string;
  fitnessGoal?: string;
  experienceLevel?: string;
}

// Workout related types
export interface Exercise {
  id: string;
  name: string;
  category: 'upper' | 'lower' | 'core' | 'other';
  sets: Array<{
    reps: number;
    weight: number;
    completed?: boolean;
  }>;
  reps: number;
  weight?: number;
  restTime?: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  completed: boolean;
  date: string;
  duration?: number;
  notes?: string;
  totalVolume?: number;
  scheduledTime?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  notes?: string;
  isFavorite?: boolean;
  scheduledTime?: string;
  dayName?: string;
  active?: boolean;
}

export interface WorkoutDay {
  id: string;
  dayOfWeek: number;
  workoutTemplateId: string;
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  workouts: string[];
  startDate: string;
  endDate: string;
  workoutDays: WorkoutDay[];
  days: Record<string, string[]>;
  archived: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  level?: string;
  tags?: string[];
  createdAt?: string;
  workoutTemplates: WorkoutTemplate[];
}

export interface TrainingBlock {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
  notes?: string;
}

// Measurement related types
export interface BodyMeasurement {
  id: string;
  date: string;
  weight: number;
  chest?: number;
  waist?: number;
  arms?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  url: string;
  date: string;
  type?: string;
  notes?: string;
}

// PR related types
export interface PRLift {
  id: string;
  exercise: string;
  weight: number;
  reps: number;
  date: string;
  notes?: string;
}

// Mood related types
export interface MoodLog {
  id: string;
  date: string;
  mood: number;
  energy: number;
  stress?: number;
  sleep?: number;
  notes?: string;
}

// Supplement related types
export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  date: string;
  notes?: string;
}

// Steroid related types
export interface SteroidCompound {
  id: string;
  name: string;
  weeklyDosage: number;
  dosageUnit: string;
  frequency: string;
  duration?: number;
  notes?: string;
  cycleId?: string;
  active?: boolean;
}

export interface SteroidCycle {
  id: string;
  name: string;
  compounds: SteroidCompound[];
  startDate: string;
  endDate: string;
  isPrivate: boolean;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  read: boolean;
}
