import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Workout, Exercise, BodyMeasurement, Supplement, 
  SupplementLog, SteroidCycle, Reminder, SteroidCompound,
  MoodLog, WeeklyRoutine, TrainingBlock, WeakPoint, 
  WorkoutTemplate, WorkoutPlan, CycleCompound, ProgressPhoto
} from '@/types';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useWorkoutTemplates } from '@/hooks/useWorkoutTemplates';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { useSupplements } from '@/hooks/useSupplements';
import { useCompounds } from '@/hooks/useCompounds';
import { useReminders } from '@/hooks/useReminders';
import { useBodyMeasurements } from '@/hooks/useBodyMeasurements';
import { useMoodLogs } from '@/hooks/useMoodLogs';
import { useWeakPoints } from '@/hooks/useWeakPoints';
import { useWeeklyRoutines } from '@/hooks/useWeeklyRoutines';
import { useTrainingBlocks } from '@/hooks/useTrainingBlocks';

export type { 
  Workout, Exercise, BodyMeasurement, Supplement, 
  SupplementLog, MoodLog, WeakPoint, WorkoutTemplate,
  WeeklyRoutine, TrainingBlock, Reminder, SteroidCycle,
  SteroidCompound, WorkoutPlan, CycleCompound, ProgressPhoto
} from '@/types';

export interface AppContextType {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutById: (id: string) => Workout;
  duplicateWorkout?: (id: string) => void;
  toggleDeloadMode?: (workoutId: string, isDeload: boolean) => void;
  
  workoutTemplates: WorkoutTemplate[];
  setWorkoutTemplates: React.Dispatch<React.SetStateAction<WorkoutTemplate[]>>;
  addWorkoutTemplate: (workoutTemplate: WorkoutTemplate) => void;
  updateWorkoutTemplate: (workoutTemplate: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  duplicateWorkoutTemplate?: (id: string) => void;
  
  workoutPlans: WorkoutPlan[];
  setWorkoutPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
  addWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  updateWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  duplicateWorkoutPlan?: (id: string) => void;
  setActivePlan?: (id: string) => void;
  addTemplateToPlan?: (planId: string, templateId: string) => void;
  removeTemplateFromPlan?: (planId: string, templateId: string) => void;
  
  supplements: Supplement[];
  setSupplements: React.Dispatch<React.SetStateAction<Supplement[]>>;
  supplementLogs: SupplementLog[];
  setSupplementLogs: React.Dispatch<React.SetStateAction<SupplementLog[]>>;
  addSupplement: (supplement: Supplement) => void;
  updateSupplement: (supplement: Supplement) => void;
  deleteSupplement: (id: string) => void;
  addSupplementLog: (log: SupplementLog) => void;
  updateSupplementLog: (log: SupplementLog) => void;
  deleteSupplementLog: (id: string) => void;

  steroidCycles: SteroidCycle[];
  setSteroidCycles: React.Dispatch<React.SetStateAction<SteroidCycle[]>>;
  addSteroidCycle: (cycle: SteroidCycle) => void;
  updateSteroidCycle: (cycle: SteroidCycle) => void;
  deleteSteroidCycle: (id: string) => void;
  
  compounds: SteroidCompound[];
  setCompounds: React.Dispatch<React.SetStateAction<SteroidCompound[]>>;
  addCompound: (compound: SteroidCompound) => void;
  updateCompound: (compound: SteroidCompound) => void;
  deleteCompound: (id: string) => void;
  getCompoundsByCycleId: (cycleId: string) => SteroidCompound[];

  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  getDueReminders: () => Reminder[];
  markReminderAsSeen: (id: string) => void;
  dismissReminder: (id: string) => void;

  bodyMeasurements: BodyMeasurement[];
  setBodyMeasurements: React.Dispatch<React.SetStateAction<BodyMeasurement[]>>;
  addBodyMeasurement: (measurement: BodyMeasurement) => void;
  updateBodyMeasurement: (measurement: BodyMeasurement) => void;
  deleteBodyMeasurement: (id: string) => void;
  getBodyMeasurementById?: (id: string) => BodyMeasurement;

  moodLogs: MoodLog[];
  setMoodLogs: React.Dispatch<React.SetStateAction<MoodLog[]>>;
  addMoodLog: (log: MoodLog) => void;
  updateMoodLog: (log: MoodLog) => void;
  deleteMoodLog: (id: string) => void;
  getMoodLogById?: (id: string) => MoodLog;

  weakPoints: WeakPoint[];
  setWeakPoints: React.Dispatch<React.SetStateAction<WeakPoint[]>>;
  addWeakPoint: (weakPoint: WeakPoint) => void;
  updateWeakPoint: (weakPoint: WeakPoint) => void;
  deleteWeakPoint: (id: string) => void;
  getWeakPointById?: (id: string) => WeakPoint;

  weeklyRoutines: WeeklyRoutine[];
  setWeeklyRoutines: React.Dispatch<React.SetStateAction<WeeklyRoutine[]>>;
  addWeeklyRoutine: (routine: WeeklyRoutine) => void;
  updateWeeklyRoutine: (routine: WeeklyRoutine) => void;
  deleteWeeklyRoutine: (id: string) => void;
  getWeeklyRoutineById?: (id: string) => WeeklyRoutine;
  duplicateWeeklyRoutine?: (id: string) => void;
  archiveWeeklyRoutine?: (id: string, archived: boolean) => void;

  trainingBlocks: TrainingBlock[];
  setTrainingBlocks: React.Dispatch<React.SetStateAction<TrainingBlock[]>>;
  addTrainingBlock: (block: TrainingBlock) => void;
  updateTrainingBlock: (block: TrainingBlock) => void;
  deleteTrainingBlock: (id: string) => void;
  getTrainingBlockById?: (id: string) => TrainingBlock;
  checkTrainingBlockStatus?: () => { needsUpdate: boolean; trainingBlock: TrainingBlock | null };

  progressPhotos: ProgressPhoto[];
  setProgressPhotos: React.Dispatch<React.SetStateAction<ProgressPhoto[]>>;
  addProgressPhoto: (photo: ProgressPhoto) => void;
  updateProgressPhoto: (photo: ProgressPhoto) => void;
  deleteProgressPhoto: (id: string) => void;

  exportData?: (type: string) => string;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    workouts,
    setWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
    duplicateWorkout,
    toggleDeloadMode
  } = useWorkouts();
  
