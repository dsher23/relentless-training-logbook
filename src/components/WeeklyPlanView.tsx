import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useAppContext } from "@/context/AppContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { WeeklyRoutine, WorkoutTemplate } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import StartWorkoutButton from "./StartWorkoutButton";
import { useNavigate } from "react-router-dom";

const WeeklyPlanView: React.FC = () => {
  const { weeklyRoutines, workoutTemplates, workoutPlans, addWeeklyRoutine, updateWeeklyRoutine } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("none");
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Find or create the default weekly routine
  const currentRoutine = weeklyRoutines.find(r => !r.archived) || {
    id: uuidv4(),
    name: "My Weekly Plan",
    workoutDays: Array.from({ length: 7 }).map((_, i) => ({ 
      dayOfWeek: i, 
      workoutTemplateId: null
    })),
    archived: false
  };
  
  const handlePreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };
  
  const getAvailableWorkouts = () => {
    if (workoutTemplates.length === 0) {
      return [];
    }
    return workoutTemplates.map(template => ({
      id: template.id,
      name: template.name,
      exerciseCount: template.exercises.length
    }));
  };

  const handleDayClick = (dayIndex: number) => {
    const availableWorkouts = getAvailableWorkouts();
    if (availableWorkouts.length === 0) {
      toast({
        title: "No Workouts Available",
        description: "Create workouts in the Workouts tab first.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedDayIndex(dayIndex);
    const selectedDay = currentRoutine.workoutDays.find(day => day.dayOfWeek === dayIndex);
    setSelectedRoutineId(selectedDay?.workoutTemplateId || null);
    setIsDialogOpen(true);
    setSelectedPlanId("none");
  };
  
  const handleAssignWorkout = () => {
    if (selectedDayIndex === null) return;
    
    // Create a new weekly routine if none exists
    let updatedRoutine: WeeklyRoutine;
    
    if (!weeklyRoutines.some(r => !r.archived)) {
      updatedRoutine = {
        ...currentRoutine,
        workoutDays: currentRoutine.workoutDays.map(day => 
          day.dayOfWeek === selectedDayIndex 
            ? { ...day, workoutTemplateId: selectedRoutineId }
            : day
        ),
        archived: false
      };
      addWeeklyRoutine(updatedRoutine);
    } else {
      updatedRoutine = {
        ...currentRoutine,
        workoutDays: currentRoutine.workoutDays.map(day => 
          day.dayOfWeek === selectedDayIndex 
            ? { ...day, workoutTemplateId: selectedRoutineId }
            : day
        )
      };
      updateWeeklyRoutine(updatedRoutine);
    }
    
    toast({
      title: "Schedule Updated",
      description: selectedRoutineId 
        ? `Workout assigned to ${dayNames[selectedDayIndex]}` 
        : `Workout removed from ${dayNames[selectedDayIndex]}`,
    });
    
    setIsDialogOpen(false);
  };
  
  const getWorkoutForDay = (dayIndex: number) => {
    const day = currentRoutine.workoutDays.find(d => d.dayOfWeek === dayIndex);
    if (!day?.workoutTemplateId) return null;
    
    return workoutTemplates.find(t => t.id === day.workoutTemplateId);
  };
  
  const getTemplateById = (id: string | null) => {
    if (!id) return null;
    return workoutTemplates.find(t => t.id === id);
  };

  // Handle selecting a workout from a plan
  const handlePlanChange = (value: string) => {
    setSelectedPlanId(value);
    setSelectedRoutineId(null); // Reset workout selection when changing plans
  };

  // Get workouts from the selected plan
  const getWorkoutsFromPlan = () => {
    if (selectedPlanId === "none") return [];
    const plan = workoutPlans.find(p => p.id === selectedPlanId);
    return plan ? plan.workoutTemplates : [];
  };

  // Get all individual workouts not in plans
  const getIndividualWorkouts = () => {
    // Get IDs of all workouts that are in plans
    const planWorkoutIds = workoutPlans.flatMap(p => 
      p.workoutTemplates.map(t => t.id)
    );
    
    // Return workouts that aren't in any plan
    return workoutTemplates.filter(t => !planWorkoutIds.includes(t.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {format(weekStart, "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
        </span>
        <Button variant="outline" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {weekDays.map((day, index) => {
          const workoutTemplate = getWorkoutForDay(index);
          const isToday = format(new Date(), "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
          
          return (
            <Card 
              key={day.toString()}
              className={`${isToday ? "border-primary" : ""}`}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${isToday ? "text-primary" : ""}`}>
                      {dayNames[index]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(day, "MMM d")}
                    </div>
                  </div>
                  
                  {workoutTemplate ? (
                    <div className="flex gap-2 items-center">
                      <div className="text-sm">
                        {workoutTemplate.name}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({workoutTemplate.exercises.length})
                        </span>
                      </div>
                      <StartWorkoutButton
                        workoutId={workoutTemplate.id}
                        isTemplate
                        className="h-8 w-8 p-0"
                      />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDayClick(index)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                  )}
                </div>
                
                {workoutTemplate && (
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => handleDayClick(index)}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {workoutTemplates.length === 0 && (
        <div className="text-center p-4 mt-8 border border-dashed rounded-lg">
          <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Create workout routines to assign them to days
          </p>
          <Button onClick={() => navigate("/workouts/new")}>
            <Plus className="h-4 w-4 mr-1" />
            Create Routine
          </Button>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDayIndex !== null ? `Assign Workout for ${dayNames[selectedDayIndex]}` : "Assign Workout"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Step 1: Select Workout Plan */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Step 1: Select Workout Plan
              </label>
              <Select value={selectedPlanId} onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a workout plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Individual Workouts</SelectItem>
                  {workoutPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} ({plan.workoutTemplates.length} workouts)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Step 2: Select Workout */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Step 2: Select Workout
              </label>
              <Select 
                value={selectedRoutineId || "none"} 
                onValueChange={(value) => setSelectedRoutineId(value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a workout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Workout (Rest Day)</SelectItem>
                  
                  {selectedPlanId === "none" ? (
                    // Show individual workouts
                    getIndividualWorkouts().map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.exercises.length} exercises)
                      </SelectItem>
                    ))
                  ) : (
                    // Show workouts from selected plan
                    getWorkoutsFromPlan().map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.exercises.length} exercises)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {selectedRoutineId && (
              <div className="mt-4 p-3 bg-secondary rounded-md">
                <h4 className="font-medium">{getTemplateById(selectedRoutineId)?.name}</h4>
                <div className="text-sm text-muted-foreground mt-1">
                  {getTemplateById(selectedRoutineId)?.exercises.map(ex => ex.name).join(", ")}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignWorkout}>
              {selectedRoutineId ? "Assign Workout" : "Set as Rest Day"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyPlanView;
