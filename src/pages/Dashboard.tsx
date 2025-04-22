
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ActivityStats from "@/components/dashboard/ActivityStats";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container animate-fade-in">
      <Header title="Dashboard" />
      
      <div className="px-4 space-y-8">
        {/* Training Hub and Start Workout Buttons */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full bg-gym-blue hover:bg-gym-blue/90 text-white font-semibold py-6 flex items-center justify-center shadow-lg rounded-xl"
              onClick={() => navigate("/training")}
            >
              <Dumbbell className="mr-3 h-5 w-5" />
              Training Hub
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full bg-gym-purple hover:bg-gym-purple/90 text-white font-semibold py-6 flex items-center justify-center shadow-lg rounded-xl"
              onClick={() => navigate("/workout-selection")}
            >
              <Play className="mr-3 h-5 w-5" />
              Start Workout
            </Button>
          </motion.div>
        </div>

        {/* Activity Stats */}
        <div>
          <h2 className="text-xl font-bold mb-4">Activity Overview</h2>
          <ActivityStats />
        </div>

        {/* Weekly Progress */}
        <div className="pb-8">
          <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>
          <WeeklyProgress />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
