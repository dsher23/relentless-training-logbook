export interface Workout {
  id: string;
  name: string;
  date: Date | string;
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
  sets: Set[];
  reps: number;
  weight?: number;
  category: 'upper' | 'lower' | 'core' | 'other';
  lastProgressDate?: Date;
  isWeakPoint?: boolean;
  isPrRelevant?: boolean;
  restTime?: number;
  notes?: string;
  prExerciseType?: string;
  previousStats?: any;
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
  legs?: number;
  forearms?: number;
  thighs?: number;
  calves?: number;
  notes?: string;
}

export interface Supplement {
  id: string;
  name: string;
  days: string[];
  reminderTime?: string;
  history: { date: Date; taken: boolean }[];
  dosage?: string;
  notes?: string;
  schedule?: {
    times?: string[];
    workoutDays?: boolean;
  };
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
  notes?: string;
  isPrivate?: boolean;
  currentWeek?: number;
  totalWeeks?: number;
}

export interface SupplementLog {
  id: string;
  supplementId: string;
  date: Date;
  taken: boolean;
  time?: Date;
  dosageTaken?: string;
}

export interface PR {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  date: Date | string;
  isDirectEntry?: boolean;
  workoutId?: string;
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
  days: { [key: string]: WorkoutTemplate[] };
  workoutDays: WorkoutDay[];
  archived?: boolean;
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
  workoutTemplates?: WorkoutTemplate[];
  isActive?: boolean;
  archived?: boolean;
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
  seen?: boolean;
  title?: string;
  message?: string;
}

export interface MoodLog {
  id: string;
  date: Date;
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
  startDate: Date;
  endDate?: Date;
  routines?: WeeklyRoutine[];
  weeklyRoutineId?: string;
  durationWeeks?: number;
  goal?: string;
  notes?: string;
}

export interface WeakPoint {
  id: string;
  exerciseId?: string;
  description?: string;
  muscleGroup?: string;
  priority?: number;
  sessionsPerWeekGoal?: number;
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
  date: Date;
  url: string;
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
  isDirectEntry?: boolean;
}

export type AppContextType = {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  addWorkout: (name: string, exercises?: Exercise[], additionalData?: Partial<Workout>) => string;
  updateWorkout: (updated: Workout) => void;
  markWorkoutCompleted: (id: string) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  duplicateWorkout: (id: string) => void;
  toggleDeloadMode: (id: string, isDeload: boolean) => void;
  
  exercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
  
  measurements: Measurement[];
  bodyMeasurements: BodyMeasurement[];
  
  supplements: Supplement[];
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (updated: Supplement) => void;
  deleteSupplement: (id: string) => void;
  
  cycles: Cycle[];
  addCycle: (cycle: Cycle) => void;
  updateCycle: (updated: Cycle) => void;
  deleteCycle: (id: string) => void;
  markSupplementTaken: (supplementId: string, date: Date, taken: boolean) => void;
  markCycleTaken: (cycleId: string, date: Date, taken: boolean) => void;
  
  steroidCycles: SteroidCycle[];
  steroidCompounds: SteroidCompound[];
  addSteroidCycle: (cycle: SteroidCycle) => void;
  addCompound: (compound: SteroidCompound) => void;
  updateCompound: (compound: SteroidCompound) => void;
  deleteCompound: (id: string) => void;
  
  cycleCompounds: CycleCompound[];
  
  supplementLogs: SupplementLog[];
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (updated: SupplementLog) => void;
  
  weeklyRoutines: WeeklyRoutine[];
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (updated: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  duplicateWeeklyRoutine: (id: string) => void;
  archiveWeeklyRoutine: (id: string, archived: boolean) => void;
  
  trainingBlocks: TrainingBlock[];
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (updated: TrainingBlock) => void;
  
  weakPoints: WeakPoint[];
  addWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  
  moodLogs: MoodLog[];
  addMoodLog: (moodLog: MoodLog) => void;
  updateMoodLog: (updated: MoodLog) => void;
  
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  markReminderAsSeen: (id: string) => void;
  dismissReminder: (id: string) => void;
  getDueReminders: () => Reminder[];
  
  workoutTemplates: WorkoutTemplate[];
  addWorkoutTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutTemplate: (updated: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  duplicateWorkoutTemplate: (id: string) => string | null;
  
  workoutPlans: WorkoutPlan[];
  addWorkoutPlan: (plan: WorkoutPlan) => void;
  updateWorkoutPlan: (updated: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  duplicateWorkoutPlan: (id: string) => void;
  setActivePlan: (id: string) => void;
  addTemplateToPlan: (planId: string, templateId: string, day: string) => void;
  removeTemplateFromPlan: (planId: string, templateId: string) => void;
  
  progressPhotos: ProgressPhoto[];
  
  unitSystem: UnitSystem;
  convertWeight: (weight: number, fromUnit?: WeightUnit, toUnit?: WeightUnit) => number;
  convertMeasurement: (value: number, fromUnit?: MeasurementUnit, toUnit?: MeasurementUnit) => number;
  getWeightUnitDisplay: () => WeightUnit;
  getMeasurementUnitDisplay: () => MeasurementUnit;
  updateUnitSystem: (update: Partial<UnitSystem>) => void;
  
  exportData: (type?: string) => string;
  
  addPRLift: (prData: Omit<PR, 'id'>) => void;
  updatePR: (prData: PR) => void;
  deletePR: (id: string) => void;
  prLifts: PR[];
};
