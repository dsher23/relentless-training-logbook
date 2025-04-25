import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Plus, ChevronDown, ChevronUp, Edit, Dumbbell, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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
  
  const currentRoutine = weeklyRoutines.find(r => !r.archived) || {
    id: uuidv4(),
    name: "My Weekly Plan",
    workoutDays: [],
    days: {},
    archived: false
  };
  
  const handlePreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };
  
  const getWorkoutForDay = (dayIndex: number) => {
    const day = currentRoutine.workoutDays.find(d => d.dayOfWeek === dayIndex);
    if (!day?.workoutTemplateId) return null;
    
    return workoutTemplates.find(t => t.id === day.workoutTemplateId);
  };
  
  const handleDayClick = (dayIndex: number) => {
    const availableWorkouts = workoutTemplates;
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
    
    let workoutName = "Rest Day";
    if (selectedRoutineId) {
      const template = workoutTemplates.find(t => t.id === selectedRoutineId);
      if (template) {
        workoutName = template.name;
      }
    }
    
    let updatedRoutine: WeeklyRoutine;
    let existingDayIndex = currentRoutine.workoutDays.findIndex(day => day.dayOfWeek === selectedDayIndex);
    
    if (!weeklyRoutines.some(r => !r.archived)) {
      if (existingDayIndex >= 0) {
        const updatedDays = [...currentRoutine.workoutDays];
        updatedDays[existingDayIndex] = { 
          ...updatedDays[existingDayIndex],
          workoutTemplateId: selectedRoutineId,
          workoutName: workoutName 
        };
        
        updatedRoutine = {
          ...currentRoutine,
          workoutDays: updatedDays,
          archived: false,
          days: currentRoutine.days || {}
        };
      } else if (selectedRoutineId) {
        updatedRoutine = {
          ...currentRoutine,
          workoutDays: [
            ...currentRoutine.workoutDays,
            { 
              id: uuidv4(),
              dayOfWeek: selectedDayIndex, 
              workoutTemplateId: selectedRoutineId,
              workoutName: workoutName 
            }
          ],
          archived: false,
          days: currentRoutine.days || {}
        };
      } else {
        updatedRoutine = {
          ...currentRoutine,
          workoutDays: currentRoutine.workoutDays.filter(day => day.dayOfWeek !== selectedDayIndex),
          archived: false,
          days: currentRoutine.days || {}
        };
      }
      
      addWeeklyRoutine(updatedRoutine);
    } else {
      if (existingDayIndex >= 0) {
        const updatedDays = [...currentRoutine.workoutDays];
        
        if (selectedRoutineId) {
          updatedDays[existingDayIndex] = { 
            ...updatedDays[existingDayIndex],
            workoutTemplateId: selectedRoutineId,
            workoutName: workoutName 
          };
        } else {
          updatedDays.splice(existingDayIndex, 1);
        }
        
        updatedRoutine = {
          ...currentRoutine,
          workoutDays: updatedDays
        };
      } else if (selectedRoutineId) {
        updatedRoutine = {
          ...currentRoutine,
          workoutDays: [
            ...currentRoutine.workoutDays,
            { 
              id: uuidv4(),
              dayOfWeek: selectedDayIndex, 
              workoutTemplateId: selectedRoutineId,
              workoutName: workoutName 
            }
          ]
        };
      } else {
        updatedRoutine = currentRoutine;
      }
      
      if (updatedRoutine !== currentRoutine) {
        updateWeeklyRoutine(updatedRoutine);
      }
    }
    
    toast({
      title: "Schedule Updated",
      description: selectedRoutineId 
        ? `Workout assigned to ${dayNames[selectedDayIndex]}` 
        : `${dayNames[selectedDayIndex]} set as Rest Day`,
    });
    
    setIsDialogOpen(false);
  };
  
  const getTemplateById = (id: string | null) => {
    if (!id) return null;
    return workoutTemplates.find(t => t.id === id);
  };

  const handlePlanChange = (value: string) => {
    setSelectedPlanId(value);
    setSelectedRoutineId(null);
  };

  const getWorkoutsFromPlan = () => {
    if (selectedPlanId === "none") return [];
    const plan = workoutPlans.find(p => p.id === selectedPlanId);
    return plan ? plan.workoutTemplates : [];
  };

  const getIndividualWorkouts = () => {
    return workoutTemplates;
  };
  
  const handleViewWorkout = (workoutTemplateId: string) => {
    navigate(`/exercise-plans/days/${workoutTemplateId}`);
  };
  
  const isCurrentWeek = (date: Date) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - dayOfWeek);
    startOfCurrentWeek.setHours(0, 0, 0, 0);
    
    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6);
    endOfCurrentWeek.setHours(23, 59, 59, 999);
    
    return date >= startOfCurrentWeek && date <= endOfCurrentWeek;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {format(weekStart, "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
          {isCurrentWeek(weekStart) && (
            <Badge variant="outline" className="ml-2 bg-primary/10">Current Week</Badge>
          )}
        </span>
        <Button variant="outline" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Accordion type="multiple" defaultValue={["0", "1", "2", "3", "4", "5", "6"]} className="space-y-2">
        {weekDays.map((day, index) => {
          const workoutTemplate = getWorkoutForDay(index);
          const isToday = format(new Date(), "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
          
          return (
            <AccordionItem key={day.toString()} value={index.toString()} className="border rounded-md overflow-hidden">
              <Card className={`${isToday ? "border-primary bg-primary/5" : ""} border-0`}>
                <CardHeader className="p-0">
                  <AccordionTrigger className="px-4 py-2 hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {isToday && <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>}
                        <div>
                          <div className={`font-medium ${isToday ? "text-primary" : ""}`}>
                            {dayNames[index]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(day, "MMM d")}
                          </div>
                        </div>
                      </div>
                      
                      {workoutTemplate ? (
                        <div className="flex items-center gap-2 mr-4">
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">{workoutTemplate.name}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground mr-4">Rest Day</div>
                      )}
                    </div>
                  </AccordionTrigger>
                </CardHeader>
                
                <AccordionContent>
                  <CardContent className="pt-0 pb-3 px-4">
                    {workoutTemplate ? (
                      <div className="space-y-3">
                        <div className="text-sm space-y-1">
                          <div className="font-medium">Exercises ({workoutTemplate.exercises.length})</div>
                          <ul className="text-muted-foreground pl-4 list-disc">
                            {workoutTemplate.exercises.slice(0, 5).map((exercise, idx) => (
                              <li key={idx}>{exercise.name}</li>
                            ))}
                            {workoutTemplate.exercises.length > 5 && (
                              <li className="text-primary">
                                +{workoutTemplate.exercises.length - 5} more...
                              </li>
                            )}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDayClick(index)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Change
                          </Button>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewWorkout(workoutTemplate.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            
                            <StartWorkoutButton
                              workoutId={workoutTemplate.id}
                              isTemplate
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Button
                          onClick={() => handleDayClick(index)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Assign Workout
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
      
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
                    getIndividualWorkouts().map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.exercises.length} exercises)
                      </SelectItem>
                    ))
                  ) : (
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
