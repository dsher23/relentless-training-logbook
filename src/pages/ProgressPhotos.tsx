import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Camera, Calendar, ArrowLeft, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import { ProgressPhoto } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import TabNavigation from "@/components/TabNavigation";

const ProgressPhotos: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const context = useAppContext();
  
  // Validate context is available
  if (!context) {
    throw new Error("ProgressPhotos must be used within an AppProvider");
  }
  
  const { progressPhotos = [] } = context;
  
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      setIsLoading(true);
      
      if (!Array.isArray(progressPhotos)) {
        throw new Error("Progress photos data is invalid");
      }
      
      // Sort photos by date (newest first)
      const sortedPhotos = photos
        .map(photo => ({
          ...photo,
          imageData: photo.imageData || photo.url || "", // Ensure imageData exists
        }))
        .sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      
      setPhotos(sortedPhotos);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error loading progress photos:", error.message);
      setError("Failed to load progress photos. Please try again.");
      setIsLoading(false);
    }
  }, [progressPhotos]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    setSelectedImage(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleAddPhoto = () => {
    if (!imagePreview) {
      toast({
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newPhoto: ProgressPhoto = {
        id: crypto.randomUUID(),
        date: new Date(),
        imageData: imagePreview,
        caption: caption.trim(),
      };
      
      // Add the new photo to the list
      setPhotos(prev => [newPhoto, ...prev]);
      
      // Reset form
      setIsAddingPhoto(false);
      setSelectedImage(null);
      setImagePreview(null);
      setCaption("");
      
      toast({
        description: "Photo added successfully",
      });
    } catch (error) {
      console.error("Error adding photo:", error);
      toast({
        description: "Failed to add photo. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const confirmDeletePhoto = (photoId: string) => {
    setPhotoToDelete(photoId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeletePhoto = () => {
    if (!photoToDelete) return;
    
    try {
      // Remove the photo from the list
      setPhotos(prev => prev.filter(photo => photo.id !== photoToDelete));
      
      // Close dialog and reset state
      setIsDeleteDialogOpen(false);
      setPhotoToDelete(null);
      
      toast({
        description: "Photo deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        description: "Failed to delete photo. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="app-container animate-fade-in pb-16">
        <Header title="Progress Photos">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Header>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading progress photos...</p>
          </div>
        </div>
        <TabNavigation />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="app-container animate-fade-in pb-16">
        <Header title="Progress Photos">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Header>
        <div className="p-4 text-center">
          <div className="bg-destructive/10 p-4 rounded-md mb-4">
            <p className="text-destructive">{error}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
        <TabNavigation />
      </div>
    );
  }
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <Header title="Progress Photos">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Header>
      
      <div className="p-4">
        <Button 
          className="w-full flex items-center justify-center mb-6"
          onClick={() => setIsAddingPhoto(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Photo
        </Button>
        
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No progress photos yet</h3>
            <p className="text-muted-foreground mb-4">
              Take photos to track your physical progress over time
            </p>
            <Button
              variant="outline"
              onClick={() => setIsAddingPhoto(true)}
            >
              Add Your First Photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={photo.imageData || photo.url} 
                    alt="Progress" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex justify-between items-center">
                    <div className="flex items-center text-white">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="text-xs">
                        {format(new Date(photo.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0 text-white hover:text-red-400"
                      onClick={() => confirmDeletePhoto(photo.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {photo.caption && (
                  <CardContent className="p-3">
                    <p className="text-sm">{photo.caption}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Photo Dialog */}
      <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Take a photo or upload from your gallery
                </p>
                <Input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  id="photo-upload" 
                  onChange={handleFileChange}
                />
                <label htmlFor="photo-upload">
                  <Button
                    type="button"
                    variant="secondary"
                    className="cursor-pointer"
                    asChild
                  >
                    <span>Select Photo</span>
                  </Button>
                </label>
              </div>
            ) : (
              <>
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-white"
                  >
                    Change
                  </Button>
                </div>
                <div>
                  <label htmlFor="caption" className="text-sm font-medium">
                    Caption (optional)
                  </label>
                  <Input
                    id="caption"
                    placeholder="Add a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddingPhoto(false);
                setSelectedImage(null);
                setImagePreview(null);
                setCaption("");
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddPhoto} 
              disabled={!imagePreview}
            >
              Save Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this photo? This action cannot be undone.</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePhoto}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <TabNavigation />
    </div>
  );
};

export default ProgressPhotos;
