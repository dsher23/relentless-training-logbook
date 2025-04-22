
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, BarChart, Dumbbell, Heart, PillIcon, CalendarDays, Settings as SettingsIcon, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";

const TabNavigationExtended: React.FC = () => {
  const location = useLocation();
  const { getDueReminders } = useAppContext();
  
  // Safely call getDueReminders function
  const dueReminders = getDueReminders ? getDueReminders() : [];
  const hasNotifications = dueReminders.length > 0;
  
  // Helper function to check if path is active
  const isActive = (paths: string[]) => {
    return paths.some(path => 
      location.pathname === path || 
      location.pathname.startsWith(`${path}/`)
    );
  };
  
  // Define all training-related paths
  const trainingPaths = [
    "/training", 
    "/workouts", 
    "/plans", 
    "/routines",
    "/workout-selection",
    "/workout-history",
    "/live-workout",
    "/weekly"
  ];
  
  const tabs = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <BarChart className="w-5 h-5" />,
      isActive: isActive(["/dashboard"]),
    },
    {
      path: "/training",
      label: "Training",
      icon: <Dumbbell className="w-5 h-5" />,
      isActive: isActive(trainingPaths),
    },
    {
      path: "/weekly",
      label: "Weekly",
      icon: <CalendarDays className="w-5 h-5" />,
      isActive: isActive(["/weekly"]),
    },
    {
      path: "/supplements",
      label: "Supplements",
      icon: <PillIcon className="w-5 h-5" />,
      isActive: isActive(["/supplements"]),
      hasNotification: hasNotifications,
    },
    {
      path: "/recovery",
      label: "Recovery",
      icon: <Heart className="w-5 h-5" />,
      isActive: isActive(["/recovery"]),
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <SettingsIcon className="w-5 h-5" />,
      isActive: isActive(["/settings"]),
    },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex items-center justify-around z-50">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={cn(
            "flex flex-col items-center py-2 px-3 relative",
            tab.isActive ? "text-gym-purple" : "text-muted-foreground"
          )}
        >
          {tab.icon}
          <span className="text-xs mt-1">{tab.label}</span>
          {tab.hasNotification && (
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default TabNavigationExtended;
