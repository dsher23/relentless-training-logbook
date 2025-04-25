import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Trophy, Clock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Exercise } from "@/types";
import { formatDuration } from "date-fns";

// Define an extended Exercise type with the properties we need
interface ExtendedExercise extends Exercise {
  notes?: string;
}

const WorkoutSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { duration, exercises, previousStats } = location.state || { 
    duration: 0, 
    exercises: [], 
    previousStats: {} 
  };

  const totalVolume = exercises.reduce((total: number, exercise: ExtendedExercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      return setTotal + (set.reps * set.weight);
    }, 0);
    return total + exerciseVolume;
  }, 0);

  const prs = exercises.map((exercise: ExtendedExercise) => {
    const prevExerciseSets = previousStats[exercise.id];
    if (!prevExerciseSets) return null;
    
    const prevBestSet = [...prevExerciseSets].sort((a, b) => 
      (b.reps * b.weight) - (a.reps * a.weight)
    )[0];
    
    const currentBestSet = [...exercise.sets].sort((a, b) => 
      (b.reps * b.weight) - (a.reps * a.weight)
    )[0];
    
    if (!currentBestSet || !prevBestSet) return null;
    
    const prevVolume = prevBestSet.reps * prevBestSet.weight;
    const currentVolume = currentBestSet.reps * currentBestSet.weight;
    
    if (currentVolume > prevVolume) {
      return {
        name: exercise.name,
        improvement: `${currentBestSet.weight}kg × ${currentBestSet.reps} (${currentVolume - prevVolume}kg more volume)`
      };
    }
    
    return null;
  }).filter(Boolean);

  return (
    <div className="app-container animate-fade-in pb-8">
      <div className="p-4 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => navigate("/workouts")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Workout Complete</h1>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center border rounded-lg p-4">
                <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="font-bold">
                  {formatDuration({
                    hours: Math.floor(duration / 3600),
                    minutes: Math.floor((duration % 3600) / 60),
                    seconds: duration % 60
                  }).replace(/,/g, '')}
                </div>
              </div>
              
              <div className="text-center border rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">
                  {new Intl.NumberFormat().format(totalVolume)}
                </div>
                <div className="text-xs text-muted-foreground">Total Volume (kg)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {prs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h2 className="font-semibold">Personal Records</h2>
            </div>
            
            <div className="space-y-2">
              {prs.map((pr, idx) => (
                <div key={idx} className="border rounded-lg p-3">
                  <div className="font-medium">{pr?.name}</div>
                  <div className="text-sm text-muted-foreground">{pr?.improvement}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <h2 className="font-semibold">Exercise Summary</h2>
          
          {exercises.map((exercise: ExtendedExercise) => (
            <div key={exercise.id} className="border rounded-lg p-3">
              <div className="font-medium">{exercise.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {exercise.sets.length} sets • {
                  exercise.sets.reduce((total, set) => total + set.reps, 0)
                } total reps
              </div>
              
              {exercise.notes && (
                <div className="mt-2 text-sm bg-muted/30 p-2 rounded-md">
                  {exercise.notes}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="pt-4 flex">
          <Button 
            className="w-full" 
            onClick={() => navigate("/workouts")}
          >
            Back to Workouts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSummary;
