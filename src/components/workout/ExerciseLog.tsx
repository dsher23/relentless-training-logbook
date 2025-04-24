import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Timer, Plus } from 'lucide-react';
import { ExerciseSetEntry } from './ExerciseSetEntry';
import { useIsMobile } from '@/hooks/use-mobile';
import { useExerciseMotivation } from '@/hooks/useExerciseMotivation';

interface ExerciseLogProps {
  exercise: {
    id: string;
    name: string;
    sets: { reps: number; weight: number }[];
  };
  previousStats?: { reps: number; weight: number }[];
  notes: string;
  onAddSet: () => void;
  onUpdateSet: (setIndex: number, field: 'reps' | 'weight', value: number) => void;
  onRemoveSet: (setIndex: number) => void;
  onUpdateNotes: (notes: string) => void;
  onStartRest: () => void;
}

export const ExerciseLog: React.FC<ExerciseLogProps> = ({
  exercise,
  previousStats,
  notes,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onUpdateNotes,
  onStartRest,
}) => {
  const isMobile = useIsMobile();
  const { lastWorkoutData, motivationalMessage } = useExerciseMotivation(exercise.name);
  
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">{exercise.name}</h2>
      
      {lastWorkoutData && (
        <div className="mt-1 mb-3">
          <div className="text-sm text-muted-foreground">
            Last time: {lastWorkoutData.weight}kg × {lastWorkoutData.reps}
          </div>
          {motivationalMessage && (
            <div className="text-sm font-medium text-primary mt-1">
              {motivationalMessage}
            </div>
          )}
        </div>
      )}
      
      {previousStats && previousStats.length > 0 && (
        <div className="bg-muted/50 p-3 rounded-lg mb-4">
          <h3 className="text-sm font-medium mb-2">Previous Session</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="font-medium">Set</div>
            <div className="font-medium">Weight</div>
            <div className="font-medium">Reps</div>
            {previousStats.map((set, idx) => (
              <React.Fragment key={`prev-${idx}`}>
                <div>{idx + 1}</div>
                <div>{set.weight}</div>
                <div>{set.reps}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        <div className={`grid ${isMobile ? 'grid-cols-10' : 'grid-cols-12'} gap-2 text-sm font-medium`}>
          <div className={`${isMobile ? 'col-span-1' : 'col-span-1'}`}>Set</div>
          <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>Weight</div>
          <div className={`${isMobile ? 'col-span-3' : 'col-span-4'}`}>Reps</div>
          <div className={`${isMobile ? 'col-span-3' : 'col-span-3'}`}>Progress</div>
        </div>
        
        {exercise.sets && exercise.sets.length > 0 ? (
          exercise.sets.map((set, idx) => (
            <ExerciseSetEntry
              key={`set-${idx}`}
              setIndex={idx}
              set={set}
              previousSet={previousStats && previousStats[idx]}
              onUpdateSet={(field, value) => onUpdateSet(idx, field, value)}
              onRemoveSet={() => onRemoveSet(idx)}
              isMobile={isMobile}
            />
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No sets added yet. Click "Add Set" below to get started.
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAddSet}
            className={`${isMobile ? 'flex-1' : ''}`}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Set
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onStartRest}
            className={`${isMobile ? 'flex-1' : ''}`}
          >
            <Timer className="h-4 w-4 mr-1" /> Start Rest
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Notes</h3>
        <Textarea 
          placeholder="How did this exercise feel?"
          value={notes || ""}
          onChange={(e) => onUpdateNotes(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};
