
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Plus,
  Play,
  ArrowLeft,
  Edit,
  Loader
} from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Training: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const context = useAppContext();
  
  // Validate context is available
  if (!context) {
    throw new Error("Training must be used within an AppProvider");
  }
  
  const { weeklyRoutines = [], workoutTemplates = [], workoutPlans = [] } = context;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null);
  
  useEffect(() => {
    // Data loading and validation
    try {
      setIsLoading(true);
      
      // Validate data structures
      if (!Array.isArray(weeklyRoutines)) {
        throw new Error("Weekly routines data is invalid");
      }
      
      if (!Array.isArray(workoutTemplates)) {
        throw new Error("Workout templates data is invalid");
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error loading training data:", error.message);
      setError("Failed to load training data. Please try again.");
      setIsLoading(false);
    }
  }, [weeklyRoutines, workoutTemplates]);
  
  // Get today's workout if scheduled
  const today = new Date();
  const dayOfWeek = today.getDay();
  const activeRoutine = Array.isArray(weeklyRoutines) ? weeklyRoutines.find(r => !r.archived) : undefined;
  const todaysWorkoutDay = activeRoutine?.workoutDays?.find(day => day.dayOfWeek === dayOfWeek);
  const todaysWorkout = todaysWorkoutDay?.workoutTemplateId && Array.isArray(workoutTemplates)
    ? workoutTemplates.find(t => t.id === todaysWorkoutDay.workoutTemplateId)
    : null;
  
  // Find active plan to use for routing
  const activePlan = Array.isArray(workoutPlans) ? workoutPlans.find(p => p.isActive) : undefined;
  
  // Get the appropriate plan ID for workout editing
  const handleEdit = (workoutId: string) => {
    try {
      if (activePlan) {
        navigate(`/exercise-plans/${activePlan.id}/days/${workoutId}`);
      } else {
        navigate(`/exercise-plans/days/${workoutId}`);
      }
    } catch (error) {
      console.error("Error navigating to edit workout:", error);
      toast({
        title: "Navigation Error",
        description: "Failed to navigate to edit workout. Please try again.",
        variant: "destructive"
      });
    }
  };
    
  const handleDeleteConfirm = () => {
    try {
      if (!itemToDelete) return;
      setConfirmDialog(false);
      setItemToDelete(null);
      
      toast({
        title: "Success",
        description: "Item deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Workouts">
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
            <Loader className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading training data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Workouts">
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
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in">
      <Header title="Workouts">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Header>
      
      <div className="p-4 space-y-6">
        {/* Start Workout Button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 flex items-center justify-center shadow-lg rounded-xl"
          onClick={() => navigate("/workout-selection")}
        >
          <Play className="mr-3 h-5 w-5" />
          Start Workout
        </Button>
        
        {/* Create Workout Button */}
        <Button
          variant="outline"
          className="w-full py-4 flex items-center justify-center"
          onClick={() => navigate("/workouts/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Workout
        </Button>
      
        {/* Today's workout if scheduled */}
        {todaysWorkout && (
          <Card className="bg-primary/10 mb-2">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-muted-foreground">
                    {format(today, "EEEE, MMMM d")}
                  </h3>
                  <p className="font-medium">Today's Workout: {todaysWorkout.name}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center"
                    onClick={() => handleEdit(todaysWorkout.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/live-workout/${todaysWorkout.id}?isTemplate=true`)}
                  >
                    Start
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      
        <div className="grid grid-cols-1 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:bg-secondary/10" onClick={() => navigate("/workouts")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">My Workout Library</h3>
                  <p className="text-muted-foreground">Browse and manage your workout collection</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:bg-secondary/10" onClick={() => navigate("/workout-history")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Workout History</h3>
                  <p className="text-muted-foreground">View your past workout sessions</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:bg-secondary/10" onClick={() => navigate("/weekly-overview")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Weekly Schedule</h3>
                  <p className="text-muted-foreground">Plan your workouts for the week</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training;
