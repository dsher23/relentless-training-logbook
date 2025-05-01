
import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

interface StartWorkoutButtonProps {
  workoutId: string;
  isTemplate?: boolean;
  className?: string;
  compact?: boolean;
}

const StartWorkoutButton: React.FC<StartWorkoutButtonProps> = ({
  workoutId,
  isTemplate = false,
  className,
  compact = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workoutTemplates } = useAppContext();

  const handleStartWorkout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Check if the workout template exists
    const workoutExists = workoutTemplates.some(template => template.id === workoutId);
    
    if (workoutExists) {
      // Navigate to the live workout page with the workout ID
      navigate(`/live-workout/${workoutId}?isTemplate=${isTemplate}`);
    } else {
      // Show an error toast if the workout doesn't exist
      toast({
        title: "Workout Not Found",
        description: "The selected workout could not be found. Please try another workout.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      size={compact ? "sm" : "default"}
      onClick={handleStartWorkout}
      className={cn("bg-gym-blue hover:bg-gym-blue/90 text-white font-medium", className)}
    >
      <Play className="h-4 w-4 mr-1" /> {compact ? "" : "Start Workout"}
    </Button>
  );
};

export default StartWorkoutButton;
