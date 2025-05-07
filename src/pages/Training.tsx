
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, Calendar, Settings, PlusCircle, Clock, CheckCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HeaderExtended from "@/components/HeaderExtended";
import TabNavigation from "@/components/TabNavigation";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";

const Training: React.FC = () => {
  const navigate = useNavigate();
  const { workoutPlans, workoutTemplates, weeklyRoutines, trainingBlocks } = useAppContext();

  // Find active workout plan
  const activePlan = workoutPlans.find(plan => plan.active);
  
  // Get latest workout templates
  const latestTemplates = [...workoutTemplates]
    .sort((a, b) => {
      const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
      const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);
  
  // Get active weekly routine
  const activeRoutine = weeklyRoutines.find(routine => !routine.archived);
  
  // Get active training block
  const now = new Date();
  const activeBlock = trainingBlocks.find(block => {
    const startDate = new Date(block.startDate);
    const endDate = new Date(block.endDate);
    return startDate <= now && endDate >= now;
  });

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Training" showBack={false} />
      
      <div className="px-4 pt-4 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-20 flex flex-col"
            onClick={() => navigate("/workout-selection")}
          >
            <Dumbbell className="h-5 w-5 mb-1" />
            <span>Start Workout</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col"
            onClick={() => navigate("/workout-history")}
          >
            <Clock className="h-5 w-5 mb-1" />
            <span>Workout History</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col"
            onClick={() => navigate("/weekly-overview")}
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span>Weekly Routine</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col"
            onClick={() => navigate("/exercise-plans")}
          >
            <BookOpen className="h-5 w-5 mb-1" />
            <span>Workout Plans</span>
          </Button>
        </div>
        
        {/* Active Plan */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Active Workout Plan</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/exercise-plans")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activePlan ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{activePlan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {activePlan.workoutTemplates.length} workout templates
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/plan/${activePlan.id}`)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Active
                  </Button>
                </div>
                <div className="mt-2">
                  <Button 
                    variant="default"
                    className="w-full"
                    onClick={() => navigate(`/plan/${activePlan.id}`)}
                  >
                    View Plan Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground mb-2">No active workout plan</p>
                <Button
                  onClick={() => navigate("/exercise-plans")}
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create or Select a Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Workout Templates */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Workout Templates</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/workouts")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {workoutTemplates.length > 0 ? (
              <div className="space-y-2">
                {latestTemplates.map(template => (
                  <div 
                    key={template.id}
                    className="p-3 border rounded-md cursor-pointer hover:bg-secondary/10"
                    onClick={() => navigate(`/live-workout/${template.id}?isTemplate=true`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {template.exercises?.length || 0} exercises
                        </p>
                      </div>
                      <Button size="sm">
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  onClick={() => navigate("/workouts")}
                >
                  View All Templates
                </Button>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground mb-2">No workout templates</p>
                <Button
                  onClick={() => navigate("/create-workout")}
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Template
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Weekly Routine */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Weekly Routine</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/weekly-overview")}
              >
                View
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeRoutine ? (
              <div>
                <h3 className="font-semibold">{activeRoutine.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {activeRoutine.workoutDays.length} workouts scheduled
                </p>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/weekly-overview")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Weekly Schedule
                </Button>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground mb-2">No active weekly routine</p>
                <Button
                  onClick={() => navigate("/routines")}
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Weekly Routine
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Training Block */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Training Block</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/training-blocks")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeBlock ? (
              <div>
                <h3 className="font-semibold">{activeBlock.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(activeBlock.startDate).toLocaleDateString()} - {new Date(activeBlock.endDate).toLocaleDateString()}
                </p>
                <Button 
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate(`/training-block/${activeBlock.id}`)}
                >
                  View Block Details
                </Button>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground mb-2">No active training block</p>
                <Button
                  onClick={() => navigate("/training-blocks")}
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Training Block
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <TabNavigation />
    </div>
  );
};

export default Training;
