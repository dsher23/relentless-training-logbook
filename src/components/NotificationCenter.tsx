import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import ReminderItem from "./ReminderItem";

const NotificationCenter: React.FC = () => {
  const { reminders, getDueReminders, markReminderAsSeen } = useAppContext();
  const { toast } = useToast();
  const [dueReminders, setDueReminders] = useState(reminders);

  useEffect(() => {
    const fetchDueReminders = () => {
      const due = getDueReminders();
      setDueReminders(due);
    };
    fetchDueReminders();
  }, [getDueReminders, reminders]);

  const handleMarkAsSeen = async (id: string) => {
    try {
      await markReminderAsSeen(id);
      console.log("NotificationCenter.tsx: Reminder marked as seen:", id);
      toast({
        title: "Success",
        description: "Reminder marked as seen.",
      });
      // Refresh due reminders after marking one as seen
      const updatedDueReminders = getDueReminders();
      setDueReminders(updatedDueReminders);
    } catch (error) {
      console.error("NotificationCenter.tsx: Error marking reminder as seen:", error);
      toast({
        title: "Error",
        description: "Failed to mark reminder as seen.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {dueReminders.length === 0 ? (
          <p>No due reminders.</p>
        ) : (
          dueReminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onMarkAsSeen={() => handleMarkAsSeen(reminder.id)}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
