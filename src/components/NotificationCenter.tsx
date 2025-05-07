
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppContext } from "@/context/AppContext";
import ReminderItem from "./ReminderItem";
import { Reminder } from "@/types";

const NotificationCenter: React.FC = () => {
  const { reminders, markReminderAsSeen } = useAppContext();
  const [unseenCount, setUnseenCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Calculate number of unseen reminders
    const count = reminders.filter(r => !r.seen).length;
    setUnseenCount(count);
  }, [reminders]);

  const handleMarkAsSeen = async (id: string) => {
    try {
      await markReminderAsSeen(id);
    } catch (error) {
      console.error("Failed to mark reminder as seen:", error);
    }
  };

  const handleMarkAllAsSeen = async () => {
    try {
      // Update all unseen reminders
      const promises = reminders
        .filter(r => !r.seen)
        .map(r => markReminderAsSeen(r.id));
      
      await Promise.all(promises);
    } catch (error) {
      console.error("Failed to mark all reminders as seen:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unseenCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unseenCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {unseenCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mb-4"
              onClick={handleMarkAllAsSeen}
            >
              Mark all as read
            </Button>
          )}
          
          {reminders.length > 0 ? (
            <div className="space-y-2">
              {reminders.map((reminder: Reminder) => (
                <ReminderItem
                  key={reminder.id}
                  reminder={reminder}
                  onMarkAsSeen={() => handleMarkAsSeen(reminder.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No notifications to display
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationCenter;
