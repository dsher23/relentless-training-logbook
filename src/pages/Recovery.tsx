
import React from "react";
import { format } from "date-fns";
import { Moon, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MoodLogForm from "@/components/MoodLogForm";
import { MoodLog, useAppContext } from "@/context/AppContext";

const emojis = {
  terrible: "😖",
  bad: "😔",
  neutral: "😐",
  good: "😊",
  great: "🤩"
};

const Recovery: React.FC = () => {
  const { moodLogs } = useAppContext();
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  
  // Sort logs by date (newest first)
  const sortedLogs = [...moodLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Check if we already have a log for today
  const todayLog = sortedLogs.find(log => 
    format(new Date(log.date), 'yyyy-MM-dd') === todayString
  );
  
  return (
    <div className="app-container animate-fade-in">
      <Header title="Recovery & Mood" />
      
      {!todayLog ? (
        <div className="px-4 mb-8">
          <MoodLogForm />
        </div>
      ) : (
        <div className="px-4 mb-8">
          <Button
            className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple mb-4"
            onClick={() => {}}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Recovery Log
          </Button>
          
          <Card className="mb-6">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-secondary">
              <div className="flex items-center space-x-2">
                <Moon className="w-5 h-5 text-gym-purple" />
                <CardTitle className="text-base font-medium">
                  Today's Recovery Log
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Sleep</div>
                  <div className="text-lg font-medium">{todayLog.sleepQuality || todayLog.sleep || 0}/10</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Energy</div>
                  <div className="text-lg font-medium">{todayLog.energyLevel || todayLog.energy || 0}/10</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Mood</div>
                  <div className="text-2xl">{emojis[todayLog.mood]}</div>
                </div>
              </div>
              {todayLog.notes && (
                <div className="mt-4 p-3 bg-secondary rounded-md">
                  <p className="text-sm">{todayLog.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {sortedLogs.length > (todayLog ? 1 : 0) && (
        <section className="px-4">
          <h2 className="text-lg font-semibold mb-4">Recovery History</h2>
          {sortedLogs
            .filter(log => todayLog ? format(new Date(log.date), 'yyyy-MM-dd') !== todayString : true)
            .map(log => (
              <Card key={log.id} className="mb-4">
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-medium flex justify-between">
                    <span>{format(new Date(log.date), "MMMM d, yyyy")}</span>
                    <span className="text-lg">{emojis[log.mood]}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sleep:</span>
                      <span>{log.sleepQuality || log.sleep || 0}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Energy:</span>
                      <span>{log.energyLevel || log.energy || 0}/10</span>
                    </div>
                  </div>
                  {log.notes && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      {log.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </section>
      )}
    </div>
  );
};

export default Recovery;
