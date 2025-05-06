import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Play, Calendar, LineChart, Clock, PillIcon, Activity, Settings, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderExtended from "@/components/HeaderExtended";
import ActivityStats from "@/components/dashboard/ActivityStats";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useBodyMeasurements } from "@/hooks/useBodyMeasurements";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const context = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { progressPhotos, addProgressPhoto } = useBodyMeasurements();
  const [photoDrawerOpen, setPhotoDrawerOpen] = useState(false);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoData, setPhotoData] = useState<string | null>(null);

  // Check if context is available
  if (!context) {
    throw new Error("Dashboard must be used within an AppProvider");
  }

  const { weeklyRoutines = [], workoutTemplates = [] } = context;

  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    try {
      // Validate data
      if (!Array.isArray(weeklyRoutines) || !Array.isArray(workoutTemplates)) {
        throw new Error("Invalid data: weeklyRoutines or workoutTemplates is not an array.");
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error loading dashboard data:", err.message);
      setError("Failed to load dashboard data. Please try again.");
      setIsLoading(false);
    }
  }, [weeklyRoutines, workoutTemplates]);

  // Get today's workout from weekly routine if available
  const activeRoutine = weeklyRoutines.find(r => !r.archived);
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  const todaysWorkoutDay = activeRoutine?.workoutDays?.find(day => day.dayOfWeek === dayOfWeek);
  const todaysWorkout = todaysWorkoutDay?.workoutTemplateId && workoutTemplates.length > 0
    ? workoutTemplates.find(t => t.id === todaysWorkoutDay.workoutTemplateId)
    : null;

  // Handle progress photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoData(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Save progress photo
  const handleSavePhoto = () => {
    if (!photoData) {
      toast.error("Please select a photo first");
      return;
    }

    const newPhoto = {
      id: uuid(),
      date: new Date(),
      imageData: photoData,
      caption: photoCaption || `Progress photo - ${new Date().toLocaleDateString()}`
    };

    addProgressPhoto(newPhoto);
    toast.success("Progress photo saved successfully");
    setPhotoDrawerOpen(false);
    setPhotoData(null);
    setPhotoCaption("");
  };

  // Display latest progress photo
  const latestPhoto = progressPhotos && progressPhotos.length > 0 
    ? progressPhotos[progressPhotos.length - 1] 
    : null;

  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <HeaderExtended title="IronLog" hasBackButton={false} />
        <div className="px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container animate-fade-in">
        <HeaderExtended title="IronLog" hasBackButton={false} />
        <div className="px-4 py-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate("/workouts")}
          >
            Go to Workouts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in">
      <HeaderExtended title="IronLog" hasBackButton={false} />
      
      <div className="px-4 space-y-6">
        {/* Main action button */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4"
        >
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-8 flex items-center justify-center shadow-lg rounded-xl text-lg"
            onClick={() => navigate("/workout-selection")}
          >
            <Play className="mr-3 h-6 w-6" />
            Start Workout
          </Button>
        </motion.div>
      
        {/* Today's Workout */}
        {todaysWorkout && (
          <div className="mt-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Today's Workout</span>
                    </div>
                    <h3 className="text-lg font-semibold">{todaysWorkout.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {todaysWorkout.exercises?.length || 0} exercises
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/live-workout/${todaysWorkout.id}?isTemplate=true`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                </div>
                
                {todaysWorkout.exercises?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {todaysWorkout.exercises.slice(0, 3).map((exercise, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-secondary/50">
                        {exercise.name}
                      </Badge>
                    ))}
                    {todaysWorkout.exercises.length > 3 && (
                      <Badge variant="secondary" className="bg-secondary/50">
                        +{todaysWorkout.exercises.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Progress Photos Section */}
        <div className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Progress Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {latestPhoto ? (
                <div className="space-y-2">
                  <div className="aspect-square max-h-[200px] overflow-hidden rounded-md">
                    <img 
                      src={latestPhoto.imageData} 
                      alt="Latest progress" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {latestPhoto.caption || new Date(latestPhoto.date).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPhotoDrawerOpen(true)}
                    >
                      Add New
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/progress-photos")}
                    >
                      View All
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <p className="text-sm text-muted-foreground">No progress photos yet</p>
                  <Button onClick={() => setPhotoDrawerOpen(true)}>
                    <Camera className="h-4 w-4 mr-2" />
                    Add First Photo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline"
            className="flex flex-col h-20 gap-1"
            onClick={() => navigate("/workout-history")}
          >
            <Clock className="h-5 w-5" />
            <span>History</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col h-20 gap-1"
            onClick={() => navigate("/measurements")}
          >
            <Activity className="h-5 w-5" />
            <span>Measurements</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col h-20 gap-1"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col h-20 gap-1"
            onClick={() => navigate("/supplements")}
          >
            <PillIcon className="h-5 w-5" />
            <span>Supplements</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col h-20 gap-1"
            onClick={() => navigate("/training")}
          >
            <Dumbbell className="h-5 w-5" />
            <span>Training</span>
          </Button>
          <Button 
            variant="outline"
            className="flex flex-col h-20 gap-1"
            onClick={() => navigate("/progress-photos")}
          >
            <Camera className="h-5 w-5" />
            <span>Photos</span>
          </Button>
        </div>

        {/* Activity Stats */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Activity Overview
          </h2>
          <ActivityStats />
        </div>

        {/* Weekly Progress */}
        <div className="pb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Progress
          </h2>
          <WeeklyProgress />
        </div>
      </div>
      
      {/* Progress Photo Upload Drawer */}
      <Drawer open={photoDrawerOpen} onOpenChange={setPhotoDrawerOpen}>
        <DrawerContent className="p-4 space-y-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Add Progress Photo
          </h3>
          
          <div className="space-y-4">
            {photoData ? (
              <div className="aspect-square max-h-[300px] overflow-hidden rounded-md mx-auto">
                <img 
                  src={photoData} 
                  alt="Progress preview" 
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Upload a progress photo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Caption (Optional)</label>
              <input
                type="text"
                placeholder="Add a caption..."
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setPhotoDrawerOpen(false);
                  setPhotoData(null);
                  setPhotoCaption("");
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSavePhoto}
                disabled={!photoData}
              >
                Save Photo
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Dashboard;
