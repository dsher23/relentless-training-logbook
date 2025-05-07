import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { PopoverClose } from '@radix-ui/react-popover';
import { useAppContext } from '@/context/AppContext';
import { WeeklyRoutine } from '@/types';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '@/components/NavigationHeader';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeeklyOverview: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [workoutDays, setWorkoutDays] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { addRoutine } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const currentDay = format(new Date(), 'eeee').toLowerCase();
    // Simulate a click on the current day button when the component mounts
    setTimeout(() => {
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      document.getElementById('day-btn-' + currentDay)?.dispatchEvent(clickEvent);
    }, 0);
  }, []);

  const handleDayClick = (day: string) => {
    const dayLower = day.toLowerCase();
    setWorkoutDays(prevDays => {
      if (prevDays.includes(dayLower)) {
        return prevDays.filter(d => d !== dayLower);
      } else {
        return [...prevDays, dayLower];
      }
    });
  };

  const isDayActive = (day: string) => {
    return workoutDays.includes(day.toLowerCase());
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setIsPickerOpen(false);
    }
  };

  const generateRoutine = () => {
    const routine: WeeklyRoutine = {
      id: "temp-id",
      name: "Current Week",
      workoutDays: workoutDays,
      days: {},
      workouts: [],
      archived: false,
      startDate: "",
      endDate: ""
    };

    addRoutine(routine);
    navigate('/training');
  };

  return (
    <div className="container pb-16">
      <NavigationHeader title="Weekly Overview" showBack={true} />
      <div className="mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Workout Days</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="date">Date</Label>
              <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarUI
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map(day => (
                <Button
                  key={day}
                  id={`day-btn-${day.toLowerCase()}`}
                  variant={isDayActive(day) ? "default" : "outline"}
                  onClick={() => handleDayClick(day)}
                >
                  {day.substring(0, 3)}
                </Button>
              ))}
            </div>
            <Button onClick={generateRoutine}>Generate Routine</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeeklyOverview;
