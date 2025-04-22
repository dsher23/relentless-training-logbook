
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RestTimerProps {
  restTime: number;
  onSkipRest: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ restTime, onSkipRest }) => {
  return (
    <div className="p-4">
      <Card className="border-2 border-primary">
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Rest Time</h2>
          <div className="text-4xl font-bold mb-4">{restTime}s</div>
          <Button 
            variant="outline" 
            onClick={onSkipRest}
          >
            Skip Rest
          </Button>
        </div>
      </Card>
    </div>
  );
};
