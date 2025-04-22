
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dumbbell, 
  Calendar, 
  LineChart, 
  Clock, 
  Trophy
} from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Training: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container animate-fade-in">
      <Header title="Training Hub" />
      
      <div className="p-4 space-y-6">
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
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:bg-secondary/10" onClick={() => navigate("/routines")}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gym-purple/10">
                  <LineChart className="h-6 w-6 text-gym-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Routines</h3>
                  <p className="text-muted-foreground">Create and manage your routines</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mt-8">
          <Card className="bg-gradient-to-r from-gym-blue to-gym-purple">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl text-white">Ready to train?</h3>
                  <p className="text-white/80">Start a new workout session now</p>
                </div>
                <Button 
                  onClick={() => navigate("/workouts/new")}
                  className="bg-white text-gym-purple hover:bg-white/90"
                >
                  <Dumbbell className="mr-2 h-4 w-4" /> 
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
