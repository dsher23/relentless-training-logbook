
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, startOfWeek } from "date-fns";
import { BookOpen, Plus, ArrowLeft, Calendar, ClipboardList, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const WorkoutTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { workoutTemplates, weeklyRoutines, workoutPlans } = useAppContext();
  const [activeTab, setActiveTab] = useState("today");
  
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Get this week's workouts from weekly plan
  const activeRoutine = weeklyRoutines.find(r => !r.archived);
  
  // Get today's scheduled workout from weekly plan if available
  const todaysWorkoutDay = activeRoutine?.workoutDays.find(day => day.dayOfWeek === dayOfWeek);
  const todaysWorkout = todaysWorkoutDay?.workoutTemplateId 
    ? workoutTemplates.find(t => t.id === todaysWorkoutDay.workoutTemplateId)
    : undefined;
  
  // Get active workout plan
  const activePlan = workoutPlans.find(p => p.isActive);
  
  // Get this week's schedule
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const getWorkoutForDay = (dayIndex: number) => {
    const day = activeRoutine?.workoutDays.find(d => d.dayOfWeek === dayIndex);
    if (!day?.workoutTemplateId) return null;
    
    return workoutTemplates.find(t => t.id === day.workoutTemplateId);
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <div className="sticky top-0 bg-background z-10 border-b">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Start Workout Session</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="routines">Workouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today">
            {todaysWorkout ? (
              <div>
                <h2 className="text-lg font-semibold mb-3">Today's Scheduled Workout</h2>
                <Card className="hover:border-primary shadow-sm mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {format(today, "EEEE, MMM d")}
                        </div>
                        <h3 className="font-medium">{todaysWorkout.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {todaysWorkout.exercises.length} exercises
                        </p>
                      </div>
                      <Button 
                        className="bg-gym-blue text-white"
                        onClick={() => navigate(`/live-workout/${todaysWorkout.id}?isTemplate=true`)}
                      >
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="mb-4">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2 mt-2" />
                  <h3 className="font-medium mb-1">No Workout Scheduled Today</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You don't have a workout planned for today
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("routines")}
                    >
                      Choose a Workout
                    </Button>
                    <Button onClick={() => navigate("/weekly-overview")}>
                      Plan Your Week
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 gap-4 mt-6">
              <Button
                onClick={() => navigate("/workouts/new")}
                size="lg"
                className="h-auto py-6 bg-gym-blue text-white justify-start"
              >
                <Plus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">New Workout Session</div>
                  <div className="text-xs opacity-80">Create a new workout from scratch</div>
                </div>
              </Button>
              
              <Button
                onClick={() => navigate("/weekly-overview")}
                size="lg"
                variant="outline"
                className="h-auto py-6 justify-start"
              >
                <Calendar className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Weekly Schedule</div>
                  <div className="text-xs opacity-80">View your planned workouts</div>
                </div>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="week">
            {activeRoutine ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">This Week's Workouts</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate("/weekly-overview")}
                  >
                    <Calendar className="h-4 w-4 mr-1" /> 
                    Edit Schedule
                  </Button>
                </div>
                
                {weekDays.map((day, index) => {
                  const workout = getWorkoutForDay(index);
                  const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
                  
                  return (
                    <Card 
                      key={index} 
                      className={isToday ? "border-primary bg-primary/5" : ""}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${isToday ? "text-primary" : ""}`}>
                              {dayNames[index]}
                              {isToday && <span className="text-xs text-primary ml-2">(Today)</span>}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(day, "MMM d")}
                            </div>
                          </div>
                          
                          {workout ? (
                            <div className="flex items-center gap-3">
                              <div className="text-sm">{workout.name}</div>
                              <Button 
                                size="sm"
                                className={isToday ? "bg-primary" : "bg-gym-blue"}
                                onClick={() => navigate(`/live-workout/${workout.id}?isTemplate=true`)}
                              >
                                Start
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate("/weekly-overview")}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-6 border rounded-lg border-dashed">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No Weekly Schedule</h3>
                <p className="text-muted-foreground mb-4">
                  Plan your workouts for the week.
                </p>
                <Button 
                  onClick={() => navigate("/weekly-overview")}
                >
                  Create Weekly Schedule
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="routines">
            {workoutTemplates.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Select from Saved Workout Days
                </h3>
                {workoutTemplates.map(template => (
                  <Card 
                    key={template.id} 
                    className="hover:border-primary cursor-pointer shadow-sm"
                    onClick={() => navigate(`/workouts/new?templateId=${template.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{template.name}</h3>
                            {template.isFavorite && (
                              <Star className="h-4 w-4 text-yellow-500 ml-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {template.exercises.length} exercises
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-gym-blue text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/live-workout/${template.id}?isTemplate=true`);
                          }}
                        >
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border rounded-lg border-dashed">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No Saved Workout Days</h3>
                <p className="text-muted-foreground mb-4">
                  Create and save workout days for quick access.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/workouts/new")}
                >
                  Create Your First Workout Day
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {(activeTab === "today" || activeTab === "week") && (
          <div className="mt-2">
            <Button 
              variant="link" 
              className="w-full justify-between px-0 text-muted-foreground"
              onClick={() => navigate("/workout-history")}
            >
              View workout history
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTypeSelection;
