
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CheckCircle, Dumbbell, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import StartWorkoutButton from "./StartWorkoutButton";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Workout } from "@/types";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const navigate = useNavigate();
  const { markWorkoutCompleted, deleteWorkout } = useAppContext();

  const handleWorkoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigate(`/workouts/${workout.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteWorkout(workout.id);
    toast.success("Workout deleted successfully");
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/workouts/builder/${workout.id}`);
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
          <div className="flex gap-2">
            {!workout.completed && (
              <StartWorkoutButton workoutId={workout.id} className="ml-auto" compact />
            )}
            {workout.completed && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-green-500 hover:text-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  markWorkoutCompleted(workout.id);
                }}
              >
                Mark as Incomplete
              </Button>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-red-500 hover:text-red-700"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
