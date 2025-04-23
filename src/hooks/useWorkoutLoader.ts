
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAppContext } from '@/context/AppContext';
import { Workout, WorkoutTemplate } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

// Helper function to convert a template to a workout
export const convertTemplateToWorkout = (template: WorkoutTemplate): Workout => {
  return {
    id: uuidv4(), // Generate a new unique ID for the workout
    name: template.name,
    date: new Date(),
    completed: false,
    notes: '', // Set a default empty string for notes since it's required in Workout
    exercises: template.exercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets.map(set => ({ ...set })), // Deep copy sets to avoid reference issues
      lastProgressDate: new Date(), // Add last progress date
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
      
      // Try to find as regular workout first
      let foundWorkout = getWorkoutById(id);
      
      if (foundWorkout && foundWorkout.id) {
        console.log("Workout found using getWorkoutById:", foundWorkout);
        setWorkout(foundWorkout);
        setIsLoading(false);
        return;
      }
      
      // If not found with getWorkoutById, try direct lookup from workouts array
      foundWorkout = workouts.find(w => w.id === id);
      if (foundWorkout) {
        console.log("Workout found with direct array lookup:", foundWorkout);
        setWorkout(foundWorkout);
        setIsLoading(false);
        return;
      }
      
      // If still not found, try to find as template
      const foundTemplate = workoutTemplates.find(t => t.id === id);
      if (foundTemplate) {
        console.log("Workout template found:", foundTemplate);
        setWorkout(foundTemplate);
        setIsTemplate(true);
        setIsLoading(false);
        return;
      }
      
      // If we get here, the workout wasn't found
      console.error(`Could not find workout with ID: ${id}`);
      setError(`Could not find workout with ID: ${id}`);
      setIsLoading(false);
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
