
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WeeklyRoutine } from '@/types';

export const useWeeklyRoutines = () => {
  const [weeklyRoutines, setWeeklyRoutines] = useState<WeeklyRoutine[]>([]);

  const addWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines([...weeklyRoutines, routine]);
  };

  const updateWeeklyRoutine = (routine: WeeklyRoutine) => {
    setWeeklyRoutines(weeklyRoutines.map(r => r.id === routine.id ? routine : r));
  };

  const deleteWeeklyRoutine = (id: string) => {
    setWeeklyRoutines(weeklyRoutines.filter(r => r.id !== id));
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
    }
  };

  const archiveWeeklyRoutine = (id: string, archived: boolean) => {
    setWeeklyRoutines(weeklyRoutines.map(r => 
      r.id === id ? { ...r, archived } : r
    ));
  };

  return {
    weeklyRoutines,
    setWeeklyRoutines,
    addWeeklyRoutine,
    updateWeeklyRoutine,
    deleteWeeklyRoutine,
    duplicateWeeklyRoutine,
    archiveWeeklyRoutine,
  };
};
