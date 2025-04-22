
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Dumbbell, Ruler, PillIcon, Calendar, Tag } from "lucide-react";

interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    path: "/",
    label: "Home",
    icon: <Home className="h-5 w-5" />
  },
  {
    path: "/workouts",
    label: "Workouts",
    icon: <Dumbbell className="h-5 w-5" />
  },
  {
    path: "/routines",
    label: "Routines",
    icon: <Tag className="h-5 w-5" />
  },
  {
    path: "/measurements",
    label: "Progress",
    icon: <Ruler className="h-5 w-5" />
  },
  {
    path: "/supplements",
    label: "Supps",
    icon: <PillIcon className="h-5 w-5" />
  }
];

const TabNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-card h-16 z-10">
      <nav className="flex h-full">
        {tabs.map((tab) => {
          const isActive = tab.path === "/" 
            ? location.pathname === "/"
            : location.pathname.startsWith(tab.path);
            
          return (
            <button
              key={tab.path}
              className={`flex flex-1 flex-col items-center justify-center ${
                isActive ? "text-iron-blue" : "text-muted-foreground"
              }`}
              onClick={() => navigate(tab.path)}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;
