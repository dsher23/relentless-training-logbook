
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProgressMetrics {
  weightChange: number;
  weightPercentage: number;
  volumeChange: number;
  volumePercentage: number;
  oneRMChange: number;
  oneRMPercentage: number;
  timespan: string;
}

interface PersonalRecords {
  maxWeight: number;
  maxVolume: number;
  maxReps: number;
  maxOneRM: number;
}

interface ExerciseStatsProps {
  progressMetrics?: ProgressMetrics | null;
  personalRecords?: PersonalRecords | null;
}

export const ExerciseStats: React.FC<ExerciseStatsProps> = ({
  progressMetrics,
  personalRecords,
}) => {
  if (!progressMetrics && !personalRecords) return null;

  return (
    <div className="space-y-4">
      {progressMetrics && (
        <div className="mb-4 p-3 rounded-md bg-muted/50">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Weight</p>
              <Badge 
                variant={progressMetrics.weightChange > 0 ? "default" : "destructive"} 
                className={`mt-1 text-xs ${progressMetrics.weightChange > 0 ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                {progressMetrics.weightChange > 0 ? "+" : ""}
                {progressMetrics.weightChange} kg ({progressMetrics.weightPercentage.toFixed(1)}%)
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Est. 1RM</p>
              <Badge 
                variant={progressMetrics.oneRMChange > 0 ? "default" : "destructive"}
                className={`mt-1 text-xs ${progressMetrics.oneRMChange > 0 ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                {progressMetrics.oneRMChange > 0 ? "+" : ""}
                {progressMetrics.oneRMChange.toFixed(1)} kg ({progressMetrics.oneRMPercentage.toFixed(1)}%)
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Timespan</p>
              <p className="text-xs font-medium mt-1">{progressMetrics.timespan}</p>
            </div>
          </div>
        </div>
      )}
      
      {personalRecords && (
        <div className="flex justify-between text-xs">
          <div className="text-center">
            <p className="text-muted-foreground">Max Weight</p>
            <p className="font-medium">{personalRecords.maxWeight} kg</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Est. 1RM</p>
            <p className="font-medium">{personalRecords.maxOneRM.toFixed(1)} kg</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Max Volume</p>
            <p className="font-medium">{personalRecords.maxVolume} kg</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Max Reps</p>
            <p className="font-medium">{personalRecords.maxReps}</p>
          </div>
        </div>
      )}
    </div>
  );
};
