
import { useState, useEffect } from 'react';

export const useWorkoutTimer = (isRunning: boolean, isResting: boolean) => {
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);

  // Workout timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && !isResting) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, isResting]);

  // Rest timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const startRest = (duration = 90) => {
    setRestTime(duration);
  };

  return { workoutTime, restTime, startRest, setRestTime };
};
