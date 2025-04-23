
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LiftProgressGraph from "@/components/LiftProgressGraph";
import ExerciseProgressTracker from "@/components/ExerciseProgressTracker";
import { useAppContext } from "@/context/AppContext";

const WeeklyProgress = () => {
  const { workouts } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Use strict equality check for completed === true
  const completedWorkouts = workouts.filter(w => w.completed === true);
  
  return (
    <div className="space-y-4">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        defaultValue="overview"
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="overview">Overall Progress</TabsTrigger>
          <TabsTrigger value="exercise">Exercise Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <LiftProgressGraph />
        </TabsContent>
        <TabsContent value="exercise">
          <ExerciseProgressTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyProgress;
