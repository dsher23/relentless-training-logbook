
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationCenter from "@/components/NotificationCenter";
import Logo from "@/components/Logo";

interface HeaderProps {
  title: string;
  hasBackButton?: boolean;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  hasBackButton = true,
  rightContent,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center">
        {hasBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        {rightContent}
        <NotificationCenter />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          title="Go to Dashboard"
          className="text-primary hover:bg-primary/10"
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Dashboard</span>
        </Button>
      </div>
    </div>
  );
};

export default Header;
