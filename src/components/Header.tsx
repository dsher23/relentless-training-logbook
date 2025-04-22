
// This is a read-only file, we should create a HeaderExtended component instead
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationCenter from "@/components/NotificationCenter";

interface HeaderProps {
  title: string;
  hasBackButton?: boolean;
  rightContent?: React.ReactNode;
}

const HeaderExtended: React.FC<HeaderProps> = ({
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
      <div className="flex items-center">
        <NotificationCenter />
        {rightContent}
      </div>
    </div>
  );
};

export default HeaderExtended;