  const {
    workoutTemplates,
    setWorkoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
    duplicateWorkoutTemplate = (id) => {
      const template = workoutTemplates.find(t => t.id === id);
      if (template) {
        const newTemplate = {
          ...template,
          id: uuidv4(),
          name: `${template.name} (Copy)`,
        };
        addWorkoutTemplate(newTemplate);
      }
    }
  } = useWorkoutTemplates();
  
  const {
    workoutPlans,
    setWorkoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    duplicateWorkoutPlan = (id) => {
      const plan = workoutPlans.find(p => p.id === id);
      if (plan) {
        const newPlan = {
          ...plan,
          id: uuidv4(),
          name: `${plan.name} (Copy)`,
          isActive: false
        };
        addWorkoutPlan(newPlan);
      }
    },
    setActivePlan = (id) => {
      workoutPlans.forEach(plan => {
        if (plan.id === id) {
          updateWorkoutPlan({ ...plan, isActive: true });
        } else if (plan.isActive) {
          updateWorkoutPlan({ ...plan, isActive: false });
        }
      });
    },
    addTemplateToPlan = (planId, templateId) => {
      const plan = workoutPlans.find(p => p.id === planId);
      const template = workoutTemplates.find(t => t.id === templateId);
      if (plan && template) {
        updateWorkoutPlan({
          ...plan,
          workoutTemplates: [...plan.workoutTemplates, template]
        });
      }
    },
    removeTemplateFromPlan = (planId, templateId) => {
      const plan = workoutPlans.find(p => p.id === planId);
      if (plan) {
        updateWorkoutPlan({
          ...plan,
          workoutTemplates: plan.workoutTemplates.filter(t => t.id !== templateId)
        });
      }
    }
  } = useWorkoutPlans();
  
