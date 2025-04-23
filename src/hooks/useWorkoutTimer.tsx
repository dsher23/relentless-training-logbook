
import { useState, useEffect, useRef } from 'react';

export const useWorkoutTimer = (isRunning: boolean, isResting: boolean) => {
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [initialRestTime, setInitialRestTime] = useState(0);
  
  // Use refs to preserve the timer intervals
  const workoutIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Workout timer
  useEffect(() => {
    if (isRunning && !isResting) {
      // Clear any existing interval first
      if (workoutIntervalRef.current) {
        clearInterval(workoutIntervalRef.current);
      }
      
      workoutIntervalRef.current = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    } else if (workoutIntervalRef.current) {
      clearInterval(workoutIntervalRef.current);
      workoutIntervalRef.current = null;
    }
    
    return () => {
      if (workoutIntervalRef.current) {
        clearInterval(workoutIntervalRef.current);
        workoutIntervalRef.current = null;
      }
    };
  }, [isRunning, isResting]);

  // Rest timer
  useEffect(() => {
    if (isResting && restTime > 0) {
      // Clear any existing interval first
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
      }
      
      restIntervalRef.current = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            if (restIntervalRef.current) {
              clearInterval(restIntervalRef.current);
              restIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
    
    return () => {
      if (restIntervalRef.current) {
        clearInterval(restIntervalRef.current);
        restIntervalRef.current = null;
      }
    };
  }, [isResting, restTime]);

  const startRest = (duration = 90) => {
    setRestTime(duration);
    setInitialRestTime(duration);
  };

  return { workoutTime, restTime, initialRestTime, startRest, setRestTime };
};
