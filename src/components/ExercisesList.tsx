
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/types";

interface ExercisesListProps {
  exercises: Exercise[];
  onAddExercise: () => void;
  onEditExercise: (exerciseId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
}

const ExercisesList: React.FC<ExercisesListProps> = ({
  exercises,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
}) => {
  if (exercises.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">No exercises added yet</p>
          <Button onClick={onAddExercise}>
            <Plus className="h-4 w-4 mr-1" /> Add Your First Exercise
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium flex items-center gap-2">
                  🏋️ {exercise.name}
                  {exercise.isWeakPoint && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                      Weak Point
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {exercise.sets.length} sets × {exercise.sets[0]?.reps || 0} reps
                  {exercise.sets[0]?.weight ? ` × ${exercise.sets[0].weight}kg` : ''}
                  {exercise.restTime ? ` – Rest: ${exercise.restTime}s` : ''}
                </div>
                {exercise.notes && (
                  <div className="text-xs text-muted-foreground mt-1 italic">
                    📝 Notes: {exercise.notes}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onEditExercise(exercise.id)}
                >
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDeleteExercise(exercise.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExercisesList;
