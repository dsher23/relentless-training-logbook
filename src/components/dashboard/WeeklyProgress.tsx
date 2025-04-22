
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import WeeklyLiftsGraph from "@/components/WeeklyLiftsGraph";

const WeeklyProgress = () => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <WeeklyLiftsGraph currentDate={new Date()} />
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
