
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, ArrowUpRight, ChevronRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { CORE_LIFTS } from "@/hooks/useExercises";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface CoreLift {
  id: string;
  name: string;
  currentPR: {
    weight: number;
    reps: number;
    date: Date | string;
  } | null;
}

const CorePRTracker = () => {
  const { prLifts } = useAppContext();
  const navigate = useNavigate();
  const [coreLifts, setCoreLifts] = useState<CoreLift[]>([]);

  // Find core lift PRs among all PR data
  useEffect(() => {
    if (!prLifts || prLifts.length === 0) {
      setCoreLifts(
        CORE_LIFTS.map((lift) => ({
          ...lift,
          currentPR: null,
        }))
      );
      return;
    }

    const liftsWithPRs = CORE_LIFTS.map((coreLift) => {
      // Get PRs for this core lift
      const exercisePRs = prLifts.filter(
        (pr) => pr.exercise.toLowerCase().includes(coreLift.name.toLowerCase())
      );

      if (exercisePRs.length === 0) {
        return {
          ...coreLift,
          currentPR: null,
        };
      }

      // Find the PR with the highest weight
      const bestPR = exercisePRs.reduce((best, current) => {
        if (!best) return current;

        // Calculate estimated 1RM for comparison
        const bestEstimated = best.weight * (1 + best.reps / 30);
        const currentEstimated = current.weight * (1 + current.reps / 30);

        return currentEstimated > bestEstimated ? current : best;
      }, exercisePRs[0]);

      return {
        ...coreLift,
        currentPR: {
          weight: bestPR.weight,
          reps: bestPR.reps,
          date: bestPR.date,
        },
      };
    });

    setCoreLifts(liftsWithPRs);
  }, [prLifts]);

  if (coreLifts.length === 0) {
    return null;
  }

  const handleAddPR = () => {
    navigate("/profile?tab=prs");
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    try {
      if (typeof date === 'string') {
        return format(new Date(date), "MMM d, yyyy");
      }
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Dumbbell className="w-5 h-5 mr-2" />
            Core Lift PRs
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
            onClick={handleAddPR}
          >
            Add PR <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {coreLifts.map((lift) => (
          <div key={lift.id} className="py-2 border-b last:border-0">
            <div className="font-medium">{lift.name}</div>
            {lift.currentPR ? (
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm flex items-center space-x-3">
                  <span className="font-semibold text-gym-purple">
                    {lift.currentPR.weight} kg × {lift.currentPR.reps}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(lift.currentPR.date)}
                  </span>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-green-500"
                  aria-label="Increasing"
                />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mt-1">
                No PR recorded yet
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CorePRTracker;
