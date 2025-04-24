
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { calculateOneRepMax } from "@/utils/numberUtils";
import { format } from "date-fns";
import { ChevronDown, ExternalLink, Trophy } from "lucide-react";
import { ProgressChart } from "@/components/ProgressChart";  // Updated import path
import { useExercises } from "@/hooks/useExercises";

const CorePRTracker: React.FC = () => {
  const navigate = useNavigate();
  const { workouts } = useAppContext();
  const { customExercises, CORE_LIFTS } = useExercises();
  const [selectedLift, setSelectedLift] = useState<string>("bench-press");
  const [prData, setPrData] = useState<{
    weight: number;
    reps: number;
    oneRM: number;
    date: string;
    workoutId: string;
  } | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const prExerciseOptions = [
    { id: "bench-press", name: "Bench Press" },
    { id: "deadlift", name: "Deadlift" },
    { id: "squat", name: "Squat" },
    { id: "shoulder-press", name: "Shoulder Press" },
    // Add custom PR types dynamically
    ...customExercises
      .filter(ex => ex.isPrRelevant && ex.prExerciseType === "custom")
      .map(ex => ({ id: `custom-${ex.name}`, name: ex.name }))
  ];

  useEffect(() => {
    // Ensure workouts is an array
    if (!workouts || !Array.isArray(workouts)) return;

    const completedWorkouts = workouts.filter(w => w?.completed === true);
    
    let bestOneRM = 0;
    let bestSet = null;
    let bestWorkoutDate = null;
    let bestWorkoutId = null;
    const historyData: any[] = [];

    (completedWorkouts || []).forEach(workout => {
      // Ensure exercises is an array
      if (!workout?.exercises || !Array.isArray(workout.exercises)) return;
      
      workout.exercises.forEach(exercise => {
        // Handle custom PR types
        const isCustomPR = selectedLift.startsWith('custom-');
        const customExerciseName = isCustomPR ? selectedLift.replace('custom-', '') : '';
        
        // Match by PR exercise type first, or by name if type not available
        const isPRMatch = (exercise.prExerciseType === selectedLift) || 
          (!exercise.prExerciseType && 
           exercise.name.toLowerCase().includes(
             (prExerciseOptions.find(l => l.id === selectedLift)?.name || "").toLowerCase()
           )) ||
           (isCustomPR && exercise.name === customExerciseName);
        
        if (isPRMatch) {
          let bestSetInExercise = null;
          let bestOneRMInExercise = 0;
          
          // Ensure sets is an array
          if (!exercise?.sets || !Array.isArray(exercise.sets)) return;
          
          exercise.sets.forEach(set => {
            const weight = Number(set?.weight);
            const reps = Number(set?.reps);
            const oneRM = calculateOneRepMax(weight, reps);
            
            if (oneRM > bestOneRMInExercise) {
              bestOneRMInExercise = oneRM;
              bestSetInExercise = set;
            }
          });
          
          if (bestSetInExercise) {
            const weight = Number(bestSetInExercise.weight);
            const reps = Number(bestSetInExercise.reps);
            const oneRM = calculateOneRepMax(weight, reps);
            
            historyData.push({
              date: format(new Date(workout.date), "MM/dd/yy"),
              fullData: {
                weight: weight,
                reps: reps,
                volume: weight * reps,
                notes: exercise.notes || ""
              },
              "Top Set": weight,
              "Reps": reps,
              "Volume": weight * reps,
              estimatedOneRM: oneRM,
              workoutId: workout.id
            });
            
            if (oneRM > bestOneRM) {
              bestOneRM = oneRM;
              bestSet = bestSetInExercise;
              bestWorkoutDate = workout.date;
              bestWorkoutId = workout.id;
            }
          }
        }
      });
    });

    // Sort history data by date
    historyData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    setChartData(historyData);

    if (bestSet && bestWorkoutDate && bestWorkoutId) {
      setPrData({
        weight: Number(bestSet.weight),
        reps: Number(bestSet.reps),
        oneRM: bestOneRM,
        date: format(new Date(bestWorkoutDate), "MMM d, yyyy"),
        workoutId: bestWorkoutId
      });
    } else {
      setPrData(null);
    }
  }, [workouts, selectedLift, prExerciseOptions]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-base">
          <span>Core Lift PR Tracker</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                {prExerciseOptions.find(l => l.id === selectedLift)?.name || "Select lift"}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {prExerciseOptions.map(lift => (
                <DropdownMenuItem 
                  key={lift.id}
                  onClick={() => setSelectedLift(lift.id)}
                >
                  {lift.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {prData ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-lg flex items-center">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                    {prExerciseOptions.find(l => l.id === selectedLift)?.name} PR
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Achieved on {prData.date}
                  </p>
                </div>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/workouts/${prData.workoutId}`)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" /> View Workout
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-secondary/30 p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Top Set</p>
                  <p className="font-medium text-lg">{prData.weight}kg × {prData.reps}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Est. 1RM</p>
                  <p className="font-medium text-lg">{prData.oneRM.toFixed(1)}kg</p>
                </div>
              </div>
              
              <div className="h-64">
                {chartData.length > 0 && (
                  <ProgressChart 
                    data={chartData}
                    displayMode="topSet"
                    maxValue={prData.weight}
                    yAxisLabel="Weight (kg)"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No data available for this lift</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => navigate('/workout-selection')}
              >
                Log a Workout
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorePRTracker;
