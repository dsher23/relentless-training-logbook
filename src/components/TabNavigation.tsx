
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Ruler, PillIcon, Moon, BarChart } from "lucide-react";

const TabNavigation: React.FC = () => {
  const location = useLocation();
  
  const tabs = [
    {
      name: "Dashboard",
      path: "/",
      icon: <BarChart className="w-5 h-5" />
    },
    {
      name: "Workouts",
      path: "/workouts",
      icon: <Dumbbell className="w-5 h-5" />
    },
    {
      name: "Measurements",
      path: "/measurements",
      icon: <Ruler className="w-5 h-5" />
    },
    {
      name: "Supplements",
      path: "/supplements",
      icon: <PillIcon className="w-5 h-5" />
    },
    {
      name: "Recovery",
      path: "/recovery",
      icon: <Moon className="w-5 h-5" />
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around px-2">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`flex flex-col items-center justify-center w-full h-full ${
            location.pathname === tab.path
              ? "text-gym-purple"
              : "text-muted-foreground"
          }`}
        >
          {tab.icon}
          <span className="text-xs mt-1">{tab.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default TabNavigation;
