
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WeeklyRoutine, WorkoutDay } from '@/types';

export const useWeeklyRoutines = () => {
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);

  const addWeeklyRoutine = (routine: Omit<WeeklyRoutine, 'id'>) => {
    const newRoutine: WeeklyRoutine = {
      id: uuidv4(),
      name: routine.name,
      workoutDays: routine.workoutDays || [],
      days: routine.days || {},
      workouts: routine.workouts || [], // Required field
      startDate: routine.startDate || new Date().toISOString(), // Required field
      endDate: routine.endDate || new Date().toISOString(), // Required field
      archived: routine.archived || false
    };
    
    setWeeklyRoutines([...weeklyRoutines, newRoutine]);
  };

  const updateWeeklyRoutine = (id: string, updatedRoutine: Partial<WeeklyRoutine>) => {
    setWeeklyRoutines(weeklyRoutines.map(routine => {
      if (routine.id === id) {
        return { ...routine, ...updatedRoutine };
      }
      return routine;
    }));
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(weeklyRoutines.filter(routine => routine.id !== id));
  };

  const archiveWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(weeklyRoutines.map(routine => {
      if (routine.id === id) {
        return { ...routine, archived: true };
      }
      return routine;
    }));
  };

  const unarchiveWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(weeklyRoutines.map(routine => {
      if (routine.id === id) {
        return { ...routine, archived: false };
      }
      return routine;
    }));
  };

  const duplicateWeeklyRoutine = (id: string) => {
    const routineToDuplicate = weeklyRoutines.find(routine => routine.id === id);
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

  const addWorkoutToDay = (routineId: string, dayOfWeek: number, workoutTemplateId: string, workoutName: string) => {
    setWeeklyRoutines(weeklyRoutines.map(routine => {
      if (routine.id === routineId) {
        // Find if day already has a workout assigned
        const existingDayIndex = routine.workoutDays.findIndex(day => day.dayOfWeek === dayOfWeek);
        
        let updatedWorkoutDays;
        if (existingDayIndex >= 0) {
          // Update existing day
          updatedWorkoutDays = [...routine.workoutDays];
          updatedWorkoutDays[existingDayIndex] = {
            ...updatedWorkoutDays[existingDayIndex],
            workoutTemplateId,
            workoutName
          };
        } else {
          // Add new day
          const newWorkoutDay: WorkoutDay = {
            id: uuidv4(),
            dayOfWeek,
            workoutTemplateId,
            workoutName
          };
          updatedWorkoutDays = [...routine.workoutDays, newWorkoutDay];
        }
        
        return {
          ...routine,
          workoutDays: updatedWorkoutDays
        };
      }
      return routine;
    }));
  };

  const removeWorkoutFromDay = (routineId: string, dayOfWeek: number) => {
    setWeeklyRoutines(weeklyRoutines.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          workoutDays: routine.workoutDays.filter(day => day.dayOfWeek !== dayOfWeek)
        };
      }
      return routine;
    }));
  };

  return {
    weeklyRoutines,
    setWeeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    archiveWeeklyRoutine,
    unarchiveWeeklyRoutine,
    duplicateWeeklyRoutine,
    addWorkoutToDay,
    removeWorkoutFromDay
  };
};
