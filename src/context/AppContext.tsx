import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

interface AppContextType {
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  duplicateWorkout: (id: string) => void;
  bodyMeasurements: BodyMeasurement[];
  addBodyMeasurement: (measurement: BodyMeasurement) => void;
  updateBodyMeasurement: (measurement: BodyMeasurement) => void;
  deleteBodyMeasurement: (id: string) => void;
  supplements: Supplement[];
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (supplement: Supplement) => void;
  deleteSupplement: (id: string) => void;
  supplementLogs: SupplementLog[];
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (log: SupplementLog) => void;
  deleteSupplementLog: (id: string) => void;
  moodLogs: MoodLog[];
  addMoodLog: (log: MoodLog) => void;
  updateMoodLog: (log: MoodLog) => void;
  deleteMoodLog: (id: string) => void;
  weakPoints: WeakPoint[];
  addWeakPoint: (weakPoint: WeakPoint) => void;
  updateWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  workoutTemplates: WorkoutTemplate[];
  addWorkoutTemplate: (template: WorkoutTemplate) => void;
  updateWorkoutTemplate: (template: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  duplicateWorkoutTemplate: (id: string) => void;
  weeklyRoutines: WeeklyRoutine[];
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (routine: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  duplicateWeeklyRoutine: (id: string) => void;
  archiveWeeklyRoutine: (id: string, archived: boolean) => void;
  trainingBlocks: TrainingBlock[];
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (block: TrainingBlock) => void;
  deleteTrainingBlock: (id: string) => void;
  checkTrainingBlockStatus: () => { needsUpdate: boolean; trainingBlock: TrainingBlock | undefined };
  getStagnantExercises: () => { workout: Workout; exercise: Exercise }[];
  toggleDeloadMode: (workoutId: string, isDeload: boolean) => void;
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  getDueReminders: () => Reminder[];
  markReminderAsSeen: (id: string) => void;
  dismissReminder: (id: string) => void;
  exportData: (type: "workouts" | "measurements" | "supplements") => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    localStorage.setItem('ironlog_workouts', JSON.stringify(workouts));
    localStorage.setItem('ironlog_bodyMeasurements', JSON.stringify(bodyMeasurements));
    localStorage.setItem('ironlog_supplements', JSON.stringify(supplements));
    localStorage.setItem('ironlog_supplementLogs', JSON.stringify(supplementLogs));
    localStorage.setItem('ironlog_moodLogs', JSON.stringify(moodLogs));
    localStorage.setItem('ironlog_weakPoints', JSON.stringify(weakPoints));
    localStorage.setItem('ironlog_workoutTemplates', JSON.stringify(workoutTemplates));
    localStorage.setItem('ironlog_weeklyRoutines', JSON.stringify(weeklyRoutines));
    localStorage.setItem('ironlog_trainingBlocks', JSON.stringify(trainingBlocks));
  }, [workouts, bodyMeasurements, supplements, supplementLogs, moodLogs, weakPoints, workoutTemplates, weeklyRoutines, trainingBlocks]);

