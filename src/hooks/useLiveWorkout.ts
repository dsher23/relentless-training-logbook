
import { useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppContext, Workout } from "@/context/AppContext";
import { convertTemplateToWorkout } from "@/hooks/useWorkoutLoader";

export const useLiveWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTemplate = searchParams.get("isTemplate") === "true";
  const { toast } = useToast();
  const { workouts, workoutTemplates, addWorkout, updateWorkout } = useAppContext();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [exerciseData, setExerciseData] = useState<{
    [key: string]: {
      sets: { reps: number; weight: number }[];
      notes: string;
      previousStats?: { reps: number; weight: number }[];
    }
  }>({});

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
        
        return {
          ...exercise,
          sets: data.sets.map(set => ({ ...set })),
          notes: data.notes || "",
          lastProgressDate: new Date()
        };
      });

      const completedWorkout = {
        id: workout.id,
        name: workout.name, 
        exercises: updatedExercises,
        completed: true,
        date: new Date(),
        notes: workout.notes || ""
      };
      
      updateWorkout(completedWorkout);
      
      localStorage.removeItem('workout_in_progress');
      
      toast({
        title: "Workout Completed!",
        description: "Your workout has been saved successfully to history.",
      });
      
      setTimeout(() => {
        navigate("/workout-history");
      }, 1500);
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
      
      let foundWorkout: Workout | undefined;
      
      if (isTemplate) {
        const template = workoutTemplates.find(t => t.id === id);
        if (template) {
          const convertedWorkout = convertTemplateToWorkout(template);
          
          if (convertedWorkout) {
            addWorkout(convertedWorkout);
            foundWorkout = convertedWorkout;
          }
        }
      } else {
        foundWorkout = workouts.find(w => w.id === id);
      }
      
      if (foundWorkout) {
        setWorkout(foundWorkout);
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
  }, [id, workouts, workoutTemplates, isTemplate, addWorkout, navigate, toast]);

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
