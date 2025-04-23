
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import WeeklyLiftsGraph from "@/components/WeeklyLiftsGraph";
import { useAppContext } from "@/context/AppContext";

const WeeklyProgress = () => {
  const { workouts } = useAppContext();
  const completedWorkouts = workouts.filter(w => w.completed === true);
  
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
