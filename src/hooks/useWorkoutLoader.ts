
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAppContext, Workout, WorkoutTemplate } from '@/context/AppContext';

// Helper function to convert a template to a workout
export const convertTemplateToWorkout = (template: WorkoutTemplate): Workout => {
  return {
    ...template,
    date: new Date(),
    completed: false,
    // Ensure we don't include template-specific fields in the resulting workout
    dayName: undefined,
    isFavorite: undefined
  };
};

export const useWorkoutLoader = (id: string | undefined) => {
  const { getWorkoutById, workoutTemplates } = useAppContext();
  const [workout, setWorkout] = useState<Workout | WorkoutTemplate | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isTemplate, setIsTemplate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const maxRetries = 5;
    const retryDelay = 300;

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
    convertTemplateToWorkout
  };
};
