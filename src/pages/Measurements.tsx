
import React, { useState } from "react";
import { format } from "date-fns";
import { Ruler, Camera, Plus, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressChart from "@/components/ProgressChart";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import MeasurementForm from "@/components/MeasurementForm";
import { BodyMeasurement, ProgressPhoto } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const Measurements: React.FC = () => {
  const { bodyMeasurements, addBodyMeasurement, progressPhotos = [], addProgressPhoto } = useAppContext();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
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
    { key: 'weight', label: 'Weight', unit: unitSystem === 'metric' ? 'kg' : 'lbs' },
    { key: 'chest', label: 'Chest', unit: unitSystem === 'metric' ? 'cm' : 'in' },
    { key: 'waist', label: 'Waist', unit: unitSystem === 'metric' ? 'cm' : 'in' },
    { key: 'arms', label: 'Arms', unit: unitSystem === 'metric' ? 'cm' : 'in' },
    { key: 'legs', label: 'Legs', unit: unitSystem === 'metric' ? 'cm' : 'in' },
    { key: 'bodyFat', label: 'Body Fat', unit: '%' }
  ];
  
  const handleAddMeasurement = () => {
    setOpenDialog(true);
  };

  const handleSaveMeasurement = (measurement: BodyMeasurement) => {
    // Ensure unit system is saved with the measurement
    const measurementWithUnit = {
      ...measurement,
      unit: unitSystem
    };
    
    addBodyMeasurement(measurementWithUnit);
    setOpenDialog(false);
    
    toast({
      title: "Measurement saved",
      description: "Your body measurements have been recorded successfully."
    });
  };

  const handleAddPhoto = () => {
    setOpenPhotoDialog(true);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // In a real app, we'd upload the file to storage
    // For now, we'll create a fake URL
    const fakeUrl = URL.createObjectURL(file);
    
    const newPhoto: ProgressPhoto = {
      id: uuidv4(),
      date: new Date(),
      url: fakeUrl,
      notes: "",
      weight: latestMeasurement?.weight,
      isPrivate: false,
      tags: []
    };
    
    if (typeof addProgressPhoto === 'function') {
      addProgressPhoto(newPhoto);
      
      toast({
        title: "Photo added",
        description: "Your progress photo has been added successfully."
      });
      
      setOpenPhotoDialog(false);
    } else {
      toast({
        title: "Error",
        description: "Progress photo functionality is not yet implemented. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title="Body Measurements" />
      
      <div className="px-4 space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label htmlFor="unit-toggle">Units:</Label>
            <div className="flex items-center space-x-2">
              <span className={unitSystem === 'metric' ? 'font-medium' : 'text-muted-foreground'}>Metric</span>
              <Switch 
                id="unit-toggle" 
                checked={unitSystem === 'imperial'}
                onCheckedChange={(checked) => setUnitSystem(checked ? 'imperial' : 'metric')}
              />
              <span className={unitSystem === 'imperial' ? 'font-medium' : 'text-muted-foreground'}>Imperial</span>
            </div>
          </div>
        </div>
        
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
          <Tabs defaultValue="measurements" className="px-4">
            <TabsList className="w-full">
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
              <TabsTrigger value="photos">Progress Photos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="measurements" className="space-y-6 mt-4">
              {weightData.length > 1 && (
                <section className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Weight Trend</h2>
                    <div className="space-x-2">
                      <Button 
                        variant={viewMode === "weekly" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("weekly")}
                      >
                        Weekly
                      </Button>
                      <Button 
                        variant={viewMode === "monthly" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("monthly")}
                      >
                        Monthly
                      </Button>
                    </div>
                  </div>
                  <ProgressChart 
                    title="Weight Over Time" 
                    data={weightData}
                    interval={viewMode}
                  />
                </section>
              )}
              
              <section className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Latest Measurements</h2>
                {latestMeasurement ? (
                  <Card>
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-secondary">
                      <div className="flex items-center space-x-2">
                        <Ruler className="w-5 h-5 text-gym-purple" />
                        <CardTitle className="text-base font-medium">
                          {format(new Date(latestMeasurement.date), "MMMM d, yyyy")}
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
                                {value.toString()} {field.unit}
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
                      
                      {latestMeasurement?.notes && (
                        <div className="mt-4 p-2 border rounded-md">
                          <h4 className="font-medium mb-1">Notes:</h4>
                          <p className="text-sm text-muted-foreground">{latestMeasurement.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center p-6 text-muted-foreground border border-dashed rounded-lg">
                    <p>No measurements available</p>
                  </div>
                )}
              </section>
              
              <section>
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
                                {value.toString()} {field.unit}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>
            </TabsContent>
            
            <TabsContent value="photos" className="mt-4 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Progress Photos</h2>
                <Button onClick={handleAddPhoto}>
                  <Camera className="mr-2 h-4 w-4" />
                  Add Photo
                </Button>
              </div>
              
              {!progressPhotos || progressPhotos.length === 0 ? (
                <div className="text-center p-10 border-2 border-dashed rounded-lg">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-2">No Progress Photos Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Track your physical changes by adding progress photos
                  </p>
                  <Button onClick={handleAddPhoto}>
                    Add First Photo
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {progressPhotos.map(photo => (
                    <div 
                      key={photo.id} 
                      className="aspect-square relative rounded-md overflow-hidden cursor-pointer"
                      onClick={() => setSelectedPhoto(photo.url)}
                    >
                      <img 
                        src={photo.url} 
                        alt={`Progress photo from ${format(new Date(photo.date), 'PP')}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1">
                        {format(new Date(photo.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Measurement</DialogTitle>
          </DialogHeader>
          <MeasurementForm 
            onSubmit={handleSaveMeasurement}
            onCancel={() => setOpenDialog(false)}
            unitSystem={unitSystem}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={openPhotoDialog} onOpenChange={setOpenPhotoDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              Add a new progress photo to track your physical changes over time.
            </p>
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="photo-upload">Upload Photo</Label>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <Button asChild className="w-full">
                  <label htmlFor="photo-upload" className="cursor-pointer flex items-center justify-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Photo
                  </label>
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Photos are stored locally on your device. Enable sync in settings to back them up.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <div className="relative">
              <img 
                src={selectedPhoto} 
                alt="Progress photo" 
                className="w-full h-auto max-h-[80vh]"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={() => setSelectedPhoto(null)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Measurements;
