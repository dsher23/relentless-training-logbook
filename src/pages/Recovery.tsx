
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { BarChart, Sun, Moon, Activity, Smile, Meh, Frown } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { MoodLog } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const Recovery: React.FC = () => {
  const { moodLogs, setMoodLogs } = useAppContext();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [mood, setMood] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [sleepQuality, setSleepQuality] = useState<number>(5);
  const [sleep, setSleep] = useState<number>(8);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const { toast } = useToast();
  
  useEffect(() => {
    if (date) {
      const existingLog = moodLogs.find(log => format(new Date(log.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
      if (existingLog) {
        setMood(existingLog.mood);
        setNotes(existingLog.notes || "");
        setSleepQuality(existingLog.sleepQuality || 5);
        setSleep(existingLog.sleep || 8);
        setEnergyLevel(existingLog.energyLevel || 5);
        setStressLevel(existingLog.stressLevel || 5);
      } else {
        setMood("");
        setNotes("");
        setSleepQuality(5);
        setSleep(8);
        setEnergyLevel(5);
        setStressLevel(5);
      }
    }
  }, [date, moodLogs]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Missing Date",
        description: "Please select a date for your mood log.",
        variant: "destructive"
      });
      return;
    }
    
    if (!mood) {
      toast({
        title: "Missing Mood",
        description: "Please select a mood for the log.",
        variant: "destructive"
      });
      return;
    }
    
    const newLog: MoodLog = {
      id: uuidv4(),
      date: date,
      mood: mood,
      notes: notes,
      sleepQuality: sleepQuality,
      sleep: sleep,
      energyLevel: energyLevel,
      stressLevel: stressLevel
    };
    
    setMoodLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(log => format(new Date(log.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
      if (existingLogIndex > -1) {
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = newLog;
        return updatedLogs;
      } else {
        return [...prevLogs, newLog];
      }
    });
    
    toast({
      title: "Mood Log Saved",
      description: "Your mood log has been saved successfully.",
    });
  };
  
  return (
    <div className="app-container animate-fade-in pb-8">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Recovery &amp; Mood Tracking</h1>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            {date ? (
              <p className="text-muted-foreground">
                {format(date, 'PPP')}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Please select a date.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Log Your Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
                  Mood
                </label>
                <div className="mt-1">
                  <Select 
                    value={mood} 
                    onValueChange={(value) => setMood(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        <Frown className="mr-2 h-4 w-4 inline-block align-middle" /> Awful
                      </SelectItem>
                      <SelectItem value="2">
                        <Frown className="mr-2 h-4 w-4 inline-block align-middle" /> Bad
                      </SelectItem>
                      <SelectItem value="3">
                        <Meh className="mr-2 h-4 w-4 inline-block align-middle" /> Okay
                      </SelectItem>
                      <SelectItem value="4">
                        <Smile className="mr-2 h-4 w-4 inline-block align-middle" /> Good
                      </SelectItem>
                      <SelectItem value="5">
                        <Smile className="mr-2 h-4 w-4 inline-block align-middle" /> Great
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <div className="mt-1">
                  <Textarea
                    id="notes"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sleepQuality" className="block text-sm font-medium text-gray-700">
                    Sleep Quality (1-10)
                  </label>
                  <Input
                    type="number"
                    id="sleepQuality"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(Number(e.target.value))}
                  />
                </div>
                
                <div>
                  <label htmlFor="sleep" className="block text-sm font-medium text-gray-700">
                    Hours of Sleep
                  </label>
                  <Input
                    type="number"
                    id="sleep"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={sleep}
                    onChange={(e) => setSleep(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="energyLevel" className="block text-sm font-medium text-gray-700">
                    Energy Level (1-10)
                  </label>
                  <Input
                    type="number"
                    id="energyLevel"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                  />
                </div>
                
                <div>
                  <label htmlFor="stressLevel" className="block text-sm font-medium text-gray-700">
                    Stress Level (1-10)
                  </label>
                  <Input
                    type="number"
                    id="stressLevel"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Button type="submit" className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple">
                  Save Log
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recovery;