  const loadInitialData = () => {
    try {
      const savedWorkouts = localStorage.getItem('ironlog_workouts');
      const savedBodyMeasurements = localStorage.getItem('ironlog_bodyMeasurements');
      const savedSupplements = localStorage.getItem('ironlog_supplements');
      const savedSupplementLogs = localStorage.getItem('ironlog_supplementLogs');
      const savedMoodLogs = localStorage.getItem('ironlog_moodLogs');
      const savedWeakPoints = localStorage.getItem('ironlog_weakPoints');
      const savedWorkoutTemplates = localStorage.getItem('ironlog_workoutTemplates');
      const savedWeeklyRoutines = localStorage.getItem('ironlog_weeklyRoutines');
      const savedTrainingBlocks = localStorage.getItem('ironlog_trainingBlocks');
      
      setWorkouts(savedWorkouts ? JSON.parse(savedWorkouts) : []);
      setBodyMeasurements(savedBodyMeasurements ? JSON.parse(savedBodyMeasurements) : []);
      setSupplements(savedSupplements ? JSON.parse(savedSupplements) : []);
      setSupplementLogs(savedSupplementLogs ? JSON.parse(savedSupplementLogs) : []);
      setMoodLogs(savedMoodLogs ? JSON.parse(savedMoodLogs) : []);
      setWeakPoints(savedWeakPoints ? JSON.parse(savedWeakPoints) : []);
      setWorkoutTemplates(savedWorkoutTemplates ? JSON.parse(savedWorkoutTemplates) : []);
      setWeeklyRoutines(savedWeeklyRoutines ? JSON.parse(savedWeeklyRoutines) : []);
      setTrainingBlocks(savedTrainingBlocks ? JSON.parse(savedTrainingBlocks) : []);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setWorkouts([]);
      setBodyMeasurements([]);
      setSupplements([]);
      setSupplementLogs([]);
      setMoodLogs([]);
      setWeakPoints([]);
      setWorkoutTemplates([]);
      setWeeklyRoutines([]);
      setTrainingBlocks([]);
    }
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout]);
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts(workouts.map(w => w.id === workout.id ? workout : w));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const duplicateWorkout = (id: string) => {
    const workoutToDuplicate = workouts.find(w => w.id === id);
    if (workoutToDuplicate) {
      const newWorkout = {
        ...workoutToDuplicate,
        id: uuidv4(),
        name: `${workoutToDuplicate.name} (Copy)`,
        date: new Date()
      };
      setWorkouts([...workouts, newWorkout]);
    }
  };

  const addBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements([...bodyMeasurements, measurement]);
  };

  const updateBodyMeasurement = (measurement: BodyMeasurement) => {
    setBodyMeasurements(bodyMeasurements.map(m => m.id === measurement.id ? measurement : m));
  };

  const deleteBodyMeasurement = (id: string) => {
    setBodyMeasurements(bodyMeasurements.filter(m => m.id !== id));
  };

  const addSupplement = (supplement: Supplement) => {
    setSupplements([...supplements, supplement]);
  };

  const updateSupplement = (supplement: Supplement) => {
    setSupplements(supplements.map(s => s.id === supplement.id ? supplement : s));
  };

  const deleteSupplement = (id: string) => {
    setSupplements(supplements.filter(s => s.id !== id));
  };

  const addSupplementLog = (log: SupplementLog) => {
    setSupplementLogs([...supplementLogs, log]);
  };

  const updateSupplementLog = (log: SupplementLog) => {
    setSupplementLogs(supplementLogs.map(s => s.id === log.id ? log : s));
  };

  const deleteSupplementLog = (id: string) => {
    setSupplementLogs(supplementLogs.filter(s => s.id !== id));
  };

  const addMoodLog = (log: MoodLog) => {
    setMoodLogs([...moodLogs, log]);
  };

  const updateMoodLog = (log: MoodLog) => {
    setMoodLogs(moodLogs.map(m => m.id === log.id ? log : m));
  };

  const deleteMoodLog = (id: string) => {
    setMoodLogs(moodLogs.filter(m => m.id !== id));
  };

  const addWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints([...weakPoints, weakPoint]);
  };

  const updateWeakPoint = (weakPoint: WeakPoint) => {
    setWeakPoints(weakPoints.map(wp => wp.id === weakPoint.id ? weakPoint : wp));
  };

  const deleteWeakPoint = (id: string) => {
    setWeakPoints(weakPoints.filter(wp => wp.id !== id));
  };

  const addWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates([...workoutTemplates, template]);
  };

  const updateWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates(workoutTemplates.map(wt => wt.id === template.id ? template : wt));
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(workoutTemplates.filter(wt => wt.id !== id));
  };

  const duplicateWorkoutTemplate = (id: string) => {
    const templateToDuplicate = workoutTemplates.find(t => t.id === id);
    if (templateToDuplicate) {
      const newTemplate = {
        ...templateToDuplicate,
        id: uuidv4(),
        name: `${templateToDuplicate.name} (Copy)`
      };
      setWorkoutTemplates([...workoutTemplates, newTemplate]);
    }
  };

  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines([...weeklyRoutines, routine]);
  };

  const updateWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines(weeklyRoutines.map(wr => wr.id === routine.id ? routine : wr));
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(weeklyRoutines.filter(wr => wr.id !== id));
  };

  const duplicateWeeklyRoutine = (id: string) => {
    const routineToDuplicate = weeklyRoutines.find(r => r.id === id);
    if (routineToDuplicate) {
      const newRoutine = {
        ...routineToDuplicate,
        id: uuidv4(),
        name: `${routineToDuplicate.name} (Copy)`,
        archived: false
      };
      setWeeklyRoutines([...weeklyRoutines, newRoutine]);
    }
  };

  const archiveWeeklyRoutine = (id: string, archived: boolean) => {
    setWeeklyRoutines(
      weeklyRoutines.map(routine => 
        routine.id === id ? { ...routine, archived } : routine
      )
    );
  };

  const addTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks([...trainingBlocks, block]);
  };

  const updateTrainingBlock = (block: TrainingBlock) => {
    setTrainingBlocks(trainingBlocks.map(tb => tb.id === block.id ? block : tb));
  };

  const deleteTrainingBlock = (id: string) => {
    setTrainingBlocks(trainingBlocks.filter(tb => tb.id !== id));
  };

  const checkTrainingBlockStatus = () => {
    const today = new Date();
    
    const currentTrainingBlock = trainingBlocks
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
    
    if (!currentTrainingBlock) {
      return { needsUpdate: false, trainingBlock: undefined };
    }
    
    const endDate = new Date(currentTrainingBlock.startDate);
    endDate.setDate(endDate.getDate() + currentTrainingBlock.durationWeeks * 7);
    
    const needsUpdate = today > endDate;
    
    return { needsUpdate, trainingBlock: currentTrainingBlock };
  };

  const getStagnantExercises = () => {
    const today = new Date();
    const threeSessionsAgo = new Date();
    
    const stagnant: { workout: Workout; exercise: Exercise }[] = [];
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const exerciseLogs = workouts
          .filter(w => w.exercises.find(e => e.id === exercise.id))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        
        if (exerciseLogs.length === 3) {
          const dates = exerciseLogs.map(w => new Date(w.date));
          const hasProgress = dates.every(date => date < threeSessionsAgo);
          
          if (hasProgress) {
            stagnant.push({ workout, exercise });
          }
        }
      });
    });
    
    return stagnant;
  };

  const toggleDeloadMode = (workoutId: string, isDeload: boolean) => {
    setWorkouts(workouts.map(w => 
      w.id === workoutId ? { ...w, isDeload } : w
    ));
  };

  const addReminder = (reminder: Reminder) => {
    setReminders([...reminders, reminder]);
  };

  const updateReminder = (reminder: Reminder) => {
    setReminders(reminders.map(r => r.id === reminder.id ? reminder : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getDueReminders = () => {
    const now = new Date();
    return reminders.filter(r => 
      new Date(r.dateTime) <= now && !r.dismissed
    );
  };

  const markReminderAsSeen = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, seen: true } : r
    ));
  };

  const dismissReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, dismissed: true } : r
    ));
  };

  const exportData = (type: "workouts" | "measurements" | "supplements") => {
    let data: any[] = [];
    let headers: string[] = [];
    
    if (type === "workouts") {
      headers = ["Date", "Workout", "Exercise", "Sets", "Reps", "Weight", "Notes", "Completed"];
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          exercise.sets.forEach((set, index) => {
            data.push({
              Date: new Date(workout.date).toLocaleDateString(),
              Workout: workout.name,
              Exercise: exercise.name,
              Sets: index + 1,
              Reps: set.reps,
              Weight: set.weight,
              Notes: workout.notes || "",
              Completed: workout.completed ? "Yes" : "No"
            });
          });
        });
      });
    } else if (type === "measurements") {
      headers = ["Date", "Weight", "Body Fat", "Muscle Mass", "Arms", "Chest", "Waist", "Legs", "Notes"];
      data = bodyMeasurements.map(m => ({
        Date: new Date(m.date).toLocaleDateString(),
        Weight: m.weight,
        "Body Fat": m.bodyFat || "",
        "Muscle Mass": m.muscleMass || "",
        Arms: m.arms || "",
        Chest: m.chest || "",
        Waist: m.waist || "",
        Legs: m.legs || "",
        Notes: m.notes || ""
      }));
    } else if (type === "supplements") {
      headers = ["Date", "Supplement", "Dosage", "Taken", "Time", "Notes"];
      supplementLogs.forEach(log => {
        const supplement = supplements.find(s => s.id === log.supplementId);
        if (supplement) {
          data.push({
            Date: new Date(log.date).toLocaleDateString(),
            Supplement: supplement.name,
            Dosage: log.dosageTaken,
            Taken: log.taken ? "Yes" : "No",
            Time: log.time ? new Date(log.time).toLocaleTimeString() : "",
            Notes: log.notes || ""
          });
        }
      });
    }
    
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header] || '';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  const value: AppContextType = {
    workouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    duplicateWorkout,
    bodyMeasurements,
    addBodyMeasurement,
    updateBodyMeasurement,
    deleteBodyMeasurement,
    supplements,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    supplementLogs,
    addSupplementLog,
    updateSupplementLog,
    deleteSupplementLog,
    moodLogs,
    addMoodLog,
    updateMoodLog,
    deleteMoodLog,
    weakPoints,
    addWeakPoint,
    updateWeakPoint,
    deleteWeakPoint,
    workoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
    duplicateWorkoutTemplate,
    weeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    duplicateWeeklyRoutine,
    archiveWeeklyRoutine,
    trainingBlocks,
    addTrainingBlock,
    updateTrainingBlock,
    deleteTrainingBlock,
    checkTrainingBlockStatus,
    getStagnantExercises,
    toggleDeloadMode,
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getDueReminders,
    markReminderAsSeen,
    dismissReminder,
    exportData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
