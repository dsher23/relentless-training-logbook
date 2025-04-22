import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  ListChecks, 
  BarChart, 
  AlertTriangle, 
  Camera, 
  Dumbbell,
  ArrowRight,
  Pill,
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import WeakPointTracker from "@/components/WeakPointTracker";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:bg-secondary/80" 
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-lg bg-secondary">
            {icon}
          </div>
          <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        </div>
        <p className="text-2xl font-bold self-end">{value}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center space-x-2 mb-4">
    <div className="p-2 rounded-lg bg-secondary/50">
      {icon}
    </div>
    <h2 className="text-xl font-bold">{title}</h2>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, bodyMeasurements, supplements } = useAppContext();

  return (
    <div className="app-container animate-fade-in">
      <Header title="Dashboard" />
      
      <div className="px-4 mb-8 mt-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full bg-gym-blue hover:bg-gym-blue/90 text-white font-semibold py-6 flex items-center justify-center shadow-lg rounded-xl"
            onClick={() => navigate("/workout-selection")}
          >
            <Dumbbell className="mr-3 h-5 w-5" />
            Start Workout
          </Button>
        </motion.div>
      </div>
      
      <div className="px-4 mb-10">
        <SectionHeader title="Activity Overview" icon={<BarChart className="h-5 w-5 text-gym-blue" />} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Workouts Logged"
            value={`${workouts.length}`}
            icon={<Dumbbell className="h-6 w-6 text-gym-blue" />}
            onClick={() => navigate("/workouts")}
          />
          <StatCard
            title="Measurements"
            value={`${bodyMeasurements.length}`}
            icon={<Scale className="h-6 w-6 text-gym-orange" />}
            onClick={() => navigate("/measurements")}
          />
          <StatCard
            title="Supplements"
            value={`${supplements.length}`}
            icon={<Pill className="h-6 w-6 text-gym-teal" />}
            onClick={() => navigate("/supplements")}
          />
        </div>
      </div>

      <div className="px-4 space-y-10">
        <div>
          <SectionHeader title="Muscle Weak Points" icon={<Dumbbell className="h-5 w-5 text-gym-orange" />} />
          <WeakPointTracker />
        </div>
        
        <div>
          <SectionHeader title="Progress Photos" icon={<Camera className="h-5 w-5 text-gym-teal" />} />
          <Card className="overflow-hidden bg-gradient-to-br from-background to-secondary/50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Track Your Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your transformation week by week
                </p>
              </div>
              <Button 
                variant="secondary"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                onClick={() => navigate("/progress-photos")}
              >
                See My Progress
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
