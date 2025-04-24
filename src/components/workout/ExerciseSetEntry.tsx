
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface ExerciseSetEntryProps {
  setIndex: number;
  set: { reps: number; weight: number };
  previousSet?: { reps: number; weight: number };
  onUpdateSet: (field: 'reps' | 'weight', value: number) => void;
  onRemoveSet: () => void;
  isMobile?: boolean;
}

export const ExerciseSetEntry: React.FC<ExerciseSetEntryProps> = ({
  setIndex,
  set,
  previousSet,
  onUpdateSet,
  onRemoveSet,
  isMobile = false,
}) => {
  // Initialize with actual values from the set prop
  const [weightInput, setWeightInput] = useState<string>(
    set && set.weight !== undefined ? set.weight.toString() : "0"
  );
  const [repsInput, setRepsInput] = useState<string>(
    set && set.reps !== undefined ? set.reps.toString() : "0"
  );

  // Only update local state when the set prop changes completely (new exercise)
  // This prevents resetting while typing
  useEffect(() => {
    if (set && set.weight !== undefined && set.reps !== undefined) {
      setWeightInput(set.weight.toString());
      setRepsInput(set.reps.toString());
    }
  }, [set]);

  const renderProgressIndicator = () => {
    if (!previousSet) return null;
    
    const prevWeight = previousSet.weight || 0;
    const prevReps = previousSet.reps || 0;
    const currWeight = set?.weight || 0;
    const currReps = set?.reps || 0;
    
    const prevVolume = prevReps * prevWeight;
    const currentVolume = currReps * currWeight;
    
    if (currentVolume > prevVolume) {
      return (
        <div className="flex items-center text-green-500">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span className="text-xs">Progress</span>
        </div>
      );
    } else if (currentVolume < prevVolume) {
      return (
        <div className="flex items-center text-red-500">
          <ArrowDown className="h-4 w-4 mr-1" />
          <span className="text-xs">Regress</span>
        </div>
      );
    }
    return null;
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Update the local state with the input value
    setWeightInput(inputValue);
    
    // Only update the actual set value if the input is a valid number
    if (inputValue === '' || inputValue === null) {
      // Don't update the parent state while typing an empty value
      // This allows users to clear the field and type a new number
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onUpdateSet('weight', numValue);
      }
    }
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Update the local state with the input value
    setRepsInput(inputValue);
    
    // Only update the actual set value if the input is a valid number
    if (inputValue === '' || inputValue === null) {
      // Don't update the parent state while typing an empty value
    } else {
      const numValue = parseInt(inputValue, 10);
      if (!isNaN(numValue)) {
        onUpdateSet('reps', numValue);
      }
    }
  };

  // Validation on blur
  const handleWeightBlur = () => {
    // If the input isn't a valid number, reset to 0
    const value = parseFloat(weightInput);
    if (isNaN(value)) {
      setWeightInput("0");
      onUpdateSet('weight', 0);
    } else {
      // Ensure we update the parent with the final value
      onUpdateSet('weight', value);
    }
  };

  const handleRepsBlur = () => {
    // If the input isn't a valid number, reset to 0
    const value = parseInt(repsInput, 10);
    if (isNaN(value)) {
      setRepsInput("0");
      onUpdateSet('reps', 0);
    } else {
      // Ensure we update the parent with the final value
      onUpdateSet('reps', value);
    }
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-10' : 'grid-cols-12'} gap-2 items-center`}>
      <div className={`${isMobile ? 'col-span-1' : 'col-span-1'} text-sm`}>{setIndex + 1}</div>
      <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>
        <Input 
          type="number"
          value={weightInput}
          onChange={handleWeightChange}
          onBlur={handleWeightBlur}
          className="h-9"
          min="0"
          step="0.5"
          inputMode="decimal"
          aria-label="Weight"
        />
      </div>
      <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>
        <Input 
          type="number"
          value={repsInput}
          onChange={handleRepsChange}
          onBlur={handleRepsBlur}
          className="h-9"
          min="0"
          step="1"
          inputMode="numeric"
          aria-label="Reps"
        />
      </div>
      <div className={`${isMobile ? 'col-span-2' : 'col-span-2'} flex items-center`}>
        {renderProgressIndicator()}
      </div>
      <div className={`${isMobile ? 'col-span-1' : 'col-span-1'}`}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={onRemoveSet}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
