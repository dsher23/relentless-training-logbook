
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Reminder } from '@/types';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const addReminder = (reminder: Omit<Reminder, 'id' | 'seen'>): Reminder => {
    const newReminder: Reminder = {
      id: uuidv4(),
      ...reminder,
      seen: false
    };
    
    setReminders([...reminders, newReminder]);
    return newReminder;
  };

  const updateReminder = (reminderId: string, updates: Partial<Reminder>): void => {
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId ? { ...reminder, ...updates } : reminder
    ));
  };

  const markReminderAsSeen = (reminderId: string): void => {
    updateReminder(reminderId, { seen: true });
  };

  const deleteReminder = (reminderId: string): void => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    markReminderAsSeen,
    deleteReminder
  };
};
