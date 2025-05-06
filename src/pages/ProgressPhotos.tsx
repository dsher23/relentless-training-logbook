
import React, { useState, useRef } from "react";
import { 
  Camera, Upload, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, Lock, Trash, Calendar 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addWeeks, subWeeks, isSameWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useBodyMeasurements } from "@/hooks/useBodyMeasurements";
import { ProgressPhoto } from "@/types";

const ProgressPhotos = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { progressPhotos, addProgressPhoto, deleteProgressPhoto } = useBodyMeasurements();
  
  // State
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // New photo state
  const [newPhoto, setNewPhoto] = useState<{
    imageData: string | null;
    weight: string;
    notes: string;
    private: boolean;
    caption: string;
  }>({
    imageData: null,
    weight: "",
    notes: "",
    private: false,
    caption: "",
  });
  
  // Comparison state
  const [comparisonPhotos, setComparisonPhotos] = useState<{
    photo1?: ProgressPhoto;
    photo2?: ProgressPhoto;
  }>({});
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPhoto({
          ...newPhoto,
          imageData: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle photo capture button
  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Save new photo
  const savePhoto = () => {
    if (!newPhoto.imageData) {
      toast({
        title: "No Photo Selected",
        description: "Please take or upload a photo to continue",
        variant: "destructive"
      });
      return;
    }
    
    const photo: Omit<ProgressPhoto, "id"> = {
      date: new Date(),
      imageData: newPhoto.imageData,
      caption: newPhoto.caption || `Progress photo - ${new Date().toLocaleDateString()}`
    };
    
    addProgressPhoto(photo);
    
    // Reset form and close dialog
    setNewPhoto({
      imageData: null,
      weight: "",
      notes: "",
      private: false,
      caption: "",
    });
    
    setPhotoDialogOpen(false);
    
    toast.success("Photo Saved");
  };
  
  // Delete photo
  const handleDeletePhoto = (id: string) => {
    deleteProgressPhoto(id);
    toast.success("Photo Deleted");
  };
  
  // Select photo for comparison
  const selectForComparison = (photo: ProgressPhoto) => {
    if (!comparisonPhotos.photo1) {
      setComparisonPhotos({ photo1: photo });
    } else if (!comparisonPhotos.photo2) {
      setComparisonPhotos({ ...comparisonPhotos, photo2: photo });
      setComparisonDialogOpen(true);
    } else {
      // Reset and start over
      setComparisonPhotos({ photo1: photo });
    }
  };
  
  // Get photos for current week
  const currentWeekPhotos = progressPhotos ? progressPhotos.filter(photo => 
    isSameWeek(new Date(photo.date), selectedWeek)
  ) : [];
  
  // Navigation
  const prevWeek = () => setSelectedWeek(subWeeks(selectedWeek, 1));
  const nextWeek = () => setSelectedWeek(addWeeks(selectedWeek, 1));
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title="Progress Photos" />
      
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <div className="font-medium">
              Week of {format(selectedWeek, "MMM d, yyyy")}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentWeekPhotos.length} photos this week
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextWeek}
            disabled={isSameWeek(selectedWeek, new Date()) || selectedWeek > new Date()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="w-full"
            onClick={() => setPhotoDialogOpen(true)}
          >
            <Camera className="mr-2 h-4 w-4" /> Take Photo
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowPrivate(!showPrivate)}
          >
            <Lock className="mr-2 h-4 w-4" /> 
            {showPrivate ? "Hide Private" : "Show Private"}
          </Button>
        </div>
      </div>
      
      {currentWeekPhotos.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No Photos This Week</h2>
          <p className="text-muted-foreground mb-6">
            Take your first progress photo for this week to start tracking your journey.
          </p>
          <Button onClick={() => setPhotoDialogOpen(true)}>
            <Camera className="mr-2 h-4 w-4" /> Add First Photo
          </Button>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 gap-4">
          {currentWeekPhotos.map((photo) => (
            <Card 
              key={photo.id} 
              className="overflow-hidden"
            >
              <div 
                className="h-48 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${photo.imageData})` }}
                onClick={() => selectForComparison(photo)}
              />
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs">{format(new Date(photo.date), "MMM d, yyyy")}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                {photo.caption && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {photo.caption}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Photo Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {newPhoto.imageData ? (
              <div className="relative">
                <img 
                  src={newPhoto.imageData} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-md" 
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => setNewPhoto({ ...newPhoto, imageData: null })}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={handleCaptureClick}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Take Photo
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={handleCaptureClick}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Caption (optional)</label>
              <Input
                placeholder="E.g., Week 4 progress"
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
              />
            </div>
            
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
              onClick={() => setPhotoDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={savePhoto} disabled={!newPhoto.imageData}>
              Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Comparison Dialog */}
      <Dialog 
        open={comparisonDialogOpen} 
        onOpenChange={setComparisonDialogOpen}
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
                    src={comparisonPhotos.photo1.imageData} 
                    alt="Before" 
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>
                
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={comparisonPhotos.photo2.imageData} 
                    alt="After" 
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>
              </div>
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
                setComparisonDialogOpen(false);
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

export default ProgressPhotos;
