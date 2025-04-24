
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Exercise } from "@/types";
import { useExerciseForm } from "@/hooks/useExerciseForm";
import ExerciseBasicInfo from "./exercise-form/ExerciseBasicInfo";
import ExerciseAdvancedInfo from "./exercise-form/ExerciseAdvancedInfo";

interface AddExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  exercise?: Exercise;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  exercise
}) => {
  const { toast } = useToast();
  const { formData, setters, resetForm } = useExerciseForm({ exercise, onClose, onSave });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Exercise name required",
        description: "Please enter an exercise name.",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      id: exercise?.id || uuidv4(),
      name: formData.name.trim(),
      sets: Array(formData.sets).fill({
        reps: formData.reps,
        weight: formData.weight || 0
      }),
      restTime: formData.restTime !== "custom" ? parseInt(formData.restTime) : undefined,
      notes: formData.notes.trim() || undefined,
      lastProgressDate: exercise?.lastProgressDate || new Date(),
      isWeakPoint: formData.isWeakPoint,
      prExerciseType: formData.prExerciseType !== "none" ? formData.prExerciseType : undefined
    };

    onSave(newExercise);
    if (!formData.isEditing) {
      resetForm();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); if (!formData.isEditing) resetForm(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{formData.isEditing ? "Edit Exercise" : "Add Exercise"}</DialogTitle>
          <DialogDescription>
            {formData.isEditing ? "Update the details for this exercise." : "Add a new exercise to your workout."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <ExerciseBasicInfo
            name={formData.name}
            sets={formData.sets}
            reps={formData.reps}
            weight={formData.weight}
            onNameChange={setters.setName}
            onSetsChange={setters.setSets}
            onRepsChange={setters.setReps}
            onWeightChange={setters.setWeight}
          />
          
          <ExerciseAdvancedInfo
            restTime={formData.restTime}
            notes={formData.notes}
            isWeakPoint={formData.isWeakPoint}
            prExerciseType={formData.prExerciseType}
            onRestTimeChange={setters.setRestTime}
            onNotesChange={setters.setNotes}
            onWeakPointChange={setters.setIsWeakPoint}
            onPrExerciseChange={setters.setPrExerciseType}
          />
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {formData.isEditing ? "Update Exercise" : "Save Exercise"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseForm;
