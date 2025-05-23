import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { Workout } from "@/types";
import { format, isSameDay, startOfWeek, addDays } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WeeklyCalendarView: React.FC<WeeklyCalendarProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const { workouts, workoutTemplates, weeklyRoutines, updateWorkout } = useAppContext();
  const navigate = useNavigate();
  
  // Get current week days
  const startOfTheWeek = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfTheWeek, i));
  
  // Get active routine (non-archived)
  const activeRoutine = weeklyRoutines.find(r => !r.archived);
  
  // Find workouts for each day of the week
  const getWorkoutForDay = (date: Date): Workout | undefined => {
    return workouts.find(workout => 
      isSameDay(new Date(workout.date), date)
    );
  };
  
  // Get scheduled workout template for a day of week
  const getScheduledWorkoutTemplate = (dayOfWeek: number) => {
    if (!activeRoutine) return null;
    
    const workoutDay = activeRoutine.workoutDays.find(wd => wd.dayOfWeek === dayOfWeek);
    if (!workoutDay || !workoutDay.workoutTemplateId) return null;
    
    return workoutTemplates.find(t => t.id === workoutDay.workoutTemplateId);
  };
  
  const handleDayClick = (date: Date, workout?: Workout) => {
    onDateChange(date);
    
    if (workout) {
      navigate(`/workouts/${workout.id}`);
    } else {
      // Check if there's a scheduled template for this day
      const dayOfWeek = date.getDay();
      const template = getScheduledWorkoutTemplate(dayOfWeek);
      
      if (template) {
        navigate(`/workouts/new?templateId=${template.id}&date=${format(date, 'yyyy-MM-dd')}`);
      } else {
        navigate(`/workouts/new?date=${format(date, 'yyyy-MM-dd')}`);
      }
    }
  };
  
  const toggleCompleted = async (e: React.MouseEvent, workout: Workout) => {
    e.stopPropagation();
    await updateWorkout(workout.id, {
      ...workout,
      completed: !workout.completed
    });
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground p-1"
            >
              {day}
            </div>
          ))}
          
          {weekDays.map((date, i) => {
            const workout = getWorkoutForDay(date);
            const template = getScheduledWorkoutTemplate(i);
            const isToday = isSameDay(date, new Date());
            const isSelected = isSameDay(date, selectedDate);
            
            return (
              <div
                key={date.toString()}
                className={`
                  min-h-[80px] p-1 border rounded-md cursor-pointer transition-colors
                  ${isToday ? "bg-secondary/50" : ""}
                  ${isSelected ? "border-primary" : "border-border"}
                  ${workout ? "hover:bg-secondary/50" : "hover:bg-secondary/20"}
                `}
                onClick={() => handleDayClick(date, workout)}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-medium ${isToday ? "text-primary" : ""}`}>
                    {format(date, "d")}
                  </span>
                  
                  {workout?.completed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
                      onClick={(e) => toggleCompleted(e, workout)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {workout && !workout.completed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full bg-secondary hover:bg-secondary/80"
                      onClick={(e) => toggleCompleted(e, workout)}
                    >
                      <span className="sr-only">Mark as complete</span>
                    </Button>
                  )}
                </div>
                
                <div className="mt-1">
                  {workout ? (
                    <div className="text-xs font-medium truncate">
                      {workout.name}
                      {workout.scheduledTime && (
                        <div className="text-xs text-muted-foreground">
                          {workout.scheduledTime}
                        </div>
                      )}
                    </div>
                  ) : template ? (
                    <div className="text-xs font-medium truncate">
                      <span className="text-muted-foreground">{template.name}</span>
                      {template.scheduledTime && (
                        <div className="text-xs text-muted-foreground">
                          {template.scheduledTime}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendarView;
