import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Bell, Trash2 } from "lucide-react";
import { Supplement, SupplementLog, Reminder } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface SupplementItemProps {
  supplement: Supplement;
  log?: SupplementLog;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const SupplementItem: React.FC<SupplementItemProps> = ({ 
  supplement, 
  log,
  onEdit,
  onDelete
}) => {
  const { addReminder } = useAppContext();

  const handleCreateReminder = () => {
    if (!supplement) return;

    // Get today's date
    const today = new Date();
    const dueDate = today.toISOString().split('T')[0];
    
    // Default to morning time
    const defaultTime = "08:00";
    
    // Default to daily reminder
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const newReminder: Omit<Reminder, "id"> = {
      type: `Take ${supplement.name} - ${supplement.dosage}`,
      dueDate,
      time: supplement.time || defaultTime,
      days: supplement.days || days,
      seen: false
    };

    try {
      addReminder(newReminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
    }
  };

  // Format for displaying days
  const formatDays = (days?: string[]) => {
    if (!days || days.length === 0) return "Not specified";
    
    // If all days are included, just return "Daily"
    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (days.length === 7 && allDays.every(day => days.includes(day))) {
      return "Daily";
    }
    
    // If weekdays are included, simplify to "Weekdays"
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    if (weekdays.every(day => days.includes(day)) && !days.includes("Saturday") && !days.includes("Sunday")) {
      return "Weekdays";
    }
    
    // If weekends are included, simplify to "Weekends"
    const weekends = ["Saturday", "Sunday"];
    if (weekends.every(day => days.includes(day)) && days.length === 2) {
      return "Weekends";
    }
    
    // Otherwise just list the days
    return days.join(", ");
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{supplement.name}</h3>
            <p className="text-sm text-muted-foreground">{supplement.dosage}</p>
            {supplement.frequency && (
              <p className="text-sm flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                {supplement.frequency} - {formatDays(supplement.days)}
              </p>
            )}
            {supplement.notes && (
              <p className="text-sm mt-2 text-muted-foreground">{supplement.notes}</p>
            )}
            {log && (
              <div className="mt-2 text-sm">
                <p>Last taken: {formatDate(log.date)}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {onEdit && (
              <Button size="sm" variant="ghost" onClick={() => onEdit(supplement.id)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleCreateReminder}>
              <Bell className="h-4 w-4" />
              <span className="sr-only">Set Reminder</span>
            </Button>
            {onDelete && (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => onDelete(supplement.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplementItem;
