
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Edit, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import StartWorkoutButton from "@/components/StartWorkoutButton";
import { useAppContext } from "@/context/AppContext";

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workouts } = useAppContext();
  
  const workout = workouts.find(w => w.id === id);
  
  if (!workout) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Workout Not Found" />
        <div className="p-4 text-center">
          <p className="mb-4">The workout you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/workouts")}>
            Back to Workouts
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title={workout.name} />
      
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Details</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{format(new Date(workout.date), "PPP")}</span>
              </div>
              
              {workout.notes && (
                <div className="pt-2 border-t mt-2">
                  <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                  <p className="text-sm">{workout.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Exercises</h2>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Add Exercise
            </Button>
          </div>
          
          {workout.exercises.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">No exercises added yet</p>
                <Button>
                  <Plus className="h-4 w-4 mr-1" /> Add Your First Exercise
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {workout.exercises.map((exercise) => (
                <Card key={exercise.id}>
                  <CardContent className="p-3">
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets.length} sets
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t">
          <StartWorkoutButton workoutId={workout.id} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
