
import { useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { convertTemplateToWorkout } from "@/hooks/useWorkoutLoader";

export const useLiveWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTemplate = searchParams.get("isTemplate") === "true";
  const { toast } = useToast();
  const { workouts, workoutTemplates, addWorkout, updateWorkout } = useAppContext();
  
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [exerciseData, setExerciseData] = useState({});

  const finishWorkout = useCallback(() => {
    if (!workout) {
      toast({
        title: "Error",
        description: "Unable to save workout: missing workout data.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setHasAttemptedSave(true);
      
      const updatedExercises = workout.exercises.map(exercise => {
        const data = exerciseData[exercise.id];
        if (!data) return exercise;
        
        // Preserve the prExerciseType field when saving workout
        return {
          ...exercise,
          sets: data.sets.map(set => ({ ...set })),
          notes: data.notes || "",
          lastProgressDate: new Date(),
          prExerciseType: exercise.prExerciseType
        };
      });

      // Create a completed workout with explicitly set boolean completed flag
      const completedWorkout = {
        ...workout,
        id: workout.id,
        name: workout.name, 
        exercises: updatedExercises,
        completed: true,
        date: new Date(),
        notes: workout.notes || ""
      };
      
      // Log the workout we're about to save for verification
      console.log("Saving completed workout:", {
        id: completedWorkout.id,
        name: completedWorkout.name,
        completed: completedWorkout.completed,
        completedType: typeof completedWorkout.completed,
        date: completedWorkout.date
      });
      
      updateWorkout(completedWorkout);
      
      localStorage.removeItem('workout_in_progress');
      
      toast({
        title: "Workout Completed!",
        description: "Your workout has been saved successfully to history.",
      });
      
      setTimeout(() => {
        navigate("/workout-history");
      }, 1000);
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        title: "Save Error",
        description: "There was a problem saving your workout. Please try again.",
        variant: "destructive"
      });
    }
  }, [workout, exerciseData, updateWorkout, toast, navigate]);

  const loadWorkout = useCallback(async () => {
    if (!id) return;
    
    try {
      const savedProgress = localStorage.getItem('workout_in_progress');
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        if (progressData.workoutId === id) {
          setExerciseData(progressData.exerciseData || {});
          setCurrentExerciseIndex(progressData.currentExerciseIndex || 0);
        }
      }
      
      let foundWorkout;
      
      if (isTemplate) {
        const template = workoutTemplates.find(t => t.id === id);
        if (template) {
          const convertedWorkout = convertTemplateToWorkout(template);
          
          if (convertedWorkout) {
            // Ensure converted workouts have completed flag set to false
            // and preserve prExerciseType field
            const workoutWithCompletedFlag = {
              ...convertedWorkout,
              completed: false,
              exercises: convertedWorkout.exercises.map(ex => ({
                ...ex,
                prExerciseType: ex.prExerciseType
              }))
            };
            addWorkout(workoutWithCompletedFlag);
            foundWorkout = workoutWithCompletedFlag;
          }
        }
      } else {
        foundWorkout = workouts.find(w => w.id === id);
      }
      
      if (foundWorkout) {
        setWorkout(foundWorkout);
        
        // Initialize exerciseData for each exercise if it doesn't exist
        foundWorkout.exercises.forEach(exercise => {
          if (!exerciseData[exercise.id]) {
            setExerciseData(prev => ({
              ...prev,
              [exercise.id]: {
                sets: exercise.sets || [],
                notes: exercise.notes || "",
                previousStats: exercise.previousStats,
                prExerciseType: exercise.prExerciseType
              }
            }));
          }
        });
      } else {
        throw new Error("Workout not found");
      }
    } catch (error) {
      console.error("Error loading workout:", error);
      toast({
        title: "Workout Not Found",
        description: "The requested workout could not be loaded. Returning to workouts.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/workouts"), 500);
    }
  }, [id, workouts, workoutTemplates, isTemplate, addWorkout, navigate, toast, exerciseData]);

  return {
    workout,
    currentExerciseIndex,
    setCurrentExerciseIndex,
    hasAttemptedSave,
    setHasAttemptedSave,
    debugMode,
    setDebugMode,
    exerciseData,
    setExerciseData,
    finishWorkout,
    loadWorkout,
  };
};
