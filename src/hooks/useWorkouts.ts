import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, Exercise } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWorkouts = localStorage.getItem('workouts');
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (workouts.length > 0) {
      try {
        const sortedWorkouts = [...workouts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        const prunedWorkouts = sortedWorkouts.length > 50 
          ? sortedWorkouts.slice(0, 50) 
          : sortedWorkouts;
        
        if (workouts.length > 50) {
          setWorkouts(prunedWorkouts);
          toast({
            title: "Storage optimization",
            description: "Some older workout history has been archived to prevent storage issues.",
          });
        }

        localStorage.setItem('workouts', JSON.stringify(prunedWorkouts));
      } catch (error) {
        console.error('Error saving workouts to localStorage:', error);
        
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          const minWorkouts = workouts.slice(0, 25);
          try {
            localStorage.setItem('workouts', JSON.stringify(minWorkouts));
            setWorkouts(minWorkouts);
            toast({
              title: "Storage limit reached",
              description: "Your workout history has been trimmed to save space.",
              variant: "destructive",
            });
          } catch (innerError) {
            toast({
              title: "Storage error",
              description: "Unable to save workout data. Consider exporting your data and clearing some history.",
              variant: "destructive",
            });
          }
        }
      }
    }
  }, [workouts, toast]);

  const addWorkout = useCallback((workout: Workout) => {
    const newWorkout = {
      ...workout,
      id: workout.id || uuidv4()
    };
    setWorkouts(prev => [...prev, newWorkout]);
  }, []);

  const updateWorkout = useCallback((workout: Workout) => {
    setWorkouts(prev => prev.map(w => w.id === workout.id ? workout : w));
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }, []);

  const duplicateWorkout = useCallback((id: string) => {
    const workoutToDuplicate = workouts.find(w => w.id === id);
    if (workoutToDuplicate) {
      const newWorkout = {
        ...workoutToDuplicate,
        id: uuidv4(),
        name: `${workoutToDuplicate.name} (Copy)`,
        date: new Date()
      };
      setWorkouts(prev => [...prev, newWorkout]);
    }
  }, [workouts]);

  const toggleDeloadMode = useCallback((workoutId: string, isDeload: boolean) => {
    setWorkouts(prev => prev.map(w => 
      w.id === workoutId ? { ...w, isDeload } : w
    ));
  }, []);

  const getWorkoutById = useCallback((id: string): Workout => {
    return workouts.find(w => w.id === id) || {} as Workout;
  }, [workouts]);

  return {
    workouts,
    setWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    duplicateWorkout,
    toggleDeloadMode,
    getWorkoutById
  };
};
