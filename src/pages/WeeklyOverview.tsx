
import React, { useState } from "react";
import { format, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import WeeklyCalendarView from "@/components/WeeklyCalendarView";
import WeeklyLiftsGraph from "@/components/WeeklyLiftsGraph";

const WeeklyOverview: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const previousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  return (
    <div className="app-container animate-fade-in">
      <Header title="Weekly Overview" />
      
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous week</span>
          </Button>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold flex items-center justify-center">
              <Calendar className="h-5 w-5 mr-2 text-gym-purple" />
              <span>{format(currentDate, "MMMM d, yyyy")}</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Week of {format(currentDate, "MMM d")}
            </p>
          </div>
          
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next week</span>
          </Button>
        </div>
        
        <div className="space-y-6">
          <WeeklyLiftsGraph currentDate={currentDate} />
          <WeeklyCalendarView 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyOverview;
