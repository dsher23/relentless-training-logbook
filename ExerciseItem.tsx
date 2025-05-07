
import React from 'react';
import { Exercise } from '@/types';

interface ExerciseItemProps {
  exercise: Exercise;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  return (
    <li className="px-4 py-3">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">{exercise.name}</h4>
          <p className="text-xs text-muted-foreground">
            {exercise.sets?.length > 0 ? 
              `${exercise.sets.length} sets` : 
              `${exercise.reps} reps`}
          </p>
        </div>
        <div className="text-sm">
          {exercise.weight ? `${exercise.weight} ${exercise.category}` : exercise.category}
        </div>
      </div>
    </li>
  );
};

export default ExerciseItem;
