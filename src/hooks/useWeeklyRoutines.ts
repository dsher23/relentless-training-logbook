
import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { WeeklyRoutine, WorkoutDay } from '@/types';

export const useWeeklyRoutines = () => {
  const { weeklyRoutines, setWeeklyRoutines } = useAppContext();
  
  // Create a new weekly routine
  const createWeeklyRoutine = useCallback((name: string) => {
    const newRoutine: WeeklyRoutine = {
      id: uuidv4(),
      name,
      workouts: [],
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      workoutDays: [],
      days: {},
      archived: false
    };
    
    setWeeklyRoutines([...weeklyRoutines, newRoutine]);
    return newRoutine;
  }, [weeklyRoutines, setWeeklyRoutines]);
  
  // Update a weekly routine
  const updateWeeklyRoutine = useCallback((id: string, updatedData: Partial<WeeklyRoutine>) => {
    setWeeklyRoutines(
      weeklyRoutines.map(routine => 
        routine.id === id ? { ...routine, ...updatedData } : routine
      )
    );
  }, [weeklyRoutines, setWeeklyRoutines]);
  
  // Delete a weekly routine
  const deleteWeeklyRoutine = useCallback((id: string) => {
    setWeeklyRoutines(weeklyRoutines.filter(routine => routine.id !== id));
  }, [weeklyRoutines, setWeeklyRoutines]);
  
  // Archive a weekly routine
  const archiveWeeklyRoutine = useCallback((id: string) => {
    setWeeklyRoutines(
      weeklyRoutines.map(routine => 
        routine.id === id ? { ...routine, archived: true } : routine
      )
    );
  }, [weeklyRoutines, setWeeklyRoutines]);
  
  // Restore a weekly routine from archive
  const restoreWeeklyRoutine = useCallback((id: string) => {
    setWeeklyRoutines(
      weeklyRoutines.map(routine => 
        routine.id === id ? { ...routine, archived: false } : routine
      )
    );
  }, [weeklyRoutines, setWeeklyRoutines]);
  
  // Add a workout to a specific day
  const addWorkoutToDay = useCallback((routineId: string, dayOfWeek: number, workoutTemplateId: string) => {
    const routine = weeklyRoutines.find(r => r.id === routineId);
    if (!routine) return;
    
    // Check if day already has a workout assigned
    const existingDayIndex = routine.workoutDays.findIndex((d: WorkoutDay) => d.dayOfWeek === dayOfWeek);
    
    if (existingDayIndex >= 0) {
      // Update existing day
      const updatedWorkoutDays = [...routine.workoutDays];
      updatedWorkoutDays[existingDayIndex] = {
        ...updatedWorkoutDays[existingDayIndex],
        workoutTemplateId
      };
      
      updateWeeklyRoutine(routineId, { workoutDays: updatedWorkoutDays });
    } else {
      // Add new day
      const newWorkoutDay: WorkoutDay = {
        id: uuidv4(),
        dayOfWeek,
        workoutTemplateId
      };
      
      updateWeeklyRoutine(routineId, {
        workoutDays: [...routine.workoutDays, newWorkoutDay]
      });
    }
  }, [weeklyRoutines, updateWeeklyRoutine]);
  
  // Remove a workout from a specific day
  const removeWorkoutFromDay = useCallback((routineId: string, dayOfWeek: number) => {
    const routine = weeklyRoutines.find(r => r.id === routineId);
    if (!routine) return;
    
    const updatedWorkoutDays = routine.workoutDays.filter(
      (day: WorkoutDay) => day.dayOfWeek !== dayOfWeek
    );
    
    updateWeeklyRoutine(routineId, { workoutDays: updatedWorkoutDays });
  }, [weeklyRoutines, updateWeeklyRoutine]);
  
  return {
    weeklyRoutines,
    createWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    archiveWeeklyRoutine,
    restoreWeeklyRoutine,
    addWorkoutToDay,
    removeWorkoutFromDay
  };
};
