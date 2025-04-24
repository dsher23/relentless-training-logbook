
import React from 'react';
import { formatDuration } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Play, Pause, Bug, CheckCircle2 } from 'lucide-react';

interface WorkoutHeaderProps {
  workoutName: string;
  workoutTime: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onFinishWorkout: () => void;
  debugMode?: boolean;
  debugInfo?: React.ReactNode;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workoutName,
  workoutTime,
  isTimerRunning,
  onToggleTimer,
  onFinishWorkout,
  debugMode,
  debugInfo
}) => {
  return (
    <div className="bg-background z-10 border-b">
      <div className="flex items-center justify-between p-4">
        <div>
          <div className="text-muted-foreground text-sm">Live Workout</div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={onToggleTimer}
          >
            {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="text-sm font-mono">
            {formatDuration({
              hours: Math.floor(workoutTime / 3600),
              minutes: Math.floor((workoutTime % 3600) / 60),
              seconds: workoutTime % 60
            }).replace(/,/g, '')}
          </div>
          <Button 
            variant="ghost"
            size="sm"
            onClick={onFinishWorkout}
            className="ml-2 text-xs"
          >
            <CheckCircle2 className="h-4 w-4 mr-1" /> Finish
          </Button>
        </div>
      </div>
      
      {debugMode && debugInfo && (
        <div className="px-4 pb-3 text-xs bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded mb-2 border border-yellow-200 dark:border-yellow-800/30">
          <div className="font-bold border-b border-yellow-200 dark:border-yellow-800/30 pb-1 mb-1">
            Debug Information
          </div>
          {debugInfo}
        </div>
      )}
    </div>
  );
};
