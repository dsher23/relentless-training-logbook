
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";
import TabNavigation from "@/components/TabNavigation";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const WeeklyOverview: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { weeklyRoutines, addWeeklyRoutine, updateWeeklyRoutine, workoutTemplates } = useAppContext();
  
  const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0 = Sunday, 6 = Saturday
  
  // Get active weekly routine (non-archived)
  const activeRoutine = weeklyRoutines.find(routine => !routine.archived);
  
  const handleCreateRoutine = () => {
    try {
      // Create a new weekly routine with basic details
      const newRoutine = {
        name: "My Weekly Routine",
        workoutDays: [],
        days: {},
        workouts: [], // Required field
        startDate: new Date().toISOString(), // Required field
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // Required field
        archived: false
      };
      
      addWeeklyRoutine(newRoutine);
      
      toast({
        title: "Success",
        description: "New weekly routine created.",
      });
    } catch (error) {
      console.error("Error creating routine:", error);
      toast({
        title: "Error",
        description: "Failed to create routine.",
        variant: "destructive",
      });
    }
  };
  
  const handleAssignWorkout = (dayOfWeek: number, workoutId: string, workoutName: string) => {
    if (!activeRoutine) return;
    
    try {
      // Find if this day already has a workout
      const existingDayIndex = activeRoutine.workoutDays.findIndex(
        day => day.dayOfWeek === dayOfWeek
      );
      
      let updatedWorkoutDays = [...activeRoutine.workoutDays];
      
      if (existingDayIndex >= 0) {
        // Update existing day's workout
        updatedWorkoutDays[existingDayIndex] = {
          ...updatedWorkoutDays[existingDayIndex],
          workoutTemplateId: workoutId,
          workoutName
        };
      } else {
        // Add new day
        updatedWorkoutDays.push({
          id: crypto.randomUUID(),
          dayOfWeek,
          workoutTemplateId: workoutId,
          workoutName
        });
      }
      
      updateWeeklyRoutine(activeRoutine.id, {
        workoutDays: updatedWorkoutDays
      });
      
      toast({
        title: "Success",
        description: `${workoutName} assigned to ${days[dayOfWeek]}.`,
      });
    } catch (error) {
      console.error("Error assigning workout:", error);
      toast({
        title: "Error",
        description: "Failed to assign workout.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveWorkout = (dayOfWeek: number) => {
    if (!activeRoutine) return;
    
    try {
      const updatedWorkoutDays = activeRoutine.workoutDays.filter(
        day => day.dayOfWeek !== dayOfWeek
      );
      
      updateWeeklyRoutine(activeRoutine.id, {
        workoutDays: updatedWorkoutDays
      });
      
      toast({
        title: "Success",
        description: `Workout removed from ${days[dayOfWeek]}.`,
      });
    } catch (error) {
      console.error("Error removing workout:", error);
      toast({
        title: "Error",
        description: "Failed to remove workout.",
        variant: "destructive",
      });
    }
  };
  
  const handlePreviousDay = () => {
    setSelectedDay((prevDay) => (prevDay === 0 ? 6 : prevDay - 1));
  };
  
  const handleNextDay = () => {
    setSelectedDay((prevDay) => (prevDay === 6 ? 0 : prevDay + 1));
  };

  const handleCreateEmptyRoutine = () => {
    try {
      // Create a new empty weekly routine
      const newRoutine = {
        name: "New Weekly Routine",
        workoutDays: [],
        days: {},
        workouts: [], // Required field
        startDate: new Date().toISOString(), // Required field
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(), // Required field
        archived: false
      };
      
      addWeeklyRoutine(newRoutine);
      
      toast({
        title: "Success",
        description: "New weekly routine created.",
      });
    } catch (error) {
      console.error("Error creating routine:", error);
      toast({
        title: "Error",
        description: "Failed to create routine.",
        variant: "destructive",
      });
    }
  };
  
  // Find the workout assigned to the selected day
  const assignedWorkout = activeRoutine?.workoutDays.find(day => day.dayOfWeek === selectedDay);
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Weekly Overview" showBack={true} />
      
      <div className="p-4 space-y-6">
        {activeRoutine ? (
          <>
            {/* Day Selection */}
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <Button variant="ghost" size="sm" onClick={handlePreviousDay}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h3 className="text-lg font-semibold">{days[selectedDay]}</h3>
                  <Button variant="ghost" size="sm" onClick={handleNextDay}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                
                {assignedWorkout ? (
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{assignedWorkout.workoutName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Scheduled for {days[selectedDay]}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Change
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Select Workout for {days[selectedDay]}</SheetTitle>
                              <SheetDescription>
                                Choose a workout template to assign to this day
                              </SheetDescription>
                            </SheetHeader>
                            <div className="py-4 space-y-2">
                              {workoutTemplates.map(template => (
                                <Card
                                  key={template.id}
                                  className="cursor-pointer hover:bg-secondary/10"
                                  onClick={() => {
                                    handleAssignWorkout(selectedDay, template.id, template.name);
                                    document.querySelector('[data-radix-collection-item]')?.click();
                                  }}
                                >
                                  <CardContent className="p-3 flex justify-between items-center">
                                    <div>
                                      <h3 className="font-medium">{template.name}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {template.exercises?.length || 0} exercises
                                      </p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                      Select
                                    </Button>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleRemoveWorkout(selectedDay)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4"
                      onClick={() => navigate(`/live-workout/${assignedWorkout.workoutTemplateId}?isTemplate=true`)}
                    >
                      Start Workout
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-4 text-center">
                    <p className="text-muted-foreground mb-2">No workout assigned</p>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-1" />
                          Assign Workout
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Select Workout for {days[selectedDay]}</SheetTitle>
                          <SheetDescription>
                            Choose a workout template to assign to this day
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4 space-y-2">
                          {workoutTemplates.map(template => (
                            <Card
                              key={template.id}
                              className="cursor-pointer hover:bg-secondary/10"
                              onClick={() => {
                                handleAssignWorkout(selectedDay, template.id, template.name);
                                document.querySelector('[data-radix-collection-item]')?.click();
                              }}
                            >
                              <CardContent className="p-3 flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{template.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {template.exercises?.length || 0} exercises
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  Select
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Weekly Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {days.map((day, index) => {
                    const dayWorkout = activeRoutine.workoutDays.find(d => d.dayOfWeek === index);
                    
                    return (
                      <div 
                        key={day}
                        className={`p-3 border rounded-md flex items-center justify-between ${selectedDay === index ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => setSelectedDay(index)}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${selectedDay === index ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            {day.charAt(0)}
                          </div>
                          <span>{day}</span>
                        </div>
                        {dayWorkout ? (
                          <Badge variant="outline" className="font-normal">
                            {dayWorkout.workoutName}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground bg-transparent font-normal">
                            Rest Day
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pt-8">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>No Weekly Routine</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  You haven't created a weekly workout routine yet. Create one to schedule your workouts throughout the week.
                </p>
                <Button 
                  onClick={handleCreateEmptyRoutine}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Weekly Routine
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default WeeklyOverview;
