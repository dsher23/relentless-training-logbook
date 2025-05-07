
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MoodLog as MoodLogType } from '@/types';
import { useAppContext } from '@/context/AppContext';
import MoodLogForm from '@/components/MoodLogForm';
import NavigationHeader from '@/components/NavigationHeader';

const MoodLog = () => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('today');
  const { moodLogs = [] } = useAppContext();

  // Sort logs by date (newest first)
  const sortedLogs = [...moodLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get today's logs
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayLogs = sortedLogs.filter(log => log.date.startsWith(today));
  
  // Get logs from the past 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekLogs = sortedLogs.filter(log => 
    new Date(log.date) >= sevenDaysAgo
  );

  // Format the mood score for display
  const getMoodEmoji = (score: number) => {
    if (score <= 3) return '😞';
    if (score <= 5) return '😐';
    if (score <= 8) return '🙂';
    return '😁';
  };

  return (
    <div className="container pb-16">
      <NavigationHeader title="Mood Tracking" showBack={true} />
      <div className="mt-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Mood Log</CardTitle>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    New Entry
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <MoodLogForm onClose={() => setOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Past 7 Days</TabsTrigger>
                <TabsTrigger value="all">All Entries</TabsTrigger>
              </TabsList>
              
              <TabsContent value="today">
                {todayLogs.length > 0 ? (
                  <div className="space-y-3">
                    {todayLogs.map((log) => (
                      <MoodLogItem key={log.id} log={log} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No mood logs recorded today</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setOpen(true)}
                    >
                      Record Your Mood
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="week">
                {weekLogs.length > 0 ? (
                  <div className="space-y-3">
                    {weekLogs.map((log) => (
                      <MoodLogItem key={log.id} log={log} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No mood logs in the past week</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all">
                {sortedLogs.length > 0 ? (
                  <div className="space-y-3">
                    {sortedLogs.map((log) => (
                      <MoodLogItem key={log.id} log={log} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No mood logs recorded yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface MoodLogItemProps {
  log: MoodLogType;
}

const MoodLogItem = ({ log }: MoodLogItemProps) => {
  // Format the date for display
  const displayDate = format(new Date(log.date), 'EEEE, MMMM d, yyyy');
  const displayTime = log.time;
  
  // Get mood emoji based on score
  const moodEmoji = (() => {
    if (log.mood <= 3) return '😞';
    if (log.mood <= 5) return '😐';
    if (log.mood <= 8) return '🙂';
    return '😁';
  })();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{moodEmoji}</span>
              <span className="font-medium">
                Mood Score: {log.mood}/10
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1 gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{displayDate} at {displayTime}</span>
            </div>
            {log.notes && (
              <div className="mt-2 text-sm border-t pt-2">
                {log.notes}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end text-sm">
            {log.energy && (
              <span className="text-muted-foreground">
                Energy: {log.energy}
              </span>
            )}
            {log.sleep && (
              <span className="text-muted-foreground">
                Sleep: {log.sleep} hours
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodLog;
