
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAppContext } from '@/context/AppContext';
import { Workout, WorkoutTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

// Helper function to convert a template to a workout
export const convertTemplateToWorkout = (template: WorkoutTemplate): Workout => {
  // Ensure we have all required fields for a valid Workout
  return {
    id: uuidv4(), // Generate a new unique ID for the workout
    name: template.name,
    date: new Date().toISOString(), // Convert to ISO string
    completed: false,
    notes: '', // Set a default empty string for notes since it's required in Workout
    exercises: template.exercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets && exercise.sets.length > 0
        ? exercise.sets.map(set => ({ ...set })) // Deep copy sets to avoid reference issues
        : Array(3).fill({ reps: 0, weight: 0 }), // Default sets if none exist
      lastProgressDate: new Date(), // Add last progress date
      notes: exercise.notes || '' // Ensure notes exists
    })),
    scheduledTime: template.scheduledTime
  };
};

export const useWorkoutLoader = (id: string | undefined) => {
  const { getWorkoutById, workoutTemplates, workouts } = useAppContext();
  const [workout, setWorkout] = useState<Workout | WorkoutTemplate | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isTemplate, setIsTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      console.log("Attempting to load workout with ID:", id);
      
      try {
        // Try to find as regular workout first
        let foundWorkout = getWorkoutById(id);
        
        if (foundWorkout && foundWorkout.id) {
          console.log("Workout found using getWorkoutById:", foundWorkout);
          
          // Ensure all required fields have default values
          foundWorkout = {
            ...foundWorkout,
            notes: foundWorkout.notes || "",
            date: foundWorkout.date || new Date().toISOString(), // Convert to ISO string if needed
            completed: typeof foundWorkout.completed === "boolean" ? foundWorkout.completed : false,
            exercises: foundWorkout.exercises.map(ex => ({
              ...ex,
              notes: ex.notes || "",
              sets: ex.sets || []
            }))
          };
          
          setWorkout(foundWorkout);
          setIsLoading(false);
          return;
        }
        
        // If not found with getWorkoutById, try direct lookup from workouts array
        foundWorkout = workouts.find(w => w.id === id);
        if (foundWorkout) {
          console.log("Workout found with direct array lookup:", foundWorkout);
          
          // Ensure all required fields have default values
          foundWorkout = {
            ...foundWorkout,
            notes: foundWorkout.notes || "",
            date: foundWorkout.date || new Date().toISOString(), // Convert to ISO string if needed
            completed: typeof foundWorkout.completed === "boolean" ? foundWorkout.completed : false,
            exercises: foundWorkout.exercises.map(ex => ({
              ...ex,
              notes: ex.notes || "",
              sets: ex.sets || []
            }))
          };
          
          setWorkout(foundWorkout);
          setIsLoading(false);
          return;
        }
        
        // If still not found, try to find as template
        const foundTemplate = workoutTemplates.find(t => t.id === id);
        if (foundTemplate) {
          console.log("Workout template found:", foundTemplate);
          
          // Ensure template has all required fields before conversion
          const safeTemplate = {
            ...foundTemplate,
            exercises: foundTemplate.exercises.map(ex => ({
              ...ex,
              notes: ex.notes || "",
              sets: ex.sets || []
            }))
          };
          
          setWorkout(safeTemplate);
          setIsTemplate(true);
          setIsLoading(false);
          return;
        }
        
        // If we get here, the workout wasn't found
        throw new Error(`Could not find workout with ID: ${id}`);
      } catch (error) {
        console.error(`Error loading workout: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setError(`Could not find workout with ID: ${id}`);
        setIsLoading(false);
      }
    };
    
    setIsLoading(true);
    setError(null); // Reset error state when loading a new workout
    loadWorkout();
  }, [id, getWorkoutById, workoutTemplates, workouts]);

  return {
    workout,
    setWorkout,
    isLoading,
    isTemplate,
    error,
    convertTemplateToWorkout
  };
};
