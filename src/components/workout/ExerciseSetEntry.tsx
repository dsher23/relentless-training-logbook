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
  const [localWeight, setLocalWeight] = useState(set.weight.toString());
  const [localReps, setLocalReps] = useState(set.reps.toString());

  useEffect(() => {
    setLocalWeight(set.weight.toString());
    setLocalReps(set.reps.toString());
  }, [set.weight, set.reps]);

  const handleBlur = (field: 'weight' | 'reps') => {
    const value = field === 'weight' ? parseFloat(localWeight) : parseInt(localReps);
    const fallback = 0;

    if (!isNaN(value)) {
      onUpdateSet(field, value);
    } else {
      onUpdateSet(field, fallback);
      field === 'weight' ? setLocalWeight(fallback.toString()) : setLocalReps(fallback.toString());
    }
  };

  const progress = () => {
    if (!previousSet) return null;

    const prev = previousSet.weight * previousSet.reps;
    const curr = set.weight * set.reps;

    if (curr > prev) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (curr < prev) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-10' : 'grid-cols-12'} gap-2 items-center`}>
      <div className={`${isMobile ? 'col-span-1' : 'col-span-1'} text-sm`}>{setIndex + 1}</div>
      <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>
        <Input
          type="number"
          value={localWeight}
          onChange={(e) => setLocalWeight(e.target.value)}
          onBlur={() => handleBlur('weight')}
          className="h-9"
          inputMode="decimal"
        />
      </div>
      <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>
        <Input
          type="number"
          value={localReps}
          onChange={(e) => setLocalReps(e.target.value)}
          onBlur={() => handleBlur('reps')}
          className="h-9"
          inputMode="numeric"
        />
      </div>
      <div className={`${isMobile ? 'col-span-2' : 'col-span-2'} flex items-center`}>
        {progress()}
      </div>
      <div className={`${isMobile ? 'col-span-1' : 'col-span-1'}`}>
        <Button variant="ghost" size="icon" onClick={onRemoveSet}>
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
