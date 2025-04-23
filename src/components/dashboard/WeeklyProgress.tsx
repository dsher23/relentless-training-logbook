
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LiftProgressGraph from "@/components/LiftProgressGraph";
import { useAppContext } from "@/context/AppContext";

const WeeklyProgress = () => {
  const { workouts } = useAppContext();
  
  // Use strict equality check for completed === true
  const completedWorkouts = workouts.filter(w => w.completed === true);
  
  return (
    <div className="space-y-4">
      <LiftProgressGraph />
    </div>
  );
};

export default WeeklyProgress;
