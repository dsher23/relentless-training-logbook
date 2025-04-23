
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface ExerciseSetEntryProps {
  setIndex: number;
  set: { reps: number; weight: number };
  previousSet?: { reps: number; weight: number };
  onUpdateSet: (field: 'reps' | 'weight', value: number) => void;
  onRemoveSet: () => void;
}

export const ExerciseSetEntry: React.FC<ExerciseSetEntryProps> = ({
  setIndex,
  set,
  previousSet,
  onUpdateSet,
  onRemoveSet,
}) => {
  const renderProgressIndicator = () => {
    if (!previousSet) return null;
    
    const prevVolume = previousSet.reps * previousSet.weight;
    const currentVolume = set.reps * set.weight;
    
    if (currentVolume > prevVolume) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (currentVolume < prevVolume) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
    if (!isNaN(value)) {
      onUpdateSet('weight', value);
    }
  };

  const handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      onUpdateSet('reps', value);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-1 text-sm">{setIndex + 1}</div>
      <div className="col-span-4">
        <Input 
          type="number"
          value={set.weight || ''}
          onChange={handleWeightChange}
          className="h-9"
          min="0"
          step="0.5"
          inputMode="decimal"
        />
      </div>
      <div className="col-span-4">
        <Input 
          type="number"
          value={set.reps || ''}
          onChange={handleRepsChange}
          className="h-9"
          min="0"
          step="1"
          inputMode="numeric"
        />
      </div>
      <div className="col-span-2 flex items-center">
        {renderProgressIndicator()}
      </div>
      <div className="col-span-1">
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
