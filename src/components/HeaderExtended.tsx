
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NotificationCenter from "@/components/NotificationCenter";

interface HeaderExtendedProps {
  title: string;
  hasBackButton?: boolean;
  hasDashboardButton?: boolean;
  rightContent?: React.ReactNode;
  className?: string;
}

const HeaderExtended: React.FC<HeaderExtendedProps> = ({
  title,
  hasBackButton = true,
  hasDashboardButton = true,
  rightContent,
  className,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnDashboard = location.pathname === "/dashboard";
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {hasBackButton && !isOnDashboard && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {rightContent}
          <NotificationCenter />
          {hasDashboardButton && !isOnDashboard && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              aria-label="Go to dashboard"
            >
              <Home className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderExtended;
