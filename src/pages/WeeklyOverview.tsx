
import React, { useState } from "react";
import { format, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import WeeklyCalendarView from "@/components/WeeklyCalendarView";
import WeeklyLiftsGraph from "@/components/WeeklyLiftsGraph";
import { useAppContext } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

const WeeklyOverview: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { weeklyRoutines, workoutTemplates, assignWorkoutToDay, removeWorkoutFromDay } = useAppContext();
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  
  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const previousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const handleDayClick = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    
    // Find if there's already a workout assigned to this day
    const activeRoutine = weeklyRoutines.find(r => !r.archived);
    if (activeRoutine) {
      const workoutDay = activeRoutine.workoutDays.find(day => day.dayOfWeek === dayIndex);
      setSelectedWorkoutId(workoutDay?.workoutTemplateId || null);
    } else {
      setSelectedWorkoutId(null);
    }
    
    setIsDialogOpen(true);
  };
  
  const handleAssignWorkout = () => {
    if (selectedDayIndex === null) return;
    
    const activeRoutine = weeklyRoutines.find(r => !r.archived);
    
    if (activeRoutine) {
      // If a routine exists, update it
      const workoutName = selectedWorkoutId 
        ? workoutTemplates.find(t => t.id === selectedWorkoutId)?.name || ""
        : "";
        
      assignWorkoutToDay(activeRoutine.id, selectedDayIndex, selectedWorkoutId, workoutName);
    } else if (selectedWorkoutId) {
      // If no routine exists but a workout was selected, create a new routine
      const workoutName = workoutTemplates.find(t => t.id === selectedWorkoutId)?.name || "";
      const newRoutine = {
        id: uuidv4(),
        name: "Weekly Plan",
        workoutDays: [{
          id: uuidv4(),
          dayOfWeek: selectedDayIndex,
          workoutTemplateId: selectedWorkoutId,
          workoutName
        }],
        archived: false
      };
      
      addWeeklyRoutine(newRoutine);
    }
    
    setIsDialogOpen(false);
  };
  
  const handleRemoveWorkout = () => {
    if (selectedDayIndex === null) return;
    
    const activeRoutine = weeklyRoutines.find(r => !r.archived);
    if (activeRoutine) {
      removeWorkoutFromDay(activeRoutine.id, selectedDayIndex);
    }
    
    setConfirmDeleteDialogOpen(false);
  };
  
  const handleViewWorkout = (workoutId: string) => {
    navigate(`/exercise-plans/days/${workoutId}`);
  };
  
  const handleStartWorkout = (workoutId: string) => {
    navigate(`/live-workout/${workoutId}?isTemplate=true`);
  };
  
  // Get day of week name
  const getDayName = (dayIndex: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
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
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Weekly Schedule</h3>
            
            <div className="grid grid-cols-1 gap-2">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const activeRoutine = weeklyRoutines.find(r => !r.archived);
                const workoutDay = activeRoutine?.workoutDays.find(day => day.dayOfWeek === dayIndex);
                const workout = workoutDay?.workoutTemplateId
                  ? workoutTemplates.find(t => t.id === workoutDay.workoutTemplateId)
                  : null;
                
                return (
                  <div
                    key={dayIndex}
                    className="border rounded-lg p-4 hover:border-primary cursor-pointer"
                    onClick={() => handleDayClick(dayIndex)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{getDayName(dayIndex)}</h4>
                      {!workout && (
                        <Button size="sm" variant="ghost">
                          <Plus className="h-4 w-4 mr-1" />
                          Assign Workout
                        </Button>
                      )}
                    </div>
                    
                    {workout ? (
                      <div className="mt-2">
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {workout.exercises.length} exercises
                        </p>
                        
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDayIndex(dayIndex);
                              setConfirmDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                          
                          <Button 
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewWorkout(workout.id);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          <Button 
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartWorkout(workout.id);
                            }}
                          >
                            Start
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">No workout assigned</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <WeeklyCalendarView 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
      
      {/* Workout Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDayIndex !== null && `Assign Workout for ${getDayName(selectedDayIndex)}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Select a workout to assign:
            </label>
            <Select 
              value={selectedWorkoutId || ""} 
              onValueChange={(value) => setSelectedWorkoutId(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a workout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Rest Day (No Workout)</SelectItem>
                {workoutTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.exercises.length} exercises)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {workoutTemplates.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No workouts available. Create workouts in the Workouts tab first.
              </p>
            )}
            
            <div className="mt-3 flex justify-between">
              <Button
                variant="outline" 
                onClick={() => navigate("/workouts/new")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New Workout
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignWorkout}>
              {selectedWorkoutId ? "Assign Workout" : "Set as Rest Day"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Remove Workout</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this workout from {selectedDayIndex !== null && getDayName(selectedDayIndex)}?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveWorkout}>
              Remove Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyOverview;
