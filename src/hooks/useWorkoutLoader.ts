
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAppContext, Workout } from '@/context/AppContext';

export const useWorkoutLoader = (id: string | undefined) => {
  const { getWorkoutById } = useAppContext();
  const [workout, setWorkout] = useState<Workout | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const maxRetries = 5;
    const retryDelay = 300;

    if (!workout?.id && id && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        const foundWorkout = getWorkoutById(id);
        setWorkout(foundWorkout);
        
        if (foundWorkout?.id) {
          setIsLoading(false);
          console.log("Workout found:", foundWorkout);
        } else {
          setRetryCount(prev => prev + 1);
        }
      }, retryDelay);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [id, workout, getWorkoutById, retryCount]);

  return {
    workout,
    setWorkout,
    isLoading,
    retryCount
  };
};
