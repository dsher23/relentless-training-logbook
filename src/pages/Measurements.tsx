import React, { useState } from "react";
import { format } from "date-fns";
import { Ruler, Camera, Plus, Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Lock, Trash, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressChart from "@/components/ProgressChart";
import Header from "@/components/Header";
import HeaderExtended from "@/components/HeaderExtended";
import { useAppContext } from "@/context/AppContext";
import MeasurementForm from "@/components/MeasurementForm";
import { BodyMeasurement, ProgressPhoto } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';

const Measurements: React.FC = () => {
  const { bodyMeasurements, addBodyMeasurement, progressPhotos = [], addProgressPhoto } = useAppContext();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [photoComparisonDialogOpen, setPhotoComparisonDialogOpen] = useState(false);
  const [comparisonPhotos, setComparisonPhotos] = useState<{
    photo1?: ProgressPhoto;
    photo2?: ProgressPhoto;
  }>({});
  
  // New photo state
  const [newPhoto, setNewPhoto] = useState<{
    imageUrl: string | null;
    weight: string;
    notes: string;
    private: boolean;
  }>({
    imageUrl: null,
    weight: "",
    notes: "",
    private: false,
  });
  
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
    // Reset the new photo form
    setNewPhoto({
      imageUrl: null,
      weight: latestMeasurement?.weight ? String(latestMeasurement.weight) : "",
      notes: "",
      private: false
    });
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setNewPhoto({
        ...newPhoto,
        imageUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };
  
  const savePhoto = () => {
    if (!newPhoto.imageUrl) {
      toast({
        title: "No Photo Selected",
        description: "Please take or upload a photo to continue",
        variant: "destructive"
      });
      return;
    }
    
    const photo: ProgressPhoto = {
      id: uuidv4(),
      date: new Date(),
      url: newPhoto.imageUrl,
      notes: newPhoto.notes || undefined,
      weight: newPhoto.weight ? parseFloat(newPhoto.weight) : undefined,
      isPrivate: newPhoto.private,
      tags: []
    };
    
    if (typeof addProgressPhoto === 'function') {
      addProgressPhoto(photo);
      
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

  const selectForComparison = (photo: ProgressPhoto) => {
    if (!comparisonPhotos.photo1) {
      setComparisonPhotos({ photo1: photo });
      toast({
        title: "Photo selected",
        description: "Select another photo to compare"
      });
    } else if (!comparisonPhotos.photo2) {
      setComparisonPhotos({ ...comparisonPhotos, photo2: photo });
      setPhotoComparisonDialogOpen(true);
    } else {
      // Reset and start over
      setComparisonPhotos({ photo1: photo });
      toast({
        title: "New comparison started",
        description: "Select another photo to compare"
      });
    }
  };

  const deletePhoto = (id: string) => {
    // This would call a delete function from your context
    // but I'll just notify for now since we don't have the full implementation
    toast({
      title: "Photo Deleted",
      description: "Your progress photo has been removed"
    });
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <HeaderExtended title="Body Measurements" />
      
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
                <div className="grid grid-cols-2 gap-4">
                  {progressPhotos.map(photo => (
                    <Card 
                      key={photo.id} 
                      className={`overflow-hidden ${photo.isPrivate ? "border-amber-300" : ""}`}
                    >
                      <div 
                        className="h-48 bg-cover bg-center cursor-pointer"
                        style={{ backgroundImage: `url(${photo.url})` }}
                        onClick={() => selectForComparison(photo)}
                      />
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs">{format(new Date(photo.date), "MMM d, yyyy")}</div>
                            {photo.weight && (
                              <div className="text-xs font-medium">{photo.weight} {unitSystem === 'metric' ? 'kg' : 'lbs'}</div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => deletePhoto(photo.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        {photo.notes && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            {photo.notes}
                          </div>
                        )}
                        {photo.isPrivate && (
                          <div className="mt-1 flex items-center text-xs text-amber-600">
                            <Lock className="h-3 w-3 mr-1" /> Private
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* Measurement Form Dialog */}
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
      
      {/* Add Photo Dialog - Enhanced */}
      <Dialog open={openPhotoDialog} onOpenChange={setOpenPhotoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {newPhoto.imageUrl ? (
              <div className="relative">
                <img 
                  src={newPhoto.imageUrl} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-md" 
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => setNewPhoto({ ...newPhoto, imageUrl: null })}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-muted-foreground mb-4">
                  Add a new progress photo to track your physical changes over time.
                </p>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => document.getElementById('photo-capture')?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Take Photo
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => document.getElementById('photo-capture')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <input
                    id="photo-capture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoCapture}
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Weight (optional)</label>
                <Input
                  type="number"
                  placeholder={unitSystem === 'metric' ? 'kg' : 'lbs'}
                  value={newPhoto.weight}
                  onChange={(e) => setNewPhoto({ ...newPhoto, weight: e.target.value })}
                />
              </div>
              <div className="flex items-end pb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="private-checkbox"
                    checked={newPhoto.private}
                    onChange={(e) => setNewPhoto({ ...newPhoto, private: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="private-checkbox" className="ml-2 text-sm">
                    Private Photo
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                placeholder="e.g., Started creatine this week"
                value={newPhoto.notes}
                onChange={(e) => setNewPhoto({ ...newPhoto, notes: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenPhotoDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={savePhoto} disabled={!newPhoto.imageUrl}>
              Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Selected Photo Dialog */}
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
      
      {/* Comparison Dialog */}
      <Dialog 
        open={photoComparisonDialogOpen} 
        onOpenChange={setPhotoComparisonDialogOpen}
      >
        <DialogContent className="sm:max-w-[90%] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Photo Comparison</DialogTitle>
          </DialogHeader>
          
          {comparisonPhotos.photo1 && comparisonPhotos.photo2 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Before vs After</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(comparisonPhotos.photo1.date), "MMM d, yyyy")} vs {format(new Date(comparisonPhotos.photo2.date), "MMM d, yyyy")}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={comparisonPhotos.photo1.url} 
                    alt="Before" 
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {comparisonPhotos.photo1.weight ? `${comparisonPhotos.photo1.weight} ${unitSystem === 'metric' ? 'kg' : 'lbs'}` : "No weight"}
                  </div>
                </div>
                
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={comparisonPhotos.photo2.url} 
                    alt="After" 
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    {comparisonPhotos.photo2.weight ? `${comparisonPhotos.photo2.weight} ${unitSystem === 'metric' ? 'kg' : 'lbs'}` : "No weight"}
                  </div>
                </div>
              </div>
              
              {comparisonPhotos.photo1.weight && comparisonPhotos.photo2.weight && (
                <div className="text-center p-3 bg-muted/30 rounded-md">
                  Weight Difference: 
                  <span className={`font-bold ml-2 ${
                    comparisonPhotos.photo2.weight > comparisonPhotos.photo1.weight 
                    ? "text-green-600" 
                    : comparisonPhotos.photo2.weight < comparisonPhotos.photo1.weight 
                    ? "text-red-600" 
                    : ""
                  }`}>
                    {comparisonPhotos.photo2.weight > comparisonPhotos.photo1.weight ? "+" : ""}
                    {(comparisonPhotos.photo2.weight - comparisonPhotos.photo1.weight).toFixed(1)} {unitSystem === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p>Select two photos to compare</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setPhotoComparisonDialogOpen(false);
                setComparisonPhotos({});
                setZoomLevel(1);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Measurements;
