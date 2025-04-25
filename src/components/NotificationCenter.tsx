
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { Reminder } from "@/types";
import ReminderItem from "./ReminderItem";

const NotificationCenter: React.FC = () => {
  const { reminders, getDueReminders, markReminderAsSeen } = useAppContext();
  const [open, setOpen] = useState(false);
  const [dueReminders, setDueReminders] = useState<Reminder[]>([]);
  
  // Find reminders that are due
  useEffect(() => {
    const due = getDueReminders();
    setDueReminders(due);
  }, [reminders, getDueReminders]);
  
  // Mark reminders as seen when popover is opened
  useEffect(() => {
    if (open && dueReminders.length > 0) {
      dueReminders.forEach(reminder => {
        if (!reminder.seen) {
          markReminderAsSeen(reminder.id);
        }
      });
    }
  }, [open, dueReminders, markReminderAsSeen]);
  
  // Count unseen reminders
  const unseenCount = dueReminders.filter(r => !r.seen).length;
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unseenCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unseenCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 max-h-96 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        {dueReminders.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div>
            {dueReminders.map((reminder) => (
              <ReminderItem key={reminder.id} reminder={reminder} />
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
