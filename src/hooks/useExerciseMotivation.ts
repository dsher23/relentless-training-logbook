
import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';

const MOTIVATIONAL_MESSAGES = [
  "Smash your last lift 💪",
  "Push for progress!",
  "Beat your record today! 🔥",
  "One more rep than last time!",
  "Make every rep count! 💯",
  "You're stronger than yesterday!"
];

export const useExerciseMotivation = (exerciseName: string) => {
  const { workouts } = useAppContext();
  
  const lastWorkoutData = useMemo(() => {
    if (!exerciseName || !workouts?.length) return null;
    
    // Find the most recent completed workout containing this exercise
    const lastWorkout = [...workouts]
      .filter(w => w?.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .find(w => w.exercises?.some(e => 
        e.name.toLowerCase() === exerciseName.toLowerCase()
      ));
      
    if (!lastWorkout) return null;
    
    const exercise = lastWorkout.exercises.find(e => 
      e.name.toLowerCase() === exerciseName.toLowerCase()
    );
    
    if (!exercise?.sets?.length) return null;
    
    // Find the best set (highest weight × reps)
    const bestSet = exercise.sets.reduce((best, current) => {
      const bestVolume = best.weight * best.reps;
      const currentVolume = current.weight * current.reps;
      return currentVolume > bestVolume ? current : best;
    });
    
    return bestSet;
  }, [exerciseName, workouts]);
  
  const motivationalMessage = useMemo(() => {
    if (!lastWorkoutData) return null;
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[randomIndex];
  }, [lastWorkoutData]);
  
  return {
    lastWorkoutData,
    motivationalMessage
  };
};
