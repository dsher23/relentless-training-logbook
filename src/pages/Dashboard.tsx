import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Play, Calendar, LineChart, Clock, PillIcon, Activity, Settings, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderExtended from "@/components/HeaderExtended";
import ActivityStats from "@/components/dashboard/ActivityStats";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import TabNavigation from "@/components/TabNavigation";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Error Boundary Component for Child Components
class ChildErrorBoundary extends React.Component<{ children: React.ReactNode; componentName: string }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          <p>Error loading {this.props.componentName}. Please try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const context = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="app-container animate-fade-in pb-16">
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
      <div className="app-container animate-fade-in pb-16">
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
    <div className="app-container animate-fade-in pb-16">
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
                    {todaysWorkout.exercises.slice(0, 3).map((exercise: any, idx: number) => (
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
            onClick={() => navigate("/progress-photos")} // Updated to navigate to /progress-photos
          >
            <Camera className="h-5 w-5" />
            <span>Photos</span>
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
        </div>

        {/* Activity Stats */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Activity Overview
          </h2>
          <ChildErrorBoundary componentName="ActivityStats">
            <ActivityStats />
          </ChildErrorBoundary>
        </div>

        {/* Weekly Progress */}
        <div className="pb-16">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Progress
          </h2>
          <ChildErrorBoundary componentName="WeeklyProgress">
            <WeeklyProgress />
          </ChildErrorBoundary>
        </div>
      </div>

      <TabNavigation />
    </div>
  );
};

export default Dashboard;
