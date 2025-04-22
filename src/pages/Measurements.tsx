
import React, { useState } from "react";
import { format } from "date-fns";
import { Ruler, Camera, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProgressChart from "@/components/ProgressChart";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";

const Measurements: React.FC = () => {
  const { bodyMeasurements } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Sort measurements by date (newest first)
  const sortedMeasurements = [...bodyMeasurements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Latest measurement
  const latestMeasurement = sortedMeasurements[0];
  
  // Prepare chart data
  const weightData = sortedMeasurements
    .slice()
    .reverse()
    .map(m => ({
      date: format(new Date(m.date), "MM/dd"),
      value: m.weight || 0
    }));
  
  const measurementFields = [
    { key: 'weight', label: 'Weight', unit: 'lbs' },
    { key: 'arms', label: 'Arms', unit: 'in' },
    { key: 'chest', label: 'Chest', unit: 'in' },
    { key: 'waist', label: 'Waist', unit: 'in' },
    { key: 'legs', label: 'Legs', unit: 'in' },
    { key: 'bodyFatPercentage', label: 'Body Fat', unit: '%' }
  ];
  
  const handleAddMeasurement = () => {
    setOpenDialog(true);
  };
  
  return (
    <div className="app-container animate-fade-in">
      <Header title="Body Measurements" />
      
      <div className="px-4 mb-6">
        <Button
          className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple"
          onClick={handleAddMeasurement}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Measurement
        </Button>
      </div>
      
      {bodyMeasurements.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Ruler className="h-12 w-12 text-gym-purple mb-4" />
          <h2 className="text-xl font-bold mb-2">No Measurements Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start tracking your physical progress by recording your first measurements.
          </p>
        </div>
      ) : (
        <>
          {weightData.length > 1 && (
            <section className="mb-8 px-4">
              <h2 className="text-lg font-semibold mb-4">Weight Trend</h2>
              <ProgressChart 
                title="Weight Over Time" 
                data={weightData}
              />
            </section>
          )}
          
          <section className="mb-8 px-4">
            <h2 className="text-lg font-semibold mb-4">Latest Measurements</h2>
            <Card>
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-secondary">
                <div className="flex items-center space-x-2">
                  <Ruler className="w-5 h-5 text-gym-purple" />
                  <CardTitle className="text-base font-medium">
                    {latestMeasurement && format(new Date(latestMeasurement.date), "MMMM d, yyyy")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {measurementFields.map(field => {
                    const key = field.key as keyof typeof latestMeasurement;
                    const value = latestMeasurement?.[key];
                    
                    return value !== undefined ? (
                      <div key={field.key} className="flex justify-between items-center px-2 py-1">
                        <span className="text-sm text-muted-foreground">{field.label}:</span>
                        <span className="text-right font-medium">
                          {value} {field.unit}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
                
                {latestMeasurement?.photoUrl && (
                  <div className="mt-4 p-2 border rounded-md flex items-center">
                    <Camera className="w-5 h-5 text-muted-foreground mr-2" />
                    <span className="text-sm">Progress photo available</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          
          <section className="px-4">
            <h2 className="text-lg font-semibold mb-4">Measurement History</h2>
            {sortedMeasurements.slice(1).map(measurement => (
              <Card key={measurement.id} className="mb-4">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {format(new Date(measurement.date), "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {measurementFields.map(field => {
                      const key = field.key as keyof typeof measurement;
                      const value = measurement[key];
                      
                      return value !== undefined ? (
                        <div key={field.key} className="flex justify-between">
                          <span className="text-muted-foreground">{field.label}:</span>
                          <span>
                            {value} {field.unit}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </>
      )}
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Measurement</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Measurement form would go here in the next iteration
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Measurements;
