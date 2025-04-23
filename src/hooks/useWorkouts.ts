
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
        const parsedWorkouts = JSON.parse(storedWorkouts);
        
        // Ensure all workouts have proper date objects and required fields
        const validatedWorkouts = parsedWorkouts.map((w: any) => ({
          ...w,
          id: w.id || uuidv4(),
          date: w.date ? new Date(w.date) : new Date(),  // Ensure dates are properly parsed
          completed: typeof w.completed === 'boolean' ? w.completed : false,
          notes: w.notes || '',
          exercises: Array.isArray(w.exercises) ? w.exercises.map((ex: any) => ({
            ...ex,
            id: ex.id || uuidv4(),
            sets: Array.isArray(ex.sets) ? ex.sets : [],
            notes: ex.notes || ''
          })) : []
        }));
        
        setWorkouts(validatedWorkouts);
        console.log("Loaded workouts from localStorage:", validatedWorkouts.length);
        console.log("Completed workouts:", validatedWorkouts.filter((w: any) => w.completed === true).length);
      }
    } catch (error) {
      console.error('Error loading workouts from localStorage:', error);
      
      // Try to recover from corrupt data
      try {
        localStorage.removeItem('workouts');
        toast({
          title: "Data Recovery",
          description: "Had to reset workout data due to corruption. Starting fresh.",
          variant: "destructive",
        });
      } catch (innerError) {
        console.error('Error removing corrupted workouts data:', innerError);
      }
    }
  }, [toast]);

  useEffect(() => {
    if (workouts.length > 0) {
      try {
        // Preserve completed status during sorting and storing
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
        console.log('Saved workouts to localStorage:', prunedWorkouts.length);
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

  const addWorkout = useCallback((workout: Workout): Workout => {
    try {
      // Ensure workout has all required fields
      const newWorkout = {
        ...workout,
        id: workout.id || uuidv4(),
        date: workout.date || new Date(),
        completed: typeof workout.completed === 'boolean' ? workout.completed : false,
        notes: workout.notes || '',
        exercises: Array.isArray(workout.exercises) ? workout.exercises.map(ex => ({
          ...ex,
          id: ex.id || uuidv4(),
          sets: Array.isArray(ex.sets) ? ex.sets : [],
          notes: ex.notes || ''
        })) : []
      };
      
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout; // Return the created workout for further use
    } catch (error) {
      console.error('Error adding workout:', error);
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
      
      // Return a minimal valid workout object to prevent crashes
      return {
        id: uuidv4(),
        name: 'Error Workout',
        date: new Date(),
        completed: false,
        exercises: [],
        notes: ''
      };
    }
  }, [toast]);

  const updateWorkout = useCallback((workout: Workout): Workout => {
    try {
      // Ensure workout has all required fields and explicitly parse the completed status
      const updatedWorkout = {
        ...workout,
        id: workout.id || uuidv4(),
        date: workout.date || new Date(),
        completed: workout.completed === true, // Ensure boolean conversion
        notes: workout.notes || '',
        exercises: Array.isArray(workout.exercises) ? workout.exercises.map(ex => ({
          ...ex,
          id: ex.id || uuidv4(),
          sets: Array.isArray(ex.sets) ? ex.sets : [],
          notes: ex.notes || ''
        })) : []
      };
      
      console.log('Updating workout with completed status:', updatedWorkout.id, updatedWorkout.completed);
      
      setWorkouts(prev => {
        const exists = prev.some(w => w.id === updatedWorkout.id);
        if (exists) {
          return prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w);
        } else {
          return [...prev, updatedWorkout];
        }
      });
      
      return updatedWorkout; // Return the updated workout for further use
    } catch (error) {
      console.error('Error updating workout:', error);
      toast({
        title: "Error",
        description: "Failed to update workout. Please try again.",
        variant: "destructive",
      });
      
      // Return the original workout to prevent crashes
      return workout;
    }
  }, [toast]);

  const deleteWorkout = useCallback((id: string) => {
    try {
      setWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const duplicateWorkout = useCallback((id: string) => {
    try {
      const workoutToDuplicate = workouts.find(w => w.id === id);
      if (workoutToDuplicate) {
        const newWorkout = {
          ...workoutToDuplicate,
          id: uuidv4(),
          name: `${workoutToDuplicate.name} (Copy)`,
          date: new Date(),
          completed: false // Reset completion status for duplicated workouts
        };
        setWorkouts(prev => [...prev, newWorkout]);
        return newWorkout; // Return the duplicated workout
      }
    } catch (error) {
      console.error('Error duplicating workout:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate workout. Please try again.",
        variant: "destructive",
      });
    }
    return null;
  }, [workouts, toast]);

  const toggleDeloadMode = useCallback((workoutId: string, isDeload: boolean) => {
    try {
      setWorkouts(prev => prev.map(w => 
        w.id === workoutId ? { ...w, isDeload } : w
      ));
    } catch (error) {
      console.error('Error toggling deload mode:', error);
      toast({
        title: "Error",
        description: "Failed to update workout. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const getWorkoutById = useCallback((id: string): Workout | undefined => {
    if (!id) return undefined;
    try {
      const workout = workouts.find(w => w.id === id);
      return workout;
    } catch (error) {
      console.error('Error getting workout by ID:', error);
      return undefined;
    }
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
