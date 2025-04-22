
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormItem } from "@/components/ui/form";

interface ExerciseBasicInfoProps {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  onNameChange: (value: string) => void;
  onSetsChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onWeightChange: (value: number | undefined) => void;
}

const ExerciseBasicInfo: React.FC<ExerciseBasicInfoProps> = ({
  name,
  sets,
  reps,
  weight,
  onNameChange,
  onSetsChange,
  onRepsChange,
  onWeightChange,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="exercise-name">Exercise Name*</Label>
        <Input 
          id="exercise-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Bench Press"
          autoFocus
        />
      </div>
          
      <div className="grid grid-cols-2 gap-4">
        <FormItem className="space-y-2">
          <Label htmlFor="sets">Sets</Label>
          <Input 
            id="sets"
            type="number"
            min="1"
            value={sets}
            onChange={(e) => onSetsChange(parseInt(e.target.value) || 1)}
          />
        </FormItem>
        
        <FormItem className="space-y-2">
          <Label htmlFor="reps">Reps Per Set</Label>
          <Input 
            id="reps"
            type="number"
            min="1"
            value={reps}
            onChange={(e) => onRepsChange(parseInt(e.target.value) || 1)}
          />
        </FormItem>
      </div>
      
      <FormItem className="space-y-2">
        <Label htmlFor="weight">Target Weight (kg/lb)</Label>
        <Input 
          id="weight"
          type="number"
          min="0"
          step="0.5"
          value={weight === undefined ? "" : weight}
          onChange={(e) => onWeightChange(e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="Optional"
        />
      </FormItem>
    </>
  );
};

export default ExerciseBasicInfo;
