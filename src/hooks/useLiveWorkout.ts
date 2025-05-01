import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { convertTemplateToWorkout } from "@/hooks/useWorkoutLoader";
import { Workout } from '@/types';

export const useLiveWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTemplate = searchParams.get("isTemplate") === "true";
  const { toast } = useToast();
  const { workouts, workoutTemplates, addWorkout, updateWorkout, addPRLift } = useAppContext();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [exerciseData, setExerciseData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Save workout progress to localStorage
  useEffect(() => {
    if (workout && Object.keys(exerciseData).length > 0) {
      const progressData = {
        workoutId: workout.id,
        exerciseData,
        currentExerciseIndex
      };
      localStorage.setItem('workout_in_progress', JSON.stringify(progressData));
    }
  }, [workout, exerciseData, currentExerciseIndex]);

  const initializeExerciseData = useCallback((exercise) => {
    if (!exercise) {
      console.error("Tried to initialize undefined exercise");
      return { sets: [{ reps: 0, weight: 0 }], notes: "" };
    }
    
    const initialSets = Array.isArray(exercise.sets) && exercise.sets.length > 0 
      ? exercise.sets.map(set => ({ 
          reps: set.reps || 0, 
          weight: set.weight || 0 
        }))
      : [{ reps: exercise.reps || 0, weight: exercise.weight || 0 }];
      
    return {
      sets: initialSets,
      notes: exercise.notes || "",
      previousStats: exercise.previousStats,
      prExerciseType: exercise.prExerciseType
    };
  }, []);

  const checkForPRs = useCallback((exerciseId, name, prExerciseType, sets) => {
    if (!prExerciseType || !sets || sets.length === 0) return;

    const bestSet = [...sets].sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return b.reps - a.reps;
    })[0];

    if (bestSet && bestSet.weight > 0 && bestSet.reps > 0) {
      addPRLift({
        exerciseId,
        weight: bestSet.weight,
        reps: bestSet.reps,
        date: new Date(),
        workoutId: id,
        isDirectEntry: false
      });

      toast({
        title: "New PR Set!",
        description: `${name}: ${bestSet.weight}kg for ${bestSet.reps} reps`,
      });
    }
  }, [addPRLift, id, toast]);

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
      
      const updatedExercises = workout.exercises?.map(exercise => {
        const data = exerciseData[exercise.id];
        if (!data) return exercise;
        
        if (exercise.prExerciseType) {
          checkForPRs(exercise.id, exercise.name, exercise.prExerciseType, data.sets);
        }
        
        return {
          ...exercise,
          sets: data.sets.map((set: any) => ({ ...set })),
          notes: data.notes || "",
          lastProgressDate: new Date(),
          prExerciseType: exercise.prExerciseType
        };
      }) || [];

      const completedWorkout = {
        ...workout,
        id: workout.id,
        name: workout.name, 
        exercises: updatedExercises,
        completed: true,
        date: new Date(),
        notes: workout.notes || ""
      };
      
      console.log("Saving completed workout:", completedWorkout);
      
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
      setHasAttemptedSave(false);
    }
  }, [workout, exerciseData, updateWorkout, toast, navigate, checkForPRs]);

  const loadWorkout = useCallback(async () => {
    setIsLoading(true);
    
    if (!id) {
      console.error("No workout ID provided");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Workouts available:", workouts);
      console.log("Workout templates available:", workoutTemplates);
      
      const savedProgress = localStorage.getItem('workout_in_progress');
      let initialExerciseData = {};
      let initialExerciseIndex = 0;
      
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        if (progressData.workoutId === id) {
          initialExerciseData = progressData.exerciseData || {};
          initialExerciseIndex = progressData.currentExerciseIndex || 0;
        }
      }
      
      let foundWorkout;
      
      if (isTemplate) {
        console.log("Loading template with ID:", id);
        const template = workoutTemplates.find(t => t.id === id);
        
        if (!template) {
          throw new Error(`Template with ID ${id} not found`);
        }
        
        console.log("Found template:", template);
        const convertedWorkout = convertTemplateToWorkout(template);
        
        if (!convertedWorkout) {
          throw new Error("Failed to convert template to workout");
        }
        
        const workoutWithCompletedFlag = {
          ...convertedWorkout,
          completed: false,
          exercises: convertedWorkout.exercises.map(ex => ({
            ...ex,
            prExerciseType: ex.prExerciseType
          }))
        };
        
        console.log("Adding workout from template:", workoutWithCompletedFlag);
        addWorkout(workoutWithCompletedFlag.name, workoutWithCompletedFlag.exercises, workoutWithCompletedFlag);
        foundWorkout = workoutWithCompletedFlag;
      } else {
        console.log("Loading regular workout with ID:", id);
        foundWorkout = workouts.find(w => w.id === id);
        if (!foundWorkout) {
          throw new Error(`Workout with ID ${id} not found`);
        }
        console.log("Found workout:", foundWorkout);
      }
      
      console.log("Setting workout:", foundWorkout);
      setWorkout(foundWorkout);
      setCurrentExerciseIndex(initialExerciseIndex);
      
      const newExerciseData = {...initialExerciseData};
      
      foundWorkout.exercises.forEach(exercise => {
        if (!newExerciseData[exercise.id]) {
          newExerciseData[exercise.id] = initializeExerciseData(exercise);
        }
      });
      
      setExerciseData(newExerciseData);
    } catch (error) {
      console.error("Error loading workout:", error.message);
      toast({
        title: "Workout Not Found",
        description: `The requested workout could not be loaded: ${error.message}. Returning to workouts.`,
        variant: "destructive",
      });
      setTimeout(() => navigate("/workouts"), 500);
    } finally {
      setIsLoading(false);
    }
  }, [id, workouts, workoutTemplates, isTemplate, addWorkout, navigate, toast, initializeExerciseData]);

  useEffect(() => {
    loadWorkout();
  }, [loadWorkout]);

  const nextExercise = useCallback(() => {
    if (!workout) return;
    if (currentExerciseIndex < workout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      const nextExercise = workout.exercises[nextIndex];
      const nextExerciseId = nextExercise.id;
      
      setExerciseData(prev => {
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
      
      const updatedSets = [...exercise.sets];
      
      if (!updatedSets[setIndex]) {
        updatedSets[setIndex] = { reps: 0, weight: 0 };
      }
      
      updatedSets[setIndex] = { 
        ...updatedSets[setIndex], 
        [field]: value 
      };
      
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
    isLoading,
    nextExercise,
    previousExercise,
    handleUpdateNotes,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet
  };
};

export default useLiveWorkout;
