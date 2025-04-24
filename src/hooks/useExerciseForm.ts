
import { useState, useEffect } from "react";
import { Exercise } from "@/types";

interface UseExerciseFormProps {
  exercise?: Exercise;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
}

export const useExerciseForm = ({ exercise, onClose, onSave }: UseExerciseFormProps) => {
  const [name, setName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [restTime, setRestTime] = useState<string>("90");
  const [notes, setNotes] = useState("");
  const [isWeakPoint, setIsWeakPoint] = useState(false);
  const [prExerciseType, setPrExerciseType] = useState<string>("none");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setSets(exercise.sets.length);
      setReps(exercise.sets[0]?.reps || 10);
      setWeight(exercise.sets[0]?.weight);
      setRestTime(exercise.restTime ? exercise.restTime.toString() : "90");
      setNotes(exercise.notes || "");
      setIsWeakPoint(exercise.isWeakPoint || false);
      setPrExerciseType(exercise.prExerciseType || "none");
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [exercise]);

  const resetForm = () => {
    setName("");
    setSets(3);
    setReps(10);
    setWeight(undefined);
    setRestTime("90");
    setNotes("");
    setIsWeakPoint(false);
    setPrExerciseType("none");
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
    setters: {
      setName,
      setSets,
      setReps,
      setWeight,
      setRestTime,
      setNotes,
      setIsWeakPoint,
      setPrExerciseType
    },
    resetForm
  };
};
