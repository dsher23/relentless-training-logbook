
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";

const WorkoutTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { workouts } = useAppContext();

  // Filter to get only routine workouts (ones that are templates and not completed)
  const routines = workouts.filter(workout => !workout.completed && workout.isRoutine);

  return (
    <div className="app-container animate-fade-in">
      <div className="sticky top-0 bg-background z-10 border-b">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Start Workout</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Select Workout Type</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <Button
              onClick={() => navigate("/workouts/new")}
              size="lg"
              className="h-auto py-6 bg-gym-blue text-white justify-start"
            >
              <Plus className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Custom Workout</div>
                <div className="text-xs opacity-80">Create a new workout from scratch</div>
              </div>
            </Button>
          </div>
        </div>

        {routines.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Saved Routines <span className="text-sm font-normal text-muted-foreground ml-2">({routines.length})</span>
            </h2>
            
            <div className="space-y-3">
              {routines.map(routine => (
                <Card 
                  key={routine.id} 
                  className="hover:border-primary cursor-pointer transition-colors"
                  onClick={() => navigate(`/workouts/${routine.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{routine.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {routine.exercises.length} exercises
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gym-blue text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/workouts/${routine.id}/live`);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {routines.length === 0 && (
          <div className="text-center p-6 border rounded-lg border-dashed">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">No Saved Routines</h3>
            <p className="text-muted-foreground mb-4">
              Create and save workout routines for quick access.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate("/workouts/new")}
            >
              Create Your First Routine
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTypeSelection;
