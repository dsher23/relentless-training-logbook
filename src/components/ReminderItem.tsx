
import React from 'react';
import { Reminder } from '@/types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Check } from 'lucide-react';

export interface ReminderItemProps {
  reminder: Reminder;
  onMarkAsSeen: () => Promise<void>;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onMarkAsSeen }) => {
  const handleMarkAsSeen = async () => {
    await onMarkAsSeen();
  };

  // Format the due date for display
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <Card className={`mb-2 ${reminder.seen ? 'opacity-60' : ''}`}>
      <CardContent className="p-3 flex items-center justify-between">
        <div>
          <h4 className="font-medium">{reminder.type}</h4>
          <p className="text-sm text-muted-foreground">
            Due: {formatDueDate(reminder.dueDate)} at {reminder.time}
          </p>
          <p className="text-xs mt-1">
            Repeats on: {reminder.days.join(', ')}
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={handleMarkAsSeen} disabled={reminder.seen}>
          <Check className="h-4 w-4" />
          <span className="sr-only">Mark as seen</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReminderItem;
