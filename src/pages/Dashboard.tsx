
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Play, Calendar, LineChart, Clock, PillIcon, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderExtended from "@/components/HeaderExtended";
import ActivityStats from "@/components/dashboard/ActivityStats";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { weeklyRoutines, workoutTemplates } = useAppContext();
  
  // Get today's workout from weekly routine if available
  const activeRoutine = weeklyRoutines.find(r => !r.archived);
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  const todaysWorkoutDay = activeRoutine?.workoutDays.find(day => day.dayOfWeek === dayOfWeek);
  const todaysWorkout = todaysWorkoutDay?.workoutTemplateId 
    ? workoutTemplates.find(t => t.id === todaysWorkoutDay.workoutTemplateId)
    : null;

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
                      {todaysWorkout.exercises.length} exercises
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/live-workout/${todaysWorkout.id}?isTemplate=true`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                </div>
                
                {todaysWorkout.exercises.length > 0 && (
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
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            className="flex flex-col h-20 gap-1"
            onClick={() => navigate("/workout-history")}
          >
            <Clock className="h-5 w-5" />
            <span>Workout History</span>
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
            <span>Training Hub</span>
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
    </div>
  );
};

export default Dashboard;
