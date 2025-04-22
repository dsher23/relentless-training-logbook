
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, WorkoutTemplate, WorkoutPlan, Supplement, SupplementLog, SteroidCycle } from '@/types';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useWorkoutTemplates } from '@/hooks/useWorkoutTemplates';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { useSupplements } from '@/hooks/useSupplements';
import { useCompounds } from '@/hooks/useCompounds';
import { useReminders } from '@/hooks/useReminders';
import { Reminder } from '@/types';

export interface AppContextType {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  
  workoutTemplates: WorkoutTemplate[];
  setWorkoutTemplates: React.Dispatch<React.SetStateAction<WorkoutTemplate[]>>;
  addWorkoutTemplate: (workoutTemplate: WorkoutTemplate) => void;
  updateWorkoutTemplate: (workoutTemplate: WorkoutTemplate) => void;
  deleteWorkoutTemplate: (id: string) => void;
  
  workoutPlans: WorkoutPlan[];
  setWorkoutPlans: React.Dispatch<React.SetStateAction<WorkoutPlan[]>>;
  addWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  updateWorkoutPlan: (workoutPlan: WorkoutPlan) => void;
  deleteWorkoutPlan: (id: string) => void;
  
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
  
  compounds: any[];
  setCompounds: React.Dispatch<React.SetStateAction<any[]>>;
  addCompound: (compound: any) => void;
  updateCompound: (compound: any) => void;
  deleteCompound: (id: string) => void;
  getCompoundsByCycleId: (cycleId: string) => any[];

  // Reminders functionality
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  getDueReminders: () => Reminder[];
  markReminderAsSeen: (id: string) => void;
  dismissReminder: (id: string) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    workouts,
    setWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
  } = useWorkouts();
  
  const {
    workoutTemplates,
    setWorkoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
  } = useWorkoutTemplates();
  
  const {
    workoutPlans,
    setWorkoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
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

  // Add reminders hook
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

  useEffect(() => {
    // Load data from localStorage on component mount
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

    // Load reminders
    const storedReminders = localStorage.getItem('reminders');
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    }
  }, [setWorkouts, setWorkoutTemplates, setWorkoutPlans, setSupplements, setSupplementLogs, setSteroidCycles, setCompounds, setReminders]);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('workouts', JSON.stringify(workouts));
    localStorage.setItem('workoutTemplates', JSON.stringify(workoutTemplates));
    localStorage.setItem('workoutPlans', JSON.stringify(workoutPlans));
    localStorage.setItem('supplements', JSON.stringify(supplements));
    localStorage.setItem('supplementLogs', JSON.stringify(supplementLogs));
    localStorage.setItem('steroidCycles', JSON.stringify(steroidCycles));
    localStorage.setItem('compounds', JSON.stringify(compounds));
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [workouts, workoutTemplates, workoutPlans, supplements, supplementLogs, steroidCycles, compounds, reminders]);

  const value = {
    workouts,
    setWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    
    workoutTemplates,
    setWorkoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
    
    workoutPlans,
    setWorkoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    
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

    // Add reminders to context value
    reminders,
    setReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getDueReminders,
    markReminderAsSeen,
    dismissReminder,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
