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
          // CRITICAL: Preserve the boolean value of completed exactly as stored
          const isCompleted = w.completed === true;
          
          console.log(`Loading workout ${w.id?.substring(0, 8) || 'unknown'}: name=${w.name || 'unnamed'}, completed=${String(isCompleted)} (${typeof isCompleted})`);
          
          return {
            ...w,
            id: w.id || uuidv4(),
            date: w.date ? new Date(w.date) : new Date(),
            completed: isCompleted,  // Preserve as boolean
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
        console.log("Saving workouts to localStorage, count:", workouts.length);
        
        // CRITICAL: Log check before saving to verify completed status
        const trueCompletedBefore = workouts.filter(w => w.completed === true);
        console.log("TRUE completed workouts before saving:", trueCompletedBefore.length);
        
        // Process workouts for storage with specific boolean handling
        const workoutsToStore = workouts.map(w => {
          // CRITICAL: Preserve boolean true values exactly
          const completed = w.completed === true;
          
          // Debug each workout being saved
          console.log(`Saving workout ${w.id.substring(0, 8)}: name=${w.name}, completed=${String(completed)} (${typeof completed})`);
          
          // Return a clean workout object with completed properly set
          return {
            ...w,
            completed // This will be exactly true or false
          };
        });
        
        // Verify our processed workouts maintained their completed status
        const trueCompletedAfter = workoutsToStore.filter(w => w.completed === true);
        console.log("TRUE completed workouts after processing:", trueCompletedAfter.length);
        
        // Sort and limit if needed
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

        // Store with verification
        localStorage.setItem('workouts', JSON.stringify(prunedWorkouts));
        console.log('Saved workouts to localStorage:', prunedWorkouts.length);
        console.log('TRUE Completed workouts saved:', prunedWorkouts.filter(w => w.completed === true).length);
      } catch (error) {
        console.error('Error saving workouts to localStorage:', error);
        
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          // Handle storage quota exceeded
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

  // Update workout - CRITICAL function for completion status
  const updateWorkout = useCallback((workout: Workout): Workout => {
    try {
      // CRITICAL: Log the exact workout being received for update
      console.log("updateWorkout - Received workout:", {
        id: workout.id,
        name: workout.name, 
        completed: workout.completed,
        type: typeof workout.completed
      });
      
      // CRITICAL: Make absolutely sure we preserve completed=true
      // Create a clean workout object with the completion flag explicitly set
      const updatedWorkout = {
        ...workout,
        id: workout.id || uuidv4(),
        completed: workout.completed === true, // This ensures it's properly set as boolean
        date: workout.date || new Date(),
        notes: workout.notes || '',
        exercises: Array.isArray(workout.exercises) ? workout.exercises.map(ex => ({
          ...ex,
          id: ex.id || uuidv4(),
          sets: Array.isArray(ex.sets) ? ex.sets : [],
          notes: ex.notes || ''
        })) : []
      };
      
      console.log("updateWorkout - Final processed workout:", {
        id: updatedWorkout.id,
        name: updatedWorkout.name,
        completed: updatedWorkout.completed, 
        type: typeof updatedWorkout.completed
      });
      
      // Use a function to update state to ensure we have the latest state
      setWorkouts(prev => {
        const exists = prev.some(w => w.id === updatedWorkout.id);
        
        let newWorkouts;
        if (exists) {
          newWorkouts = prev.map(w => 
            w.id === updatedWorkout.id ? updatedWorkout : w
          );
          console.log(`updateWorkout - Updated existing workout ${updatedWorkout.id.substring(0, 8)}`);
        } else {
          newWorkouts = [...prev, updatedWorkout];
          console.log('updateWorkout - Added new workout (id not found in previous workouts)');
        }
        
        // Verify the update by checking updated workouts
        const completedCount = newWorkouts.filter(w => w.completed === true).length;
        console.log(`updateWorkout - Updated workouts array: total=${newWorkouts.length}, completed=${completedCount}`);
        
        return newWorkouts;
      });
      
      // Return the updated workout
      return updatedWorkout;
    } catch (error) {
      console.error('Error updating workout:', error);
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
