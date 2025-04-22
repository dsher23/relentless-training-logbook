
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  ListChecks, 
  BarChart, 
  Plus, 
  ClipboardList,
  Dumbbell,
  Star,
  CalendarDays,
  Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import WorkoutCard from "@/components/WorkoutCard";
import StartWorkoutButton from "@/components/StartWorkoutButton";
import { useAppContext } from "@/context/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyPlanView from "@/components/WeeklyPlanView";
import WorkoutPlanList from "@/components/WorkoutPlanList";

const Training: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, workoutTemplates, workoutPlans } = useAppContext();
  const [activeTab, setActiveTab] = useState("routines");
  
  // Get today's date
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Sort templates to show favorites first
  const sortedTemplates = [...workoutTemplates].sort((a, b) => {
    if (a.isFavorite === b.isFavorite) {
      return a.name.localeCompare(b.name);
    }
    return a.isFavorite ? -1 : 1;
  });
  
  // Group workouts by completion status and sort by date
  const completedWorkouts = workouts
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get active workout plan
  const activePlan = workoutPlans.find(p => p.isActive);
  
  return (
    <div className="app-container animate-fade-in">
      <Header title="Training" />
      
      <div className="px-4 mb-6">
        <div className="flex gap-2">
          <Button
            className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple"
            onClick={() => navigate("/workout-selection")}
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            Start Workout
          </Button>
        </div>
      </div>
      
      {activePlan && (
        <div className="px-4 mb-6">
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    Active Plan: {activePlan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activePlan.workoutTemplates.length} workouts in plan
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/plans/${activePlan.id}`)}
                >
                  View Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs 
        defaultValue="routines" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mx-4">
          <TabsTrigger value="routines">
            <ClipboardList className="h-4 w-4 mr-2" /> Routines
          </TabsTrigger>
          <TabsTrigger value="plans">
            <ListChecks className="h-4 w-4 mr-2" /> Plans
          </TabsTrigger>
          <TabsTrigger value="weekly">
            <CalendarDays className="h-4 w-4 mr-2" /> Weekly
          </TabsTrigger>
          <TabsTrigger value="history">
            <Archive className="h-4 w-4 mr-2" /> History
          </TabsTrigger>
        </TabsList>
        
        {/* Routines Tab */}
        <TabsContent value="routines" className="mt-4">
          {sortedTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Dumbbell className="h-12 w-12 text-gym-purple mb-4" />
              <h2 className="text-xl font-bold mb-2">No Routines Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start by creating your first workout routine.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/workouts/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Routine
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">My Saved Routines</h2>
                <Button size="sm" onClick={() => navigate("/workouts/new")}>
                  <Plus className="h-4 w-4 mr-1" /> New
                </Button>
              </div>
              {sortedTemplates.map(template => (
                <Card 
                  key={template.id} 
                  className="hover:border-primary cursor-pointer"
                  onClick={() => navigate(`/routines/${template.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {template.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.exercises.length} exercises
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/workouts/new?templateId=${template.id}`);
                          }}
                        >
                          Edit
                        </Button>
                        <StartWorkoutButton 
                          workoutId={template.id} 
                          className="bg-gym-blue hover:bg-blue-700"
                          isTemplate
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Plans Tab */}
        <TabsContent value="plans" className="mt-4 px-4">
          <WorkoutPlanList />
        </TabsContent>
        
        {/* Weekly Tab */}
        <TabsContent value="weekly" className="mt-4 px-4">
          <WeeklyPlanView />
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history" className="mt-4 px-4">
          {completedWorkouts.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Completed Workouts</h2>
              {completedWorkouts.map(workout => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout}
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                />
              ))}
              {completedWorkouts.length > 10 && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate("/workout-history")}
                >
                  View All Completed Workouts
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Archive className="h-12 w-12 text-gym-purple mb-4" />
              <h2 className="text-xl font-bold mb-2">No Workout History</h2>
              <p className="text-muted-foreground mb-6">
                Complete your first workout to see it here.
              </p>
              <Button onClick={() => navigate("/workout-selection")}>
                <Dumbbell className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Training;
