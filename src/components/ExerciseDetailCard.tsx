
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/types";

interface ExerciseDetailCardProps {
  exercise: Exercise;
}

const ExerciseDetailCard: React.FC<ExerciseDetailCardProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="mb-3">
      <CardHeader className="p-3 pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{exercise.name}</CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="p-3 pt-0">
          <div className="text-sm">
            <div className="grid grid-cols-4 gap-2 font-medium text-muted-foreground mb-2">
              <div>Set</div>
              <div>Weight</div>
              <div>Reps</div>
              <div>Volume</div>
            </div>
            
            {exercise.sets.map((set, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-1 border-b border-muted py-1">
                <div>{index + 1}</div>
                <div>{set.weight}</div>
                <div>{set.reps}</div>
                <div>{(set.weight * set.reps).toFixed(1)}</div>
              </div>
            ))}
            
            {exercise.restTime && (
              <div className="mt-2 text-xs text-muted-foreground">
                Rest Time: {exercise.restTime} seconds
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExerciseDetailCard;
