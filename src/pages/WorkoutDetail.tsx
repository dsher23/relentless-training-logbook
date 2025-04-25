
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Plus, Dumbbell } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Exercise, Workout, WorkoutTemplate } from "@/types";
import ExerciseItem from "@/components/ExerciseItem";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workouts, workoutTemplates, getWorkoutById, addWorkoutTemplate, addExercise } = useAppContext();
  const [workout, setWorkout] = useState<Workout | WorkoutTemplate | undefined>(undefined);
  
  useEffect(() => {
    if (id) {
      const existingWorkout = getWorkoutById(id);
      if (existingWorkout) {
        setWorkout(existingWorkout);
      } else {
        const existingTemplate = workoutTemplates.find(t => t.id === id);
        setWorkout(existingTemplate);
      }
    }
  }, [id, workouts, workoutTemplates, getWorkoutById]);
  
  if (!workout) {
    return <div className="p-4">Workout not found</div>;
  }

  // Ensure the workout has the required properties to be treated as a WorkoutTemplate
  const handleDuplicateAsRoutine = () => {
    if (!workout) return;
    
    const template: WorkoutTemplate = {
      id: uuidv4(),
      name: `${workout.name} (Copy)`,
      exercises: workout.exercises || [], // Provide a default empty array if exercises is undefined
      isFavorite: false,
      scheduledTime: workout.scheduledTime
    };
    
    addWorkoutTemplate(template);
    toast.success("Workout duplicated as a routine");
    navigate("/workouts");
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">{workout.name}</h1>
            {'date' in workout && workout.date && (
              <p className="text-sm text-muted-foreground">
                {format(new Date(workout.date), "MMM d, yyyy")}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/workouts/builder/${workout.id}`)}>
              <List className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleDuplicateAsRoutine}>
              Duplicate as Routine
            </Button>
          </div>
        </div>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {workout.exercises && workout.exercises.length > 0 ? (
              <ul className="divide-y divide-border">
                {workout.exercises.map((exercise) => (
                  <ExerciseItem key={exercise.id} exercise={exercise} />
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No exercises in this workout.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Button onClick={() => navigate(`/workouts/builder/${workout.id}`)} className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple">
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </div>
    </div>
  );
};

export default WorkoutDetail;
