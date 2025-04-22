import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useSupplements } from '@/hooks/useSupplements';
import { useCycles } from '@/hooks/useCycles';
import { useReminders } from '@/hooks/useReminders';
import type { 
  Workout, Exercise, BodyMeasurement, Supplement, 
  SupplementLog, MoodLog, WeakPoint, WorkoutTemplate,
  WeeklyRoutine, TrainingBlock, Reminder, SteroidCycle,
  CycleCompound, WorkoutPlan
} from '@/types';
import { useBodyMeasurements } from '@/hooks/useBodyMeasurements';
import { useMoodLogs } from '@/hooks/useMoodLogs';
import { useWeakPoints } from '@/hooks/useWeakPoints';
import { useWorkoutTemplates } from '@/hooks/useWorkoutTemplates';
import { useWeeklyRoutines } from '@/hooks/useWeeklyRoutines';
import { useTrainingBlocks } from '@/hooks/useTrainingBlocks';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';

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
  steroidCycles: SteroidCycle[];
  addSteroidCycle: (cycle: SteroidCycle) => void;
  updateSteroidCycle: (cycle: SteroidCycle) => void;
  deleteSteroidCycle: (id: string) => void;
  duplicateSteroidCycle: (id: string) => void;
  workoutPlans: WorkoutPlan[];
  addWorkoutPlan: (plan: WorkoutPlan) => void;
  updateWorkoutPlan: (plan: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  duplicateWorkoutPlan: (id: string) => void;
  addTemplateToPlan: (planId: string, template: WorkoutTemplate) => void;
  removeTemplateFromPlan: (planId: string, templateId: string) => void;
  setActivePlan: (planId: string) => void;
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
  const workoutHooks = useWorkouts();
  const supplementHooks = useSupplements();
  const cycleHooks = useCycles();
  const reminderHooks = useReminders();
  const bodyMeasurementHooks = useBodyMeasurements();
  const moodLogHooks = useMoodLogs();
  const weakPointHooks = useWeakPoints();
  const workoutTemplateHooks = useWorkoutTemplates();
  const weeklyRoutineHooks = useWeeklyRoutines();
  const trainingBlockHooks = useTrainingBlocks();
  const workoutPlanHooks = useWorkoutPlans();
  
  const [stagnantExercises, setStagnantExercises] = useState<{ workout: Workout; exercise: Exercise }[]>([]);

  const exportData = (type: "workouts" | "measurements" | "supplements") => {
    let data: any[] = [];
    let headers: string[] = [];
    
    if (type === "workouts") {
      headers = ["Date", "Workout", "Exercise", "Sets", "Reps", "Weight", "Notes", "Completed"];
      workoutHooks.workouts.forEach(workout => {
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
      data = bodyMeasurementHooks.bodyMeasurements.map(m => ({
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
      supplementHooks.supplementLogs.forEach(log => {
        const supplement = supplementHooks.supplements.find(s => s.id === log.supplementId);
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

  const checkTrainingBlockStatus = () => {
    const today = new Date();
    
    const currentTrainingBlock = trainingBlockHooks.trainingBlocks
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
    
    workoutHooks.workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const exerciseLogs = workoutHooks.workouts
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
  
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [workoutHooks.workouts, supplementHooks.supplements, cycleHooks.steroidCycles, reminderHooks.reminders, bodyMeasurementHooks.bodyMeasurements, moodLogHooks.moodLogs, weakPointHooks.weakPoints, workoutTemplateHooks.workoutTemplates, weeklyRoutineHooks.weeklyRoutines, trainingBlockHooks.trainingBlocks, workoutPlanHooks.workoutPlans]);

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
      const savedSteroidCycles = localStorage.getItem('ironlog_steroidCycles');
      const savedWorkoutPlans = localStorage.getItem('ironlog_workoutPlans');
      
      workoutHooks.setWorkouts(savedWorkouts ? JSON.parse(savedWorkouts) : []);
      bodyMeasurementHooks.setBodyMeasurements(savedBodyMeasurements ? JSON.parse(savedBodyMeasurements) : []);
      supplementHooks.setSupplements(savedSupplements ? JSON.parse(savedSupplements) : []);
      supplementHooks.setSupplementLogs(savedSupplementLogs ? JSON.parse(savedSupplementLogs) : []);
      moodLogHooks.setMoodLogs(savedMoodLogs ? JSON.parse(savedMoodLogs) : []);
      weakPointHooks.setWeakPoints(savedWeakPoints ? JSON.parse(savedWeakPoints) : []);
      workoutTemplateHooks.setWorkoutTemplates(savedWorkoutTemplates ? JSON.parse(savedWorkoutTemplates) : []);
      weeklyRoutineHooks.setWeeklyRoutines(savedWeeklyRoutines ? JSON.parse(savedWeeklyRoutines) : []);
      trainingBlockHooks.setTrainingBlocks(savedTrainingBlocks ? JSON.parse(savedTrainingBlocks) : []);
      cycleHooks.setSteroidCycles(savedSteroidCycles ? JSON.parse(savedSteroidCycles) : []);
      workoutPlanHooks.setWorkoutPlans(savedWorkoutPlans ? JSON.parse(savedWorkoutPlans) : []);
    } catch (error) {
      console.error('Error loading initial data:', error);
      workoutHooks.setWorkouts([]);
      bodyMeasurementHooks.setBodyMeasurements([]);
      supplementHooks.setSupplements([]);
      supplementHooks.setSupplementLogs([]);
      moodLogHooks.setMoodLogs([]);
      weakPointHooks.setWeakPoints([]);
      workoutTemplateHooks.setWorkoutTemplates([]);
      weeklyRoutineHooks.setWeeklyRoutines([]);
      trainingBlockHooks.setTrainingBlocks([]);
      cycleHooks.setSteroidCycles([]);
      workoutPlanHooks.setWorkoutPlans([]);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('ironlog_workouts', JSON.stringify(workoutHooks.workouts));
    localStorage.setItem('ironlog_bodyMeasurements', JSON.stringify(bodyMeasurementHooks.bodyMeasurements));
    localStorage.setItem('ironlog_supplements', JSON.stringify(supplementHooks.supplements));
    localStorage.setItem('ironlog_supplementLogs', JSON.stringify(supplementHooks.supplementLogs));
    localStorage.setItem('ironlog_moodLogs', JSON.stringify(moodLogHooks.moodLogs));
    localStorage.setItem('ironlog_weakPoints', JSON.stringify(weakPointHooks.weakPoints));
    localStorage.setItem('ironlog_workoutTemplates', JSON.stringify(workoutTemplateHooks.workoutTemplates));
    localStorage.setItem('ironlog_weeklyRoutines', JSON.stringify(weeklyRoutineHooks.weeklyRoutines));
    localStorage.setItem('ironlog_trainingBlocks', JSON.stringify(trainingBlockHooks.trainingBlocks));
    localStorage.setItem('ironlog_steroidCycles', JSON.stringify(cycleHooks.steroidCycles));
    localStorage.setItem('ironlog_workoutPlans', JSON.stringify(workoutPlanHooks.workoutPlans));
  };

  const value: AppContextType = {
    ...workoutHooks,
    ...supplementHooks,
    ...cycleHooks,
    ...reminderHooks,
    ...bodyMeasurementHooks,
    ...moodLogHooks,
    ...weakPointHooks,
    ...workoutTemplateHooks,
    ...weeklyRoutineHooks,
    ...trainingBlockHooks,
    ...workoutPlanHooks,
    checkTrainingBlockStatus,
    getStagnantExercises,
    exportData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export type { 
  Workout, Exercise, BodyMeasurement, Supplement, 
  SupplementLog, MoodLog, WeakPoint, WorkoutTemplate,
  WeeklyRoutine, TrainingBlock, Reminder, SteroidCycle,
  CycleCompound, WorkoutPlan
};
