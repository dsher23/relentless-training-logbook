
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, Exercise } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { toast } = useToast();

  // Load workouts from localStorage with enhanced boolean handling
  useEffect(() => {
    try {
      const storedWorkouts = localStorage.getItem('workouts');
      if (storedWorkouts) {
        const parsedWorkouts = JSON.parse(storedWorkouts);
        
        // Enhanced logging for debugging the load process
        console.log("CRITICAL - Loading raw workouts from localStorage:", parsedWorkouts.length);
        
        // CRITICAL FIX: Ensure all workouts have correct boolean completed status
        const validatedWorkouts = parsedWorkouts.map((w: any) => {
          // Get raw completed value and log it
          const rawCompleted = w.completed;
          
          // Apply strict boolean conversion and force true to remain true
          const isCompleted = rawCompleted === true;
          
          console.log(`Loading workout ${w.id?.substring(0, 8) || 'unknown'}: name=${w.name || 'unnamed'}, raw completed=${String(rawCompleted)} (${typeof rawCompleted}), final=${isCompleted}`);
          
          return {
            ...w,
            id: w.id || uuidv4(),
            date: w.date ? new Date(w.date) : new Date(),
            completed: isCompleted,  // Ensure boolean type with correct value
            notes: w.notes || '',
            exercises: Array.isArray(w.exercises) ? w.exercises.map((ex: any) => ({
              ...ex,
              id: ex.id || uuidv4(),
              sets: Array.isArray(ex.sets) ? ex.sets : [],
              notes: ex.notes || ''
            })) : []
          };
        });
        
        // Log summary of the loaded workouts
        const trueCompleted = validatedWorkouts.filter((w: any) => w.completed === true);
        console.log("CRITICAL - Loaded workouts from localStorage:", validatedWorkouts.length);
        console.log("CRITICAL - TRUE completed workouts found:", trueCompleted.length);
        if (trueCompleted.length > 0) {
          console.log("CRITICAL - First completed workout:", trueCompleted[0]);
        }
        
        setWorkouts(validatedWorkouts);
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

  // Save workouts to localStorage with enhanced boolean preservation
  useEffect(() => {
    if (workouts.length > 0) {
      try {
        // CRITICAL FIX: Enhanced logging and explicit handling of boolean values
        console.log("CRITICAL - Saving workouts to localStorage, total count:", workouts.length);
        
        // First log the true completed workout count before any processing
        const trueCompletedBefore = workouts.filter(w => w.completed === true);
        console.log("CRITICAL - TRUE completed workouts before processing:", trueCompletedBefore.length);
        if (trueCompletedBefore.length > 0) {
          trueCompletedBefore.forEach(w => {
            console.log(`Pre-save: Workout ${w.id.substring(0, 8)}: completed=${w.completed} (${typeof w.completed})`);
          });
        }
        
        // Process workouts for storage with careful boolean handling
        const workoutsToStore = workouts.map(w => {
          // Explicitly preserve boolean true values
          const isCompleted = w.completed === true;
          
          // Enhanced logging
          console.log(`Saving workout ${w.id.substring(0, 8)}: name=${w.name}, raw completed=${String(w.completed)} (${typeof w.completed}), final=${isCompleted}`);
          
          return {
            ...w,
            completed: isCompleted  // Store as boolean, true only if explicitly true
          };
        });
        
        // Verify our processed workouts maintained their completed status
        const trueCompletedAfter = workoutsToStore.filter(w => w.completed === true);
        console.log("CRITICAL - TRUE completed workouts after processing:", trueCompletedAfter.length);
        
        // Preserve completed status during sorting and storing
        const sortedWorkouts = [...workoutsToStore].sort(
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

        // Store with additional verification
        localStorage.setItem('workouts', JSON.stringify(prunedWorkouts));
        console.log('Saved workouts to localStorage:', prunedWorkouts.length);
        console.log('TRUE Completed workouts in storage:', prunedWorkouts.filter(w => w.completed === true).length);
        
        // Final verification of stored data by reading it back
        const verifiedStoredData = localStorage.getItem('workouts');
        if (verifiedStoredData) {
          const parsedVerification = JSON.parse(verifiedStoredData);
          console.log('VERIFICATION - TRUE completed workouts in stored data:', 
            parsedVerification.filter((w: any) => w.completed === true).length);
        }
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

  // Add workout with enhanced logging
  const addWorkout = useCallback((workout: Workout): Workout => {
    try {
      // Log the incoming workout data
      console.log("CRITICAL - addWorkout - Incoming workout:", {
        id: workout.id,
        name: workout.name,
        completed: workout.completed,
        completedType: typeof workout.completed
      });
      
      // Ensure workout has all required fields
      const newWorkout = {
        ...workout,
        id: workout.id || uuidv4(),
        date: workout.date || new Date(),
        completed: workout.completed === true,  // Normalize to boolean
        notes: workout.notes || '',
        exercises: Array.isArray(workout.exercises) ? workout.exercises.map(ex => ({
          ...ex,
          id: ex.id || uuidv4(),
          sets: Array.isArray(ex.sets) ? ex.sets : [],
          notes: ex.notes || ''
        })) : []
      };
      
      // Log what we're actually adding
      console.log("CRITICAL - addWorkout - Final workout to be added:", {
        id: newWorkout.id,
        name: newWorkout.name,
        completed: newWorkout.completed,
        type: typeof newWorkout.completed
      });
      
      setWorkouts(prev => {
        const newWorkouts = [...prev, newWorkout];
        
        // Verify completed workouts after adding
        const completedCount = newWorkouts.filter(w => w.completed === true).length;
        console.log(`CRITICAL - addWorkout - New workouts length: ${newWorkouts.length}, Completed: ${completedCount}`);
        
        return newWorkouts;
      });
      
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

  // Update workout with enhanced logging and boolean handling
  const updateWorkout = useCallback((workout: Workout): Workout => {
    try {
      // CRITICAL: Enhanced logging to track the update process
      console.log("CRITICAL - updateWorkout - Incoming workout data:", {
        id: workout.id,
        name: workout.name, 
        completed: workout.completed,
        completedType: typeof workout.completed
      });
      
      // CRITICAL FIX: Explicitly maintain completed=true when it's true in the input
      // Let's be extremely careful here to ensure we don't reset a completed workout
      const shouldBeCompleted = workout.completed === true;
      
      console.log(`CRITICAL - updateWorkout - Should be completed: ${shouldBeCompleted}`);
      
      // Create a new workout object with completed status explicitly set
      const updatedWorkout = {
        ...workout,
        id: workout.id || uuidv4(),
        date: workout.date || new Date(),
        completed: shouldBeCompleted, // CRITICAL: Use our explicit check
        notes: workout.notes || '',
        exercises: Array.isArray(workout.exercises) ? workout.exercises.map(ex => ({
          ...ex,
          id: ex.id || uuidv4(),
          sets: Array.isArray(ex.sets) ? ex.sets : [],
          notes: ex.notes || ''
        })) : []
      };
      
      console.log('CRITICAL - updateWorkout - Final workout object to save:', {
        id: updatedWorkout.id,
        name: updatedWorkout.name,
        completed: updatedWorkout.completed,
        completedType: typeof updatedWorkout.completed
      });
      
      // Use a function to update state to ensure we have the latest state
      setWorkouts(prev => {
        const exists = prev.some(w => w.id === updatedWorkout.id);
        console.log(`CRITICAL - updateWorkout - Workout ${updatedWorkout.id.substring(0, 8)} exists in state: ${exists}`);
        
        let newWorkouts;
        if (exists) {
          newWorkouts = prev.map(w => 
            w.id === updatedWorkout.id ? updatedWorkout : w
          );
        } else {
          newWorkouts = [...prev, updatedWorkout];
          console.log('CRITICAL - updateWorkout - Added new workout, total:', newWorkouts.length);
        }
        
        // Verify the update was successful by checking if the workout is now completed
        const completedWorkout = newWorkouts.find(w => w.id === updatedWorkout.id);
        console.log('CRITICAL - updateWorkout - After update, workout completed status:', 
          completedWorkout ? completedWorkout.completed : 'workout not found');
        
        // Count completed workouts after update
        const completedCount = newWorkouts.filter(w => w.completed === true).length;
        console.log(`CRITICAL - updateWorkout - Updated workouts array length: ${newWorkouts.length}, Completed: ${completedCount}`);
        
        return newWorkouts;
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
