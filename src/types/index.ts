export interface Workout {
  id: string;
  name: string;
  date: Date | string; // Allow string for parsing
  exercises?: Exercise[];
  completed?: boolean;
  deloadMode?: boolean;
  notes?: string;
  scheduledTime?: string;
}

export interface Set {
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[]; // Updated to array of Set objects
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
  legs?: number; // Added for MeasurementForm.tsx
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
  weeklyDosage?: number; // Added for AddCompoundForm.tsx
  dosageUnit?: string; // Added for AddCompoundForm.tsx
  duration?: number; // Added for AddCompoundForm.tsx
  notes?: string; // Added for AddCompoundForm.tsx
  cycleId?: string; // Added for AddCompoundForm.tsx
  active?: boolean; // Added for AddCompoundForm.tsx
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
  weight: number; // Added for CorePRTracker.tsx
  reps: number; // Added for CorePRTracker.tsx
  date: Date; // Added for CorePRTracker.tsx
}

export interface WeeklyRoutine {
  id: string;
  name: string;
  days: { [key: string]: WorkoutTemplate[] };
  workoutDays?: any[]; // Added for WeeklyPlanView.tsx
  archived?: boolean; // Added for WeeklyPlanView.tsx
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
  isFavorite?: boolean;
  scheduledTime?: string; // Added for WeeklyCalendarView.tsx
  dayName?: string; // Added for useWorkoutDays.ts
}

export interface WorkoutPlan {
  id: string;
  name: string;
  routines: WeeklyRoutine[];
  workoutTemplates?: WorkoutTemplate[]; // Added for WeeklyPlanView.tsx
  isActive?: boolean; // Added for WorkoutDetailsCard.tsx
  archived?: boolean; // Added for WorkoutPlanList.tsx
}

export interface Reminder {
  id: string;
  type: 'supplement' | 'workout';
  time: string;
  days: string[];
  dateTime?: Date; // Adde
