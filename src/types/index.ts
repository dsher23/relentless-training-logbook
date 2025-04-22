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

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  workoutTemplates: WorkoutTemplate[];
  isActive: boolean;
}

export interface AppContextType {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout;

  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  getExerciseById: (id: string) => Exercise;

  bodyMeasurements: BodyMeasurement[];
  setBodyMeasurements: React.Dispatch<React.SetStateAction<BodyMeasurement[]>>;
  addBodyMeasurement: (measurement: BodyMeasurement) => void;
  updateBodyMeasurement: (measurement: BodyMeasurement) => void;
  deleteBodyMeasurement: (id: string) => void;
  getBodyMeasurementById: (id: string) => BodyMeasurement;

  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (supplement: Supplement) => void;
  deleteSupplement: (id: string) => void;
  getSupplementById: (id: string) => Supplement;

  supplementLogs: SupplementLog[];
  setSupplementLogs: React.Dispatch<React.SetStateAction<SupplementLog[]>>;
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (log: SupplementLog) => void;
  deleteSupplementLog: (id: string) => void;
  getSupplementLogById: (id: string) => SupplementLog;

  moodLogs: MoodLog[];
  setMoodLogs: React.Dispatch<React.SetStateAction<MoodLog[]>>;
  addMoodLog: (log: MoodLog) => void;
  updateMoodLog: (log: MoodLog) => void;
  deleteMoodLog: (id: string) => void;
  getMoodLogById: (id: string) => MoodLog;

  weakPoints: WeakPoint[];
  setWeakPoints: React.Dispatch<React.SetStateAction<WeakPoint[]>>;
  addWeakPoint: (weakPoint: WeakPoint) => void;
  updateWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  getWeakPointById: (id: string) => WeakPoint;

  workoutTemplates: WorkoutTemplate[];
  setWorkoutTemplates: React.Dispatch<React.SetStateAction<WorkoutTemplate[]>>;
  addWorkoutTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutTemplate: (template: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  getWorkoutTemplateById: (id: string) => WorkoutTemplate;

  weeklyRoutines: WeeklyRoutine[];
  setWeeklyRoutines: React.Dispatch<React.SetStateAction<WeeklyRoutine[]>>;
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (routine: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  getWeeklyRoutineById: (id: string) => WeeklyRoutine;

  trainingBlocks: TrainingBlock[];
  setTrainingBlocks: React.Dispatch<React.SetStateAction<TrainingBlock[]>>;
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (block: TrainingBlock) => void;
  deleteTrainingBlock: (id: string) => void;
  getTrainingBlockById: (id: string) => TrainingBlock;

  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  getReminderById: (id: string) => Reminder;

  steroidCycles: SteroidCycle[];
  setSteroidCycles: React.Dispatch<React.SetStateAction<SteroidCycle[]>>;
  addSteroidCycle: (cycle: SteroidCycle) => void;
  updateSteroidCycle: (cycle: SteroidCycle) => void;
  deleteSteroidCycle: (id: string) => void;
  getSteroidCycleById: (id: string) => SteroidCycle;

  compounds: SteroidCompound[];
  setCompounds: React.Dispatch<React.SetStateAction<SteroidCompound[]>>;
  addCompound: (compound: SteroidCompound) => void;
  updateCompound: (compound: SteroidCompound) => void;
  deleteCompound: (id: string) => void;
  getCompoundsByCycleId: (cycleId: string) => SteroidCompound[];
}
