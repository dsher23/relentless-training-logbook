import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CheckCircle, Dumbbell } from "lucide-react";
import { format } from "date-fns";
import StartWorkoutButton from "./StartWorkoutButton";
import { useNavigate } from "react-router-dom";
// Update import to use types from types directory
import { useAppContext } from "@/context/AppContext";
import { Workout } from "@/types";

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const navigate = useNavigate();
  const { markWorkoutCompleted } = useAppContext();

  const handleWorkoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/workouts/${workout.id}`);
  };

  return (
    <Card className="bg-card/90 hover:bg-card/100 transition-colors cursor-pointer" onClick={handleWorkoutClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-tight">{workout.name}</CardTitle>
        {workout.completed ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {workout.date && format(new Date(workout.date), "MMM dd, yyyy")}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span className="text-xs">{workout.exercises?.length || 0} Exercises</span>
          </div>
          {!workout.completed && (
            <StartWorkoutButton workoutId={workout.id} className="ml-auto" compact />
          )}
          {workout.completed && (
            <button
              className="ml-auto text-xs text-green-500 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                markWorkoutCompleted(workout.id);
              }}
            >
              Mark as Incomplete
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
