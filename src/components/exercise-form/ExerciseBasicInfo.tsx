
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CORE_LIFTS } from "@/hooks/useExercises";

interface ExerciseBasicInfoProps {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  prExerciseType?: string;
  onNameChange: (value: string) => void;
  onSetsChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onWeightChange: (value: number | undefined) => void;
  onPrExerciseChange?: (value: string) => void;
}

const ExerciseBasicInfo: React.FC<ExerciseBasicInfoProps> = ({
  name,
  sets,
  reps,
  weight,
  prExerciseType = "none",
  onNameChange,
  onSetsChange,
  onRepsChange,
  onWeightChange,
  onPrExerciseChange,
}) => {
  // Use the CORE_LIFTS constant imported from useExercises
  const LIFT_OPTIONS = [
    { id: "none", name: "Not tracked as PR" },
    ...CORE_LIFTS,
    { id: "custom", name: "Custom Exercise" },
  ];

  // Handle PR exercise selection
  const handlePrExerciseChange = (value: string) => {
    if (onPrExerciseChange) {
      onPrExerciseChange(value);
      
      // If a predefined lift is selected (and not custom or none), update the name field
      if (value !== "none" && value !== "custom") {
        const selectedLift = LIFT_OPTIONS.find(lift => lift.id === value);
        if (selectedLift) {
          onNameChange(selectedLift.name);
        }
      }
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pr-exercise">PR Exercise Type</Label>
          <Select
            value={prExerciseType}
            onValueChange={handlePrExerciseChange}
          >
            <SelectTrigger id="pr-exercise">
              <SelectValue placeholder="Select PR type (optional)" />
            </SelectTrigger>
            <SelectContent>
              {LIFT_OPTIONS.map((lift) => (
                <SelectItem key={lift.id} value={lift.id}>
                  {lift.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
