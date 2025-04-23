
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface WorkoutControlsProps {
  isLastExercise: boolean;
  onNextExercise: () => void;
  onFinishWorkout: () => void;
  isMobile: boolean;
}

export const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  isLastExercise,
  onNextExercise,
  onFinishWorkout,
  isMobile,
}) => {
  if (isLastExercise) {
    return (
      <Button 
        onClick={onFinishWorkout} 
        className={`${isMobile ? 'w-full' : ''} bg-green-600 hover:bg-green-700 text-white flex items-center justify-center`}
      >
        <CheckCircle2 className="h-4 w-4 mr-2" /> Complete Workout
      </Button>
    );
  }

  return (
    <Button 
      onClick={onNextExercise} 
      className={`${isMobile ? 'w-full' : ''} bg-primary hover:bg-primary/90 flex items-center justify-center`}
    >
      Next Exercise <ChevronRight className="h-4 w-4 ml-2" />
    </Button>
  );
};
