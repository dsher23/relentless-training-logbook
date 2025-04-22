
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dumbbell, 
  Calendar, 
  LineChart, 
  Clock, 
  Trophy,
  Play,
  CalendarDays
} from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { format } from "date-fns";

const Training: React.FC = () => {
  const navigate = useNavigate();
  const { weeklyRoutines, workoutTemplates } = useAppContext();
  
  // Get today's workout if scheduled
  const today = new Date();
  const dayOfWeek = today.getDay();
  const activeRoutine = weeklyRoutines.find(r => !r.archived);
  const todaysWorkoutDay = activeRoutine?.workoutDays.find(day => day.dayOfWeek === dayOfWeek);
  const todaysWorkout = todaysWorkoutDay?.workoutTemplateId 
    ? workoutTemplates.find(t => t.id === todaysWorkoutDay.workoutTemplateId)
    : null;

  return (
    <div className="app-container animate-fade-in">
      <Header title="Training Hub" />
      
      <div className="p-4 space-y-6">
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
                <Button
                  size="sm"
                  className="bg-gym-blue hover:bg-gym-blue/90 text-white"
                  onClick={() => navigate(`/live-workout/${todaysWorkout.id}?isTemplate=true`)}
                >
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:bg-secondary/10" onClick={() => navigate("/workouts")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gym-blue/10">
                  <Dumbbell className="h-6 w-6 text-gym-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">My Workouts</h3>
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
                <div className="p-3 rounded-full bg-gym-orange/10">
                  <Clock className="h-6 w-6 text-gym-orange" />
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
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:bg-secondary/10" onClick={() => navigate("/plans")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gym-green/10">
                  <Calendar className="h-6 w-6 text-gym-green" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Workout Plans</h3>
                  <p className="text-muted-foreground">Schedule and follow structured plans</p>
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
                <div className="p-3 rounded-full bg-gym-purple/10">
                  <CalendarDays className="h-6 w-6 text-gym-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Weekly Schedule</h3>
                  <p className="text-muted-foreground">Plan your workouts for the week</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-4">
          <Card className="bg-gradient-to-r from-gym-blue to-gym-purple">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl text-white">Ready to train?</h3>
                  <p className="text-white/80">Start a new workout session now</p>
                </div>
                <Button 
                  onClick={() => navigate("/workout-selection")}
                  className="bg-white text-gym-purple hover:bg-white/90"
                >
                  <Play className="mr-2 h-4 w-4" /> 
                  Start Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Training;
