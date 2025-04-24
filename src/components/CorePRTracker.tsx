
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { calculateOneRepMax } from "@/utils/numberUtils";
import { format } from "date-fns";

const CORE_LIFTS = [
  { id: "bench-press", name: "Bench Press" },
  { id: "deadlift", name: "Deadlift" },
  { id: "squat", name: "Squat" },
  { id: "shoulder-press", name: "Shoulder Press" },
];

const CorePRTracker: React.FC = () => {
  const navigate = useNavigate();
  const { workouts } = useAppContext();
  const [selectedLift, setSelectedLift] = useState<string>("bench-press");
  const [prData, setPrData] = useState<{
    weight: number;
    reps: number;
    oneRM: number;
    date: string;
  } | null>(null);

  useEffect(() => {
    if (!workouts || !Array.isArray(workouts)) return;

    const completedWorkouts = workouts.filter(w => w.completed === true);
    
    let bestOneRM = 0;
    let bestSet = null;
    let bestWorkoutDate = null;

    completedWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const liftName = CORE_LIFTS.find(l => l.id === selectedLift)?.name || "";
        if (exercise.name.toLowerCase().includes(liftName.toLowerCase())) {
          exercise.sets?.forEach(set => {
            const weight = Number(set.weight);
            const reps = Number(set.reps);
            const oneRM = calculateOneRepMax(weight, reps);
            
            if (oneRM > bestOneRM) {
              bestOneRM = oneRM;
              bestSet = set;
              bestWorkoutDate = workout.date;
            }
          });
        }
      });
    });

    if (bestSet && bestWorkoutDate) {
      setPrData({
        weight: Number(bestSet.weight),
        reps: Number(bestSet.reps),
        oneRM: bestOneRM,
        date: format(new Date(bestWorkoutDate), "MMM d, yyyy")
      });
    } else {
      setPrData(null);
    }
  }, [workouts, selectedLift]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="core-lift">Core Lift PR Tracker</Label>
            <Select 
              value={selectedLift}
              onValueChange={setSelectedLift}
            >
              <SelectTrigger id="core-lift" className="w-full">
                <SelectValue placeholder="Select lift" />
              </SelectTrigger>
              <SelectContent>
                {CORE_LIFTS.map(lift => (
                  <SelectItem key={lift.id} value={lift.id}>
                    {lift.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {prData ? (
            <div className="pt-2">
              <h3 className="font-medium text-lg">{CORE_LIFTS.find(l => l.id === selectedLift)?.name} PR</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-secondary/30 p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Top Set</p>
                  <p className="font-medium">{prData.weight}kg × {prData.reps}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Est. 1RM</p>
                  <p className="font-medium">{prData.oneRM.toFixed(1)}kg</p>
                </div>
                <div className="col-span-2 text-xs text-center text-muted-foreground">
                  Achieved on {prData.date}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No data available for this lift</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => navigate('/workouts/new')}
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
