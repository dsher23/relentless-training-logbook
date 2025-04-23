
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Timer } from 'lucide-react';

interface RestTimerProps {
  restTime: number;
  initialRestTime: number;
  onSkipRest: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ 
  restTime, 
  initialRestTime, 
  onSkipRest 
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.max(0, Math.min(100, (restTime / initialRestTime) * 100));
  
  return (
    <div className="p-4">
      <Card className="border-2 border-primary">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-lg font-semibold">Resting...</h2>
          </div>
          
          <div className="text-4xl font-bold mb-4">{restTime}s</div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2 mb-6" 
          />
          
          <Button 
            variant="default" 
            onClick={onSkipRest}
            className="w-full"
          >
            End Rest
          </Button>
        </div>
      </Card>
    </div>
  );
};
