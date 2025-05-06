import React, { useState, useEffect } from "react";
import { format, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Plus, Edit, Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import WeeklyCalendarView from "@/components/WeeklyCalendarView";
import LiftProgressGraph from "@/components/LiftProgressGraph";
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
import { WeeklyRoutine } from "@/types";

const WeeklyOverview: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const context = useAppContext();
  
  // Validate context is available
  if (!context) {
    throw new Error("WeeklyOverview must be used within an AppProvider");
  }
  
  const { 
    weeklyRoutines = [], 
    workoutTemplates = [], 
    addWeeklyRoutine,
    updateWeeklyRoutine
  } = context;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  
  useEffect(() => {
    // Data loading and validation
    try {
      setIsLoading(true);
      
      // Validate data structures
      if (!Array.isArray(weeklyRoutines)) {
        throw new Error("Weekly routines data is invalid");
      }
      
      if (!Array.isArray(workoutTemplates)) {
        throw new Error("Workout templates data is invalid");
      }
      
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error loading weekly overview data:", error.message);
      setError("Failed to load weekly overview data. Please try again.");
      setIsLoading(false);
    }
  }, [weeklyRoutines, workoutTemplates]);
  
  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const previousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  
  const handleDayClick = (dayIndex: number) => {
    try {
      setSelectedDayIndex(dayIndex);
      
      const activeRoutine = Array.isArray(weeklyRoutines) ? 
        weeklyRoutines.find(r => r && !r.archived) : 
        undefined;
        
      if (activeRoutine) {
        const workoutDay = activeRoutine.workoutDays && activeRoutine.workoutDays.find(day => day && day.dayOfWeek === dayIndex);
        setSelectedWorkoutId(workoutDay?.workoutTemplateId || null);
      } else {
        setSelectedWorkoutId(null);
      }
      
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error handling day click:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAssignWorkout = () => {
    try {
      if (selectedDayIndex === null) return;
      
      const activeRoutine = Array.isArray(weeklyRoutines) ? 
        weeklyRoutines.find(r => r && !r.archived) : 
        undefined;
        
      if (activeRoutine && updateWeeklyRoutine) {
        const workoutName = selectedWorkoutId && Array.isArray(workoutTemplates)
          ? workoutTemplates.find(t => t && t.id === selectedWorkoutId)?.name || ""
          : "";
          
        const updatedWorkoutDays = [...(activeRoutine.workoutDays || [])];
        const existingDayIndex = updatedWorkoutDays.findIndex(day => day && day.dayOfWeek === selectedDayIndex);
        
        if (existingDayIndex >= 0) {
          if (selectedWorkoutId) {
            updatedWorkoutDays[existingDayIndex] = {
              ...updatedWorkoutDays[existingDayIndex],
              workoutTemplateId: selectedWorkoutId,
              workoutName
            };
          } else {
            updatedWorkoutDays.splice(existingDayIndex, 1);
          }
        } else if (selectedWorkoutId) {
          updatedWorkoutDays.push({
            id: uuidv4(),
            dayOfWeek: selectedDayIndex,
            workoutTemplateId: selectedWorkoutId,
            workoutName
          });
        }
        
        updateWeeklyRoutine({
          ...activeRoutine,
          workoutDays: updatedWorkoutDays
        });
      } else if (selectedWorkoutId && addWeeklyRoutine) {
        const workoutName = Array.isArray(workoutTemplates)
          ? workoutTemplates.find(t => t && t.id === selectedWorkoutId)?.name || ""
          : "";
          
        const newRoutine: WeeklyRoutine = {
          id: uuidv4(),
          name: "Weekly Plan",
          workoutDays: [{
            id: uuidv4(),
            dayOfWeek: selectedDayIndex,
            workoutTemplateId: selectedWorkoutId,
            workoutName
          }],
          days: {},
          archived: false
        };
        
        addWeeklyRoutine(newRoutine);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error assigning workout:", error);
      toast({
        title: "Error",
        description: "Failed to assign workout. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveWorkout = () => {
    try {
      if (selectedDayIndex === null) return;
      
      const activeRoutine = Array.isArray(weeklyRoutines) ? 
        weeklyRoutines.find(r => r && !r.archived) : 
        undefined;
        
      if (activeRoutine && updateWeeklyRoutine) {
        const updatedWorkoutDays = (activeRoutine.workoutDays || []).filter(
          day => day && day.dayOfWeek !== selectedDayIndex
        );
        
        updateWeeklyRoutine({
          ...activeRoutine,
          workoutDays: updatedWorkoutDays
        });
        
        toast({
          title: "Workout removed",
          description: `Workout removed from day ${selectedDayIndex + 1}`
        });
      }
      
      setConfirmDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error removing workout:", error);
      toast({
        title: "Error",
        description: "Failed to remove workout. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleViewWorkout = (workoutId: string) => {
    navigate(`/exercise-plans/days/${workoutId}`);
  };
  
  const handleStartWorkout = (workoutId: string) => {
    navigate(`/live-workout/${workoutId}?isTemplate=true`);
  };
  
  const getDayName = (dayIndex: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
  };
  
  // Fix: Create a constant for the "rest day" option that doesn't use an empty string
  const REST_DAY_OPTION = "rest_day";

  const handleCreateRoutine = () => {
    try {
      if (!addWeeklyRoutine) {
        toast({
          title: "Error",
          description: "Cannot create routine. Function not available.",
          variant: "destructive"
        });
        return;
      }
      
      const newRoutine: WeeklyRoutine = {
        id: uuidv4(),
        name: "New Weekly Schedule",
        workoutDays: [],
        days: {},
        archived: false
      };
      
      addWeeklyRoutine(newRoutine);
      navigate(`/routines/${newRoutine.id}`);
    } catch (error) {
      console.error("Error creating routine:", error);
      toast({
        title: "Error",
        description: "Failed to create routine. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Weekly Overview" />
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader className="animate-spin h-8 w-8 mx-auto mb-4" />
            <p className="text-muted-foreground">Loading weekly overview...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Weekly Overview" />
        <div className="p-4 text-center">
          <div className="bg-destructive/10 p-4 rounded-md mb-4">
            <p className="text-destructive">{error}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
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
          <LiftProgressGraph />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Weekly Schedule</h3>
            
            <div className="grid grid-cols-1 gap-2">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const activeRoutine = Array.isArray(weeklyRoutines) ? 
                  weeklyRoutines.find(r => r && !r.archived) : 
                  undefined;
                const workoutDay = activeRoutine?.workoutDays?.find(day => day && day.dayOfWeek === dayIndex);
                const workout = workoutDay?.workoutTemplateId && Array.isArray(workoutTemplates)
                  ? workoutTemplates.find(t => t && t.id === workoutDay.workoutTemplateId)
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
                          {workout.exercises?.length || 0} exercises
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
              value={selectedWorkoutId || REST_DAY_OPTION} 
              onValueChange={(value) => setSelectedWorkoutId(value === REST_DAY_OPTION ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a workout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={REST_DAY_OPTION}>Rest Day (No Workout)</SelectItem>
                {Array.isArray(workoutTemplates) && workoutTemplates.map((template) => (
                  template && (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.exercises?.length || 0} exercises)
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
            
            {(!Array.isArray(workoutTemplates) || workoutTemplates.length === 0) && (
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
