
import React from "react";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout } from "@/context/AppContext";

interface WorkoutCardProps {
  workout: Workout;
  onClick?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick }) => {
  return (
    <Card 
      className={`mb-4 overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-secondary">
        <div className="flex items-center space-x-2">
          <Dumbbell className="w-5 h-5 text-gym-purple" />
          <CardTitle className="text-lg font-medium">{workout.name}</CardTitle>
        </div>
        <span className="text-sm text-muted-foreground">
          {format(new Date(workout.date), "MMM d, yyyy")}
        </span>
      </CardHeader>
      <CardContent className="p-4">
        <div>
          <div className="text-sm mb-2">
            {workout.exercises.length} exercises · {workout.exercises.reduce(
              (total, ex) => total + ex.sets.length, 0
            )} total sets
          </div>
          <div className="flex flex-wrap gap-2">
            {workout.exercises.slice(0, 3).map((exercise) => (
              <span key={exercise.id} className="text-xs px-2 py-1 bg-secondary rounded-full">
                {exercise.name}
              </span>
            ))}
            {workout.exercises.length > 3 && (
              <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                +{workout.exercises.length - 3} more
              </span>
            )}
          </div>
          {workout.notes && (
            <div className="mt-4 text-sm text-muted-foreground border-t pt-2">
              <p className="line-clamp-2">{workout.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
