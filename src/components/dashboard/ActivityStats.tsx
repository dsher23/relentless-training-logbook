
import React from "react";
import { Link } from "react-router-dom";
import { Ruler, PillIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";

const ActivityStats = () => {
  const { bodyMeasurements, supplements } = useAppContext();

  // Get the latest measurement date
  const latestMeasurement = bodyMeasurements.length > 0
    ? [...bodyMeasurements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  
  const latestMeasurementDate = latestMeasurement 
    ? new Date(latestMeasurement.date).toLocaleDateString() 
    : "No data";
  
  const measurementCount = bodyMeasurements.length;
  const supplementCount = supplements.length;

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <Link to="/measurements" className="h-full">
        <Card className="transition-all hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
          <CardContent className="p-4 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-5 w-5 text-gym-purple" />
              <h3 className="font-medium text-base">Measurements Tracker</h3>
            </div>
            <div className="text-2xl font-bold mt-auto">{measurementCount}</div>
            <div className="text-sm text-muted-foreground">Last: {latestMeasurementDate}</div>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/supplements" className="h-full">
        <Card className="transition-all hover:shadow-md hover:-translate-y-1 h-full flex flex-col">
          <CardContent className="p-4 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <PillIcon className="h-5 w-5 text-gym-purple" />
              <h3 className="font-medium text-base">Supplements Tracker</h3>
            </div>
            <div className="text-2xl font-bold mt-auto">{supplementCount}</div>
            <div className="text-sm text-muted-foreground">Active Supplements</div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default ActivityStats;

