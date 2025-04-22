import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ListChecks, BarChart, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import WeakPointTracker from "@/components/WeakPointTracker";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick }) => (
  <Card className="cursor-pointer hover:bg-secondary transition-colors" onClick={onClick}>
    <CardContent className="flex items-center space-x-4 p-3">
      {icon}
      <div>
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, bodyMeasurements, supplements, weakPoints } = useAppContext();

  return (
    <div className="app-container animate-fade-in">
      <Header title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mb-6">
        <StatCard
          title="Workouts Logged"
          value={`${workouts.length}`}
          icon={<ListChecks className="h-8 w-8" />}
          onClick={() => navigate("/workouts")}
        />
        <StatCard
          title="Measurements Tracked"
          value={`${bodyMeasurements.length}`}
          icon={<BarChart className="h-8 w-8" />}
          onClick={() => navigate("/measurements")}
        />
        <StatCard
          title="Supplements Used"
          value={`${supplements.length}`}
          icon={<Calendar className="h-8 w-8" />}
          onClick={() => navigate("/supplements")}
        />
      </div>

      <div className="px-4">
        <WeakPointTracker />
      </div>
    </div>
  );
};

export default Dashboard;