  const {
    supplements,
    setSupplements,
    supplementLogs,
    setSupplementLogs,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    addSupplementLog,
    updateSupplementLog,
    deleteSupplementLog,
  } = useSupplements();
  
  const [steroidCycles, setSteroidCycles] = useState<SteroidCycle[]>([]);

  const addSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles([...steroidCycles, cycle]);
  };

  const updateSteroidCycle = (cycle: SteroidCycle) => {
    setSteroidCycles(steroidCycles.map(c => c.id === cycle.id ? cycle : c));
  };

  const deleteSteroidCycle = (id: string) => {
    setSteroidCycles(steroidCycles.filter(c => c.id !== id));
  };
  
  const { 
    compounds,
    setCompounds,
    addCompound,
    updateCompound,
    deleteCompound,
    getCompoundsByCycleId
  } = useCompounds();

  const {
    reminders,
    setReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getDueReminders,
    markReminderAsSeen,
    dismissReminder,
  } = useReminders();

  const {
    bodyMeasurements = [],
    setBodyMeasurements = () => {},
    addBodyMeasurement = () => {},
    updateBodyMeasurement = () => {},
    deleteBodyMeasurement = () => {},
    progressPhotos = [],
    setProgressPhotos = () => {},
    addProgressPhoto = () => {},
    updateProgressPhoto = () => {},
    deleteProgressPhoto = () => {},
    getBodyMeasurementById = (id) => bodyMeasurements.find(m => m.id === id) || {} as BodyMeasurement
  } = useBodyMeasurements ? useBodyMeasurements() : {} as any;

  const {
    moodLogs = [],
    setMoodLogs = () => {},
    addMoodLog = () => {},
    updateMoodLog = () => {},
    deleteMoodLog = () => {},
    getMoodLogById = (id) => moodLogs.find(m => m.id === id) || {} as MoodLog
  } = useMoodLogs ? useMoodLogs() : {} as any;

  const {
    weakPoints = [],
    setWeakPoints = () => {},
    addWeakPoint = () => {},
    updateWeakPoint = () => {},
    deleteWeakPoint = () => {},
    getWeakPointById = (id) => weakPoints.find(w => w.id === id) || {} as WeakPoint
  } = useWeakPoints ? useWeakPoints() : {} as any;

  const {
    weeklyRoutines = [],
    setWeeklyRoutines = () => {},
    addWeeklyRoutine = () => {},
    updateWeeklyRoutine = () => {},
    deleteWeeklyRoutine = () => {},
    getWeeklyRoutineById = (id) => weeklyRoutines.find(r => r.id === id) || {} as WeeklyRoutine,
    duplicateWeeklyRoutine = (id) => {
      const routine = weeklyRoutines.find(r => r.id === id);
      if (routine) {
        const newRoutine = {
          ...routine,
          id: uuidv4(),
          name: `${routine.name} (Copy)`,
        };
        addWeeklyRoutine(newRoutine);
      }
    },
    archiveWeeklyRoutine = (id, archived) => {
      const routine = weeklyRoutines.find(r => r.id === id);
      if (routine) {
        updateWeeklyRoutine({ ...routine, archived });
      }
    }
  } = useWeeklyRoutines ? useWeeklyRoutines() : {} as any;

  const {
    trainingBlocks = [],
    setTrainingBlocks = () => {},
    addTrainingBlock = () => {},
    updateTrainingBlock = () => {},
    deleteTrainingBlock = () => {},
    getTrainingBlockById = (id) => trainingBlocks.find(b => b.id === id) || {} as TrainingBlock,
    checkTrainingBlockStatus = () => ({ needsUpdate: false, trainingBlock: null })
  } = useTrainingBlocks ? useTrainingBlocks() : {} as any;

  const exportData = (type: string): string => {
    let csvData = '';
    switch (type) {
      case 'workouts':
        csvData = 'Date,Name,Exercises,Sets,Reps,Weight,Completed\n';
        workouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
            exercise.sets.forEach((set, index) => {
              csvData += `${new Date(workout.date).toISOString()},${workout.name},${exercise.name},${index + 1},${set.reps},${set.weight},${workout.completed}\n`;
            });
          });
        });
        break;
      case 'measurements':
        csvData = 'Date,Weight,BodyFat,MuscleMass,Arms,Chest,Waist,Legs,Notes\n';
        bodyMeasurements.forEach(m => {
          csvData += `${new Date(m.date).toISOString()},${m.weight},${m.bodyFat || ''},${m.muscleMass || ''},${m.arms || ''},${m.chest || ''},${m.waist || ''},${m.legs || ''},${m.notes || ''}\n`;
        });
        break;
      case 'supplements':
        csvData = 'Date,Supplement,Dosage,Taken,Notes\n';
        supplementLogs.forEach(log => {
          const supplement = supplements.find(s => s.id === log.supplementId);
          csvData += `${new Date(log.date).toISOString()},${supplement?.name || ''},${log.dosageTaken},${log.taken},${log.notes || ''}\n`;
        });
        break;
      case 'progressPhotos':
        csvData = 'Date,Photo\n';
        progressPhotos.forEach(photo => {
          csvData += `${new Date(photo.date).toISOString()},${photo.url}\n`;
        });
        break;
      default:
        csvData = 'No data to export';
    }
    return csvData;
  };

  useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    }
    
    const storedWorkoutTemplates = localStorage.getItem('workoutTemplates');
    if (storedWorkoutTemplates) {
      setWorkoutTemplates(JSON.parse(storedWorkoutTemplates));
    }
    
    const storedWorkoutPlans = localStorage.getItem('workoutPlans');
    if (storedWorkoutPlans) {
      setWorkoutPlans(JSON.parse(storedWorkoutPlans));
    }
    
    const storedSupplements = localStorage.getItem('supplements');
    if (storedSupplements) {
      setSupplements(JSON.parse(storedSupplements));
    }
    
    const storedSupplementLogs = localStorage.getItem('supplementLogs');
    if (storedSupplementLogs) {
      setSupplementLogs(JSON.parse(storedSupplementLogs));
    }
    
    const storedSteroidCycles = localStorage.getItem('steroidCycles');
    if (storedSteroidCycles) {
      setSteroidCycles(JSON.parse(storedSteroidCycles));
    }
    
    const storedCompounds = localStorage.getItem('compounds');
    if (storedCompounds) {
      setCompounds(JSON.parse(storedCompounds));
    }

    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    }
    
    const storedBodyMeasurements = localStorage.getItem('bodyMeasurements');
    if (storedBodyMeasurements && setBodyMeasurements) {
      setBodyMeasurements(JSON.parse(storedBodyMeasurements));
    }
    
    const storedMoodLogs = localStorage.getItem('moodLogs');
    if (storedMoodLogs && setMoodLogs) {
      setMoodLogs(JSON.parse(storedMoodLogs));
    }
    
    const storedWeakPoints = localStorage.getItem('weakPoints');
    if (storedWeakPoints && setWeakPoints) {
      setWeakPoints(JSON.parse(storedWeakPoints));
    }
    
    const storedWeeklyRoutines = localStorage.getItem('weeklyRoutines');
    if (storedWeeklyRoutines && setWeeklyRoutines) {
      setWeeklyRoutines(JSON.parse(storedWeeklyRoutines));
    }
    
    const storedTrainingBlocks = localStorage.getItem('trainingBlocks');
    if (storedTrainingBlocks && setTrainingBlocks) {
      setTrainingBlocks(JSON.parse(storedTrainingBlocks));
    }
    
    const storedProgressPhotos = localStorage.getItem('progressPhotos');
    if (storedProgressPhotos && setProgressPhotos) {
      setProgressPhotos(JSON.parse(storedProgressPhotos));
    }
  }, [
    setWorkouts, setWorkoutTemplates, setWorkoutPlans, 
    setSupplements, setSupplementLogs, setSteroidCycles, 
    setCompounds, setReminders, setBodyMeasurements,
    setMoodLogs, setWeakPoints, setWeeklyRoutines, setTrainingBlocks,
    setProgressPhotos
  ]);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
    localStorage.setItem('workoutTemplates', JSON.stringify(workoutTemplates));
    localStorage.setItem('workoutPlans', JSON.stringify(workoutPlans));
    localStorage.setItem('supplements', JSON.stringify(supplements));
    localStorage.setItem('supplementLogs', JSON.stringify(supplementLogs));
    localStorage.setItem('steroidCycles', JSON.stringify(steroidCycles));
    localStorage.setItem('compounds', JSON.stringify(compounds));
    localStorage.setItem('reminders', JSON.stringify(reminders));
    
    if (bodyMeasurements.length > 0) {
      localStorage.setItem('bodyMeasurements', JSON.stringify(bodyMeasurements));
    }
    
    if (moodLogs.length > 0) {
      localStorage.setItem('moodLogs', JSON.stringify(moodLogs));
    }
    
    if (weakPoints.length > 0) {
      localStorage.setItem('weakPoints', JSON.stringify(weakPoints));
    }
    
    if (weeklyRoutines.length > 0) {
      localStorage.setItem('weeklyRoutines', JSON.stringify(weeklyRoutines));
    }
    
    if (trainingBlocks.length > 0) {
      localStorage.setItem('trainingBlocks', JSON.stringify(trainingBlocks));
    }
    
    if (progressPhotos && progressPhotos.length > 0) {
      localStorage.setItem('progressPhotos', JSON.stringify(progressPhotos));
    }
  }, [
    workouts, workoutTemplates, workoutPlans, 
    supplements, supplementLogs, steroidCycles, 
    compounds, reminders, bodyMeasurements,
    moodLogs, weakPoints, weeklyRoutines, trainingBlocks,
    progressPhotos
  ]);

  const value = {
    workouts,
    setWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
    duplicateWorkout,
    toggleDeloadMode,
    
    workoutTemplates,
    setWorkoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
    duplicateWorkoutTemplate,
    
    workoutPlans,
    setWorkoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    duplicateWorkoutPlan,
    setActivePlan,
    addTemplateToPlan,
    removeTemplateFromPlan,
    
    supplements,
    setSupplements,
    supplementLogs,
    setSupplementLogs,
    addSupplement,
    updateSupplement,
    deleteSupplement,
    addSupplementLog,
    updateSupplementLog,
    deleteSupplementLog,

    steroidCycles,
    setSteroidCycles,
    addSteroidCycle,
    updateSteroidCycle,
    deleteSteroidCycle,
    
    compounds,
    setCompounds,
    addCompound,
    updateCompound,
    deleteCompound,
    getCompoundsByCycleId,

    reminders,
    setReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getDueReminders,
    markReminderAsSeen,
    dismissReminder,
    
    bodyMeasurements,
    setBodyMeasurements,
    addBodyMeasurement,
    updateBodyMeasurement,
    deleteBodyMeasurement,
    getBodyMeasurementById,
    
    moodLogs,
    setMoodLogs,
    addMoodLog,
    updateMoodLog,
    deleteMoodLog,
    getMoodLogById,
    
    weakPoints,
    setWeakPoints,
    addWeakPoint,
    updateWeakPoint,
    deleteWeakPoint,
    getWeakPointById,
    
    weeklyRoutines,
    setWeeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    getWeeklyRoutineById,
    duplicateWeeklyRoutine,
    archiveWeeklyRoutine,
    
    trainingBlocks,
    setTrainingBlocks,
    addTrainingBlock,
    updateTrainingBlock,
    deleteTrainingBlock,
    getTrainingBlockById,
    checkTrainingBlockStatus,
    
    progressPhotos,
    setProgressPhotos,
    addProgressPhoto,
    updateProgressPhoto,
    deleteProgressPhoto,
    
    exportData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
