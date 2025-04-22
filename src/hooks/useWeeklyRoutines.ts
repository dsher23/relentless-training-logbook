
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WeeklyRoutine, WeeklyRoutineEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useWeeklyRoutines = () => {
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);
  const { toast } = useToast();

  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    // Make sure the routine has the required structure
    const validatedRoutine: WeeklyRoutine = {
      id: routine.id || uuidv4(),
      name: routine.name || "Weekly Plan",
      workoutDays: routine.workoutDays || [],
      archived: routine.archived || false
    };
    
    setWeeklyRoutines([...weeklyRoutines, validatedRoutine]);
    toast({
      title: "Weekly routine created",
      description: `${validatedRoutine.name} has been created successfully.`
    });
  };

  const updateWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines(weeklyRoutines.map(r => r.id === routine.id ? routine : r));
    toast({
      title: "Weekly routine updated",
      description: `${routine.name} has been updated successfully.`
    });
  };

  const deleteWeeklyRoutine = (id: string) => {
    const routineToDelete = weeklyRoutines.find(r => r.id === id);
    if (routineToDelete) {
      setWeeklyRoutines(weeklyRoutines.filter(r => r.id !== id));
      toast({
        title: "Weekly routine deleted",
        description: `${routineToDelete.name} has been deleted successfully.`
      });
    }
  };

  const duplicateWeeklyRoutine = (id: string) => {
    const routineToDuplicate = weeklyRoutines.find(r => r.id === id);
    if (routineToDuplicate) {
      const newRoutine = {
        ...routineToDuplicate,
        id: uuidv4(),
        name: `${routineToDuplicate.name} (Copy)`,
      };
      setWeeklyRoutines([...weeklyRoutines, newRoutine]);
      toast({
        title: "Weekly routine duplicated",
        description: `${newRoutine.name} has been created.`
      });
    }
  };

  const archiveWeeklyRoutine = (id: string, archived: boolean) => {
    const routineToArchive = weeklyRoutines.find(r => r.id === id);
    if (routineToArchive) {
      setWeeklyRoutines(weeklyRoutines.map(r => 
        r.id === id ? { ...r, archived } : r
      ));
      toast({
        title: archived ? "Weekly routine archived" : "Weekly routine restored",
        description: `${routineToArchive.name} has been ${archived ? "archived" : "restored"}.`
      });
    }
  };
  
  const assignWorkoutToDay = (routineId: string, dayOfWeek: number, workoutTemplateId: string | null, workoutName: string = "") => {
    setWeeklyRoutines(weeklyRoutines.map(routine => {
      if (routine.id !== routineId) return routine;
      
      const existingDayIndex = routine.workoutDays.findIndex(day => day.dayOfWeek === dayOfWeek);
      let updatedDays = [...routine.workoutDays];
      
      if (existingDayIndex >= 0) {
        // Update existing day
        if (workoutTemplateId) {
          updatedDays[existingDayIndex] = {
            ...updatedDays[existingDayIndex],
            workoutTemplateId,
            workoutName
          };
        } else {
          // Remove the day if no workout selected (rest day)
          updatedDays = updatedDays.filter((_, index) => index !== existingDayIndex);
        }
      } else if (workoutTemplateId) {
        // Add new day
        updatedDays.push({
          id: uuidv4(),
          dayOfWeek,
          workoutTemplateId,
          workoutName
        });
      }
      
      const updatedRoutine = { ...routine, workoutDays: updatedDays };
      return updatedRoutine;
    }));
    
    toast({
      title: workoutTemplateId ? "Workout assigned" : "Rest day set",
      description: workoutTemplateId ? `Workout assigned to day ${dayOfWeek + 1}` : `Day ${dayOfWeek + 1} set as rest day`
    });
  };

  const removeWorkoutFromDay = (routineId: string, dayOfWeek: number) => {
    setWeeklyRoutines(weeklyRoutines.map(routine => {
      if (routine.id !== routineId) return routine;
      
      return {
        ...routine,
        workoutDays: routine.workoutDays.filter(day => day.dayOfWeek !== dayOfWeek)
      };
    }));
    
    toast({
      title: "Workout removed",
      description: `Workout removed from day ${dayOfWeek + 1}`
    });
  };

  return {
    weeklyRoutines,
    setWeeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    duplicateWeeklyRoutine,
    archiveWeeklyRoutine,
    assignWorkoutToDay,
    removeWorkoutFromDay
  };
};
