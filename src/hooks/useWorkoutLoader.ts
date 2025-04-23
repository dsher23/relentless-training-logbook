
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAppContext, Workout, WorkoutTemplate } from '@/context/AppContext';

// Helper function to convert a template to a workout
export const convertTemplateToWorkout = (template: WorkoutTemplate): Workout => {
  return {
    ...template,
    date: new Date(),
    completed: false,
    notes: '', // Set a default empty string for notes since it's required in Workout
    exercises: template.exercises,
    scheduledTime: template.scheduledTime
  };
};

export const useWorkoutLoader = (id: string | undefined) => {
  const { getWorkoutById, workoutTemplates } = useAppContext();
  const [workout, setWorkout] = useState<Workout | WorkoutTemplate | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isTemplate, setIsTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const maxRetries = 5;
    const retryDelay = 300;

    if (!id) {
      setIsLoading(false);
      return;
    }

    if (!workout?.id && id && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        // Try to find as regular workout first
        const foundWorkout = getWorkoutById(id);
        
        if (foundWorkout?.id) {
          setWorkout(foundWorkout);
          setIsLoading(false);
          console.log("Workout found:", foundWorkout);
        } else {
          // If not found, try to find as template
          const foundTemplate = workoutTemplates.find(t => t.id === id);
          
          if (foundTemplate?.id) {
            setWorkout(foundTemplate);
            setIsTemplate(true);
            setIsLoading(false);
            console.log("Workout template found:", foundTemplate);
          } else {
            setRetryCount(prev => prev + 1);
            if (retryCount === maxRetries - 1) {
              setError(`Could not find workout with ID: ${id}`);
              setIsLoading(false);
            }
          }
        }
      }, retryDelay);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [id, workout, getWorkoutById, workoutTemplates, retryCount]);

  return {
    workout,
    setWorkout,
    isLoading,
    retryCount,
    isTemplate,
    error,
    convertTemplateToWorkout
  };
};
