
import React from "react";
import { format } from "date-fns";
import { Bell, Calendar, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { Reminder } from "@/types";

interface ReminderItemProps {
  reminder: Reminder;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder }) => {
  const { dismissReminder } = useAppContext();
  
  const getIcon = () => {
    switch (reminder.type) {
      case "supplement":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "workout":
        return <Calendar className="h-5 w-5 text-green-500" />;
      case "routineChange":
        return <Bell className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center">
        <div className="mr-3">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-sm font-medium">{reminder.title}</h3>
          <p className="text-xs text-muted-foreground">{reminder.message}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(reminder.dateTime), "MMM d, h:mm a")}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 rounded-full p-0"
        onClick={() => dismissReminder(reminder.id)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </div>
  );
};

export default ReminderItem;
