
import React from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartWorkoutButtonProps {
  workoutId: string;
  isTemplate?: boolean;
  disabled?: boolean;
  className?: string;
}

const StartWorkoutButton: React.FC<StartWorkoutButtonProps> = ({ 
  workoutId, 
  isTemplate = false,
  disabled = false,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleStartWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTemplate) {
      navigate(`/workouts/new?templateId=${workoutId}&start=true`);
    } else {
      navigate(`/workouts/${workoutId}/live`);
    }
  };

  return (
    <Button
      size="sm"
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      disabled={disabled}
      onClick={handleStartWorkout}
    >
      <Play className="h-4 w-4 mr-1" /> Start
    </Button>
  );
};

export default StartWorkoutButton;
