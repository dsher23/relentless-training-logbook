
import React, { useState } from "react";
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
  const { workoutTemplates, getWorkoutById } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartWorkout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLoading(true);

    // Check if the workout template or workout exists
    let workoutExists = false;
    let workout = null;

    try {
      if (isTemplate) {
        workout = workoutTemplates.find(template => template.id === workoutId);
        workoutExists = !!workout;
      } else {
        workout = getWorkoutById(workoutId);
        workoutExists = !!workout;
      }

      if (workoutExists) {
        // Log for debugging
        console.log("Navigating to Live Workout with:", { workoutId, isTemplate, workout });

        // Show a confirmation toast
        toast({
          title: "Starting Workout",
          description: "Loading your workout session...",
        });

        // Navigate to the live-workout route
        setTimeout(() => {
          setIsLoading(false);
          navigate(`/live-workout/${workoutId}?isTemplate=${isTemplate}`);
        }, 300);
      } else {
        // Log for debugging
        console.log("Workout not found:", { workoutId, isTemplate });
        setIsLoading(false);

        // Show an error toast if the workout doesn't exist
        toast({
          title: "Workout Not Found",
          description: "The selected workout could not be found. Please try another workout.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error starting workout:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to start workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      size={compact ? "sm" : "default"}
      onClick={handleStartWorkout}
      className={cn("bg-gym-blue hover:bg-gym-blue/90 text-white font-medium", className)}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="animate-pulse">Loading...</span>
      ) : (
        <>
          <Play className="h-4 w-4 mr-1" /> {compact ? "" : "Start Workout"}
        </>
      )}
    </Button>
  );
};

export default StartWorkoutButton;
