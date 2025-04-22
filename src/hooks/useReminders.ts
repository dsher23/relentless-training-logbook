
import { useState } from 'react';
import { Reminder } from '@/types';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const addReminder = (reminder: Reminder) => {
    setReminders([...reminders, reminder]);
  };

  const updateReminder = (reminder: Reminder) => {
    setReminders(reminders.map(r => r.id === reminder.id ? reminder : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getDueReminders = () => {
    const now = new Date();
    return reminders.filter(r => 
      new Date(r.dateTime || r.dueDate) <= now && !r.dismissed
    );
  };

  const markReminderAsSeen = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, seen: true } : r
    ));
  };

  const dismissReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, dismissed: true } : r
    ));
  };

  return {
    reminders,
    setReminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getDueReminders,
    markReminderAsSeen,
    dismissReminder,
  };
};
