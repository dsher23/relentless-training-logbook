import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, Exercise } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { toast } = useToast();

  // Load workouts from localStorage
  useEffect(() => {
    try {
      const storedWorkouts = localStorage.getItem('workouts');
      if (storedWorkouts) {
        const parsedWorkouts = JSON.parse(storedWorkouts);
        
        console.log("Loading workouts from localStorage:", parsedWorkouts.length);
        
        // Process and validate workouts, ensuring completed flag is preserved
        const validatedWorkouts = parsedWorkouts.map((w: any) => {
          // Ensure completed is exactly true or false
          const isCompleted = w.completed === true;
          
          console.log(`Loading workout ${w.id?.substring(0, 8) || 'unknown'}: name=${w.name || 'unnamed'}, completed=${String(isCompleted)} (${typeof isCompleted})`);
          
          return {
            ...w,
            id: w.id || uuidv4(),
            date: w.date ? new Date(w.date) : new Date(),
            completed: isCompleted,  // Important: store as boolean
            notes: w.notes || '',
            exercises: Array.isArray(w.exercises) ? w.exercises.map((ex: any) => ({
              ...ex,
              id: ex.id || uuidv4(),
              sets: Array.isArray(ex.sets) ? ex.sets : [],
              notes: ex.notes || ''
            })) : []
          };
        });
        
        const trueCompleted = validatedWorkouts.filter((w: any) => w.completed === true);
        console.log("Loaded workouts:", validatedWorkouts.length);
        console.log("TRUE completed workouts found:", trueCompleted.length);
        
        setWorkouts(validatedWorkouts);
      }
    } catch (error) {
      console.error('Error loading workouts from localStorage:', error);
      
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

  // Save workouts to localStorage
  useEffect(() => {
    if (workouts.length > 0) {
      try {
        console.log("CRITICAL - Saving workouts to localStorage, count:", workouts.length);
        
        // CRITICAL: Log check before saving to verify completed status
        const trueCompletedBefore = workouts.filter(w => w.completed === true);
        console.log("CRITICAL - TRUE completed workouts before saving:", trueCompletedBefore.length);
        
        // Map through workouts and force completed to be a strict boolean
        const workoutsToStore = workouts.map(w => {
          // Force completed to be a boolean true if it was true, false otherwise
          const isCompleted = w.completed === true;
          
          // Debug each workout being saved
          console.log(`CRITICAL - Saving workout ${w.id.substring(0, 8)}: name=${w.name}, completed=${String(isCompleted)} (${typeof isCompleted})`);
          
          // Return the workout with completed properly set
          return {
            ...w,
            completed: isCompleted, // Store as boolean 
          };
        });
        
        // Verify our processed workouts maintained their completed status
        const trueCompletedAfter = workoutsToStore.filter(w => w.completed === true);
        console.log("CRITICAL - TRUE completed workouts after processing:", trueCompletedAfter.length);
        
        localStorage.setItem('workouts', JSON.stringify(workoutsToStore));
        console.log('CRITICAL - Saved workouts to localStorage:', workoutsToStore.length);
        console.log('CRITICAL - TRUE Completed workouts saved:', workoutsToStore.filter(w => w.completed === true).length);
      } catch (error) {
        console.error('Error saving workouts to localStorage:', error);
      }
    }
  }, [workouts, toast]);

  // Add workout
  const addWorkout = useCallback((workout: Workout): Workout => {
    try {
      console.log("Adding new workout:", {
        id: workout.id,
        name: workout.name,
        completed: workout.completed,
        type: typeof workout.completed
      });
      
      const newWorkout = {
        ...workout,
        id: workout.id || uuidv4(),
        date: workout.date || new Date(),
        completed: workout.completed === true, // Normalize to boolean
        notes: workout.notes || '',
        exercises: Array.isArray(workout.exercises) ? workout.exercises.map(ex => ({
          ...ex,
          id: ex.id || uuidv4(),
          sets: Array.isArray(ex.sets) ? ex.sets : [],
          notes: ex.notes || ''
        })) : []
      };
      
      console.log("Final workout to be added:", {
        id: newWorkout.id,
        name: newWorkout.name, 
        completed: newWorkout.completed,
        type: typeof newWorkout.completed
      });
      
      setWorkouts(prev => {
        const newWorkouts = [...prev, newWorkout];
        return newWorkouts;
      });
      
      return newWorkout;
    } catch (error) {
      console.error('Error adding workout:', error);
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
      
      // Return a minimal valid workout object
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

  // Update workout function - critical for handling completed status
  const updateWorkout = useCallback((workout: Workout): Workout => {
    try {
      // CRITICAL: Log the workout being updated
      console.log("CRITICAL - updateWorkout received:", {
        id: workout.id?.substring(0, 8),
        name: workout.name,
        completed: workout.completed,
        type: typeof workout.completed
      });
      
      // Force completed to be a boolean true if true was passed
      const isCompleted = workout.completed === true;
      
      // Create a new clean workout with completed preserved as boolean
      const updatedWorkout = {
        ...workout,
        id: workout.id || uuidv4(),
        completed: isCompleted, // Explicitly set as boolean
        date: workout.date || new Date(),
        notes: workout.notes || '',
        exercises: Array.isArray(workout.exercises) ? workout.exercises.map(ex => ({
          ...ex,
          id: ex.id || uuidv4(),
          sets: Array.isArray(ex.sets) ? ex.sets : [],
          notes: ex.notes || ''
        })) : []
      };
      
      // Log the processed workout for verification
      console.log("CRITICAL - updateWorkout processed:", {
        id: updatedWorkout.id?.substring(0, 8),
        name: updatedWorkout.name,
        completed: updatedWorkout.completed,
        type: typeof updatedWorkout.completed
      });
      
      // Update state with the processed workout
      setWorkouts(prev => {
        const exists = prev.some(w => w.id === updatedWorkout.id);
        
        let newWorkouts;
        if (exists) {
          // Replace the existing workout
          newWorkouts = prev.map(w => 
            w.id === updatedWorkout.id ? updatedWorkout : w
          );
          console.log(`CRITICAL - Updated existing workout ${updatedWorkout.id?.substring(0, 8)} completed=${updatedWorkout.completed}`);
        } else {
          // Add as new workout
          newWorkouts = [...prev, updatedWorkout];
          console.log('CRITICAL - Added new workout, completed=', updatedWorkout.completed);
        }
        
        // Log completion status after update
        const completedCount = newWorkouts.filter(w => w.completed === true).length;
        console.log(`CRITICAL - After update: total=${newWorkouts.length}, completed=${completedCount}`);
        
        return newWorkouts;
      });
      
      // Return the updated workout
      return updatedWorkout;
    } catch (error) {
      console.error('CRITICAL - Error updating workout:', error);
      toast({
        title: "Error",
        description: "Failed to update workout. Please try again.",
        variant: "destructive",
      });
      
      // Return the original workout
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
