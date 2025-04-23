
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import WeeklyLiftsGraph from "@/components/WeeklyLiftsGraph";
import { useAppContext } from "@/context/AppContext";

const WeeklyProgress = () => {
  const { workouts } = useAppContext();
  
  // Use strict equality check for completed === true
  const completedWorkouts = workouts.filter(w => w.completed === true);
  
  // Add logging to help debug
  useEffect(() => {
    console.log("WeeklyProgress - Total workouts:", workouts.length);
    console.log("WeeklyProgress - Completed workouts:", completedWorkouts.length);
    console.log("WeeklyProgress - Completed workout IDs:", completedWorkouts.map(w => w.id));
    console.log("WeeklyProgress - Sample workout completion status:", 
      workouts.length > 0 ? workouts[0].completed : "no workouts");
  }, [workouts, completedWorkouts]);
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        {completedWorkouts.length > 0 ? (
          <WeeklyLiftsGraph currentDate={new Date()} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No completed workouts yet. Complete a workout to see your progress here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
