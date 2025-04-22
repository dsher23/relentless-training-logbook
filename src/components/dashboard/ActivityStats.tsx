
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, TapeMeasure, Pill } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    className="h-full"
  >
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:bg-secondary/80 h-full shadow-md" 
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="p-2.5 rounded-lg bg-secondary/80">
            {icon}
          </div>
          <div className="flex-1 text-right">
            <h2 className="text-sm font-medium text-muted-foreground">
              {title}
            </h2>
          </div>
        </div>
        <div className="mt-auto text-right">
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const ActivityStats = () => {
  const navigate = useNavigate();
  const { workouts, bodyMeasurements, supplements } = useAppContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Workouts Logged"
        value={`${workouts.length}`}
        icon={<Dumbbell className="h-6 w-6 text-gym-blue" />}
        onClick={() => navigate("/training")}
      />
      <StatCard
        title="Measurements Tracker"
        value={`${bodyMeasurements.length}`}
        icon={<TapeMeasure className="h-6 w-6 text-gym-orange" />}
        onClick={() => navigate("/measurements")}
      />
      <StatCard
        title="Supplements Tracker"
        value={`${supplements.length}`}
        icon={<Pill className="h-6 w-6 text-gym-teal" />}
        onClick={() => navigate("/supplements")}
      />
    </div>
  );
};

export default ActivityStats;
