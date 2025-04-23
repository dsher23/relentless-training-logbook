
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Dumbbell, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  // Helper function to check if path is active
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== "/" && location.pathname.startsWith(path));
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      isActive: isActive("/dashboard")
    },
    {
      path: "/training",
      icon: <Dumbbell className="w-5 h-5" />,
      label: "Workouts",
      isActive: isActive("/training") || 
               isActive("/workouts") || 
               isActive("/live-workout") || 
               isActive("/exercise-plans") ||
               isActive("/workout-selection")
    },
    {
      path: "/workout-history",
      icon: <Clock className="w-5 h-5" />,
      label: "History", 
      isActive: isActive("/workout-history")
    },
    {
      path: "/settings",
      icon: <User className="w-5 h-5" />,
      label: "Profile",
      isActive: isActive("/settings") || 
               isActive("/measurements") || 
               isActive("/supplements") ||
               isActive("/recovery")
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t flex items-center justify-around z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex flex-col items-center py-2 px-3",
            item.isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavigation;
