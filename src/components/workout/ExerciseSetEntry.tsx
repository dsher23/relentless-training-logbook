
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
  // Initialize inputs with "0" if no values are provided
  const [weightInput, setWeightInput] = useState<string>((set?.weight ?? 0).toString());
  const [repsInput, setRepsInput] = useState<string>((set?.reps ?? 0).toString());

  // Update local state whenever set prop changes
  useEffect(() => {
    console.log(`Set ${setIndex} updated:`, set);
    setWeightInput((set?.weight ?? 0).toString());
    setRepsInput((set?.reps ?? 0).toString());
  }, [set, setIndex]);

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
    setWeightInput(inputValue);
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRepsInput(inputValue);
  };

  const handleWeightBlur = () => {
    try {
      const value = weightInput === '' ? 0 : parseFloat(weightInput);
      if (!isNaN(value)) {
        onUpdateSet('weight', value);
      } else {
        setWeightInput((set?.weight ?? 0).toString());
      }
    } catch (error) {
      console.error("Error updating weight:", error);
      setWeightInput((set?.weight ?? 0).toString());
    }
  };

  const handleRepsBlur = () => {
    try {
      const value = repsInput === '' ? 0 : parseInt(repsInput, 10);
      if (!isNaN(value)) {
        onUpdateSet('reps', value);
      } else {
        setRepsInput((set?.reps ?? 0).toString());
      }
    } catch (error) {
      console.error("Error updating reps:", error);
      setRepsInput((set?.reps ?? 0).toString());
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
