
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

  // Helper function to initialize exercise data with proper default values
  const initializeExerciseData = useCallback((exercise) => {
    const initialSets = exercise.sets?.length > 0 
      ? exercise.sets.map(set => ({ 
          reps: set.reps || 0, 
          weight: set.weight || 0 
        }))
      : [{ reps: 0, weight: 0 }];
      
    return {
      sets: initialSets,
      notes: exercise.notes || "",
      previousStats: exercise.previousStats,
      prExerciseType: exercise.prExerciseType
    };
  }, []);

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
          lastProgressDate: new Date(),
          prExerciseType: exercise.prExerciseType
        };
      });

      const completedWorkout = {
        ...workout,
        id: workout.id,
        name: workout.name, 
        exercises: updatedExercises,
        completed: true,
        date: new Date(),
        notes: workout.notes || ""
      };
      
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
        
        foundWorkout.exercises.forEach(exercise => {
          if (!exerciseData[exercise.id]) {
            setExerciseData(prev => ({
              ...prev,
              [exercise.id]: initializeExerciseData(exercise)
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
  }, [id, workouts, workoutTemplates, isTemplate, addWorkout, navigate, toast, exerciseData, initializeExerciseData]);

  const nextExercise = useCallback(() => {
    if (!workout) return;
    if (currentExerciseIndex < workout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      const nextExercise = workout.exercises[nextIndex];
      const nextExerciseId = nextExercise.id;
      
      // Initialize the next exercise data if it doesn't already exist
      setExerciseData(prev => {
        if (prev[nextExerciseId]) return prev;
        
        return {
          ...prev,
          [nextExerciseId]: initializeExerciseData(nextExercise)
        };
      });
      
      setCurrentExerciseIndex(nextIndex);
      
      console.log(`Moving to exercise ${nextIndex + 1}: ${nextExercise.name}`);
    }
  }, [workout, currentExerciseIndex, initializeExerciseData]);

  const previousExercise = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  }, [currentExerciseIndex]);

  const handleUpdateNotes = useCallback((exerciseId: string, notes: string) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          notes
        }
      };
    });
  }, []);

  const handleSetUpdate = useCallback((exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      // Create a deep copy of the sets array
      const updatedSets = [...exercise.sets];
      
      // Ensure the set at this index exists
      if (!updatedSets[setIndex]) {
        updatedSets[setIndex] = { reps: 0, weight: 0 };
      }
      
      // Update the specific field
      updatedSets[setIndex] = { 
        ...updatedSets[setIndex], 
        [field]: value 
      };
      
      // Log what's being updated for debugging
      console.log(`Updating set ${setIndex} ${field} to ${value}`);
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: updatedSets
        }
      };
    });
  }, []);

  const handleAddSet = useCallback((exerciseId: string) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: [...exercise.sets, { reps: 0, weight: 0 }]
        }
      };
    });
  }, []);

  const handleRemoveSet = useCallback((exerciseId: string, setIndex: number) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      if (!exercise) return prev;
      
      const updatedSets = [...exercise.sets];
      updatedSets.splice(setIndex, 1);
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: updatedSets
        }
      };
    });
  }, []);

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
    nextExercise,
    previousExercise,
    handleUpdateNotes,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet
  };
};
