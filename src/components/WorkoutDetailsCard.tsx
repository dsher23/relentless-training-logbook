
import React from "react";
import { format } from "date-fns";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workout } from "@/types";

interface WorkoutDetailsCardProps {
  workout: Workout;
}

const WorkoutDetailsCard: React.FC<WorkoutDetailsCardProps> = ({ workout }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    // Navigate to the workout builder with the workout ID for editing
    navigate(`/workouts/builder/${workout.id}`);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Details</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{format(new Date(workout.date), "PPP")}</span>
          </div>
          
          {workout.notes && (
            <div className="pt-2 border-t mt-2">
              <p className="text-sm text-muted-foreground mb-1">Notes:</p>
              <p className="text-sm">{workout.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutDetailsCard;
