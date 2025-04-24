
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LiftProgressGraph from "@/components/LiftProgressGraph";
import ExerciseProgressTracker from "@/components/ExerciseProgressTracker";
import CorePRTracker from "@/components/CorePRTracker";
import { useAppContext } from "@/context/AppContext";

const WeeklyProgress = () => {
  const { workouts = [] } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>("pr");
  
  // Ensure workouts is an array and each workout has exercises array
  const completedWorkouts = Array.isArray(workouts) 
    ? workouts.filter(w => 
        w?.completed === true && 
        Array.isArray(w?.exercises)
      ) 
    : [];
  
  return (
    <div className="space-y-4">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        defaultValue="pr"
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Progress</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
          <TabsTrigger value="pr">PR Tracker</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <LiftProgressGraph />
        </TabsContent>
        <TabsContent value="exercise">
          <ExerciseProgressTracker />
        </TabsContent>
        <TabsContent value="pr">
          <CorePRTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeeklyProgress;
