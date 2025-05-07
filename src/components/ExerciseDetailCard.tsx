
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Exercise } from "@/types";

interface ExerciseDetailCardProps {
  exercise: Exercise;
  onEdit?: () => void;
}

const ExerciseDetailCard: React.FC<ExerciseDetailCardProps> = ({ 
  exercise,
  onEdit 
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-full">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{exercise.name}</h3>
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onEdit}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-medium">Set</div>
              <div className="font-medium">Weight</div>
              <div className="font-medium">Reps</div>
              
              {exercise.sets.map((set, idx) => (
                <React.Fragment key={idx}>
                  <div>{idx + 1}</div>
                  <div>{set.weight}</div>
                  <div>{set.reps}</div>
                </React.Fragment>
              ))}
            </div>
            
            {exercise.notes && (
              <div className="mt-2 pt-2 border-t text-sm">
                <span className="text-muted-foreground">Notes:</span> {exercise.notes}
              </div>
            )}
            
            {exercise.restTime && (
              <div className="text-xs text-muted-foreground mt-1">
                Rest time between sets: {exercise.restTime}s
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseDetailCard;
