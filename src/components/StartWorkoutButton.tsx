
import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StartWorkoutButtonProps {
  workoutId: string;
  isTemplate?: boolean;
  className?: string;
}

const StartWorkoutButton: React.FC<StartWorkoutButtonProps> = ({
  workoutId,
  isTemplate = false,
  className,
}) => {
  const navigate = useNavigate();

  const handleStartWorkout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/live-workout/${workoutId}?isTemplate=${isTemplate}`);
  };

  return (
    <Button
      size="sm"
      onClick={handleStartWorkout}
      className={cn("bg-gym-blue hover:bg-gym-blue/90 text-white", className)}
    >
      <Play className="h-4 w-4 mr-1" /> Start
    </Button>
  );
};

export default StartWorkoutButton;
