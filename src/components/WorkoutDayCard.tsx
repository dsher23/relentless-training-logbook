
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import type { WorkoutTemplate } from "@/types";

/**
 * Card for displaying a single workout day, with delete and edit actions.
 * @param {WorkoutTemplate} day - The workout day object.
 * @param {(day: WorkoutTemplate) => void} onEdit - Edit handler.
 * @param {(day: WorkoutTemplate, e: React.MouseEvent) => void} onDelete - Delete handler.
 */
interface WorkoutDayCardProps {
  day: WorkoutTemplate;
  onEdit: (day: WorkoutTemplate) => void;
  onDelete: (day: WorkoutTemplate, e: React.MouseEvent) => void;
}

const WorkoutDayCard: React.FC<WorkoutDayCardProps> = ({ day, onEdit, onDelete }) => (
  <Card className="hover:border-primary cursor-pointer" onClick={() => onEdit(day)}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{day.name || "Untitled Workout"}</h3>
          <p className="text-sm text-muted-foreground">
            {(day.exercises?.length ?? 0)} {(day.exercises?.length === 1 ? "exercise" : "exercises")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={e => onDelete(day, e)}
            aria-label="Delete Workout Day"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
          <Button
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onEdit(day);
            }}
            aria-label="Edit Workout"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default WorkoutDayCard;
