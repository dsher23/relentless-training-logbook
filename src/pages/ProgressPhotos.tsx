import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Trash2 } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProgressPhoto {
  id: string;
  url: string;
  date: string;
  notes?: string;
}

const ProgressPhotos: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const context = useAppContext();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if context is available
  if (!context) {
    throw new Error("ProgressPhotos must be used within an AppProvider");
  }

  const { progressPhotos = [], setProgressPhotos } = context;

  useEffect(() => {
    setIsLoading(true);
    try {
      // Sort photos by date (newest first)
      const sortedPhotos = [...progressPhotos].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setPhotos(sortedPhotos);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading progress photos:", error);
      toast({
        title: "Error",
        description: "Failed to load progress photos.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [progressPhotos, toast]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPhoto(file);
    }
  };

  const handleSavePhoto = () => {
    if (!newPhoto) {
      toast({
        title: "Error",
        description: "Please select a photo to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const newPhotoData: ProgressPhoto = {
          id: `photo-${Date.now()}`,
          url: reader.result as string,
          date: new Date().toISOString(),
          notes: notes.trim() || undefined,
        };

        const updatedPhotos = [...photos, newPhotoData];
        setProgressPhotos(updatedPhotos);
        setPhotos(updatedPhotos);
        setNewPhoto(null);
        setNotes("");
        toast({
          title: "Success",
          description: "Progress photo added successfully.",
        });
      };
      reader.readAsDataURL(newPhoto);
    } catch (error) {
      console.error("Error saving progress photo:", error);
      toast({
        title: "Error",
        description: "Failed to save progress photo.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePhoto = (id: string) => {
    try {
      const updatedPhotos = photos.filter(photo => photo.id !== id);
      setProgressPhotos(updatedPhotos);
      setPhotos(updatedPhotos);
      toast({
        title: "Success",
        description: "Progress photo deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting progress photo:", error);
      toast({
        title: "Error",
        description: "Failed to delete progress photo.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="app-container animate-fade-in pb-16">
        <NavigationHeader title="Progress Photos" showBack={true} showHome={true} showProfile={false} />
        <div className="px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
            <p className="text-muted-foreground">Loading photos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Progress Photos" showBack={true} showHome={true} showProfile={false} />
      
      <div className="px-4 pt-4 space-y-6">
        {/* Upload New Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Progress Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full"
            />
            <Input
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={handleSavePhoto} 
              className="w-full"
              disabled={!newPhoto}
            >
              <Camera className="h-4 w-4 mr-2" />
              Save Photo
            </Button>
          </CardContent>
        </Card>

        {/* Photo Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Photo Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            {photos.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No progress photos yet.</p>
                <Button
                  variant="outline"
                  onClick={() => document.querySelector('input[type="file"]')?.click()}
                >
                  Add Your First Photo
                </Button>
              </div>
            ) : (
              photos.map((photo) => (
                <Card key={photo.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{new Date(photo.date).toLocaleDateString()}</p>
                        {photo.notes && (
                          <p className="text-sm text-muted-foreground">{photo.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <img
                      src={photo.url}
                      alt="Progress photo"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPhotos;
