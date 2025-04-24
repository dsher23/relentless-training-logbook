
import { useState } from "react";
import { Exercise } from "@/types";
import { useExercises } from "@/hooks/useExercises";

interface UseExerciseFormProps {
  exercise?: Exercise;
  onClose?: () => void;
  onSave?: (exercise: Exercise) => void;
}

export const useExerciseForm = ({ exercise, onClose, onSave }: UseExerciseFormProps) => {
  const { customExercises, addExercise } = useExercises();
  
  const [name, setName] = useState(exercise?.name || '');
  const [sets, setSets] = useState(exercise?.sets?.length || 3);
  const [reps, setReps] = useState(exercise?.sets && exercise.sets.length > 0 ? exercise.sets[0].reps : 10);
  const [weight, setWeight] = useState(exercise?.sets && exercise.sets.length > 0 ? exercise.sets[0].weight : 0);
  const [restTime, setRestTime] = useState<string>(exercise?.restTime ? exercise.restTime.toString() : "60");
  const [notes, setNotes] = useState(exercise?.notes || '');
  const [isWeakPoint, setIsWeakPoint] = useState(exercise?.isWeakPoint || false);
  const [prExerciseType, setPrExerciseType] = useState<string>(exercise?.prExerciseType || "none");
  const [isEditing] = useState(!!exercise);
  
  const resetForm = () => {
    setName('');
    setSets(3);
    setReps(10);
    setWeight(0);
    setRestTime('60');
    setNotes('');
    setIsWeakPoint(false);
    setPrExerciseType('none');
  };
  
  const setters = {
    setName,
    setSets,
    setReps,
    setWeight,
    setRestTime,
    setNotes,
    setIsWeakPoint,
    setPrExerciseType
  };
  
  // When an exercise is saved, also add it to our centralized exercise list
  const handleSave = (newExercise: Exercise) => {
    if (!isEditing && newExercise.name) {
      // Only add to custom exercises if this is a new exercise
      addExercise(
        newExercise.name, 
        !!newExercise.prExerciseType, 
        newExercise.prExerciseType
      );
    }
    
    if (onSave) {
      onSave(newExercise);
    }
  };
  
  return {
    formData: {
      name,
      sets,
      reps,
      weight,
      restTime,
      notes,
      isWeakPoint,
      prExerciseType,
      isEditing
    },
    setters,
    resetForm,
    handleSave
  };
};
