
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutTemplate } from "@/types";
import { v4 as uuidv4 } from "uuid";

const WorkoutDays: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    workoutPlans,
    updateWorkoutPlan,
    addWorkoutTemplate,
    removeTemplateFromPlan
  } = useAppContext();
  
  const [isCreateDayDialogOpen, setIsCreateDayDialogOpen] = useState(false);
  const [dayName, setDayName] = useState("");
  
  const plan = workoutPlans.find((p) => p.id === planId);
  
  if (!plan) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Plan Not Found" />
        <div className="p-4">
          <Button onClick={() => navigate("/exercise-plans")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Exercise Plans
          </Button>
        </div>
      </div>
    );
  }
  
  const handleCreateDay = () => {
    if (!dayName.trim()) {
      toast({
        title: "Error",
        description: "Workout day name is required",
        variant: "destructive",
      });
      return;
    }
    
    const newDay: WorkoutTemplate = {
      id: uuidv4(),
      name: dayName.trim(),
      dayName: dayName.trim(),
      exercises: [],
    };
    
    addWorkoutTemplate(newDay);
    
    const updatedPlan = {
      ...plan,
      workoutTemplates: [...plan.workoutTemplates, newDay]
    };
    
    updateWorkoutPlan(updatedPlan);
    
    setDayName("");
    setIsCreateDayDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Added "${newDay.name}" to plan`,
    });
  };
  
  const handleDeleteDay = (dayId: string) => {
    removeTemplateFromPlan(plan.id, dayId);
    
    toast({
      title: "Success",
      description: "Removed workout day from plan",
    });
  };

  return (
    <div className="app-container animate-fade-in">
      <Header title={`${plan.name} - Workout Days`} />
      
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/exercise-plans/${plan.id}`)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Plan
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Workout Days</h2>
          <Button 
            size="sm" 
            onClick={() => setIsCreateDayDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Workout Day
          </Button>
        </div>
        
        {plan.workoutTemplates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-secondary p-3 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Workout Days Added</h3>
                <p className="text-muted-foreground mb-4">
                  Add workout days to build your exercise plan.
                </p>
                <Button
                  onClick={() => setIsCreateDayDialogOpen(true)}
                >
                  Add Workout Day
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {plan.workoutTemplates.map((day) => (
              <Card 
                key={day.id}
                className="hover:border-primary cursor-pointer"
                onClick={() => navigate(`/exercise-plans/${plan.id}/days/${day.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{day.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {day.exercises?.length || 0} {day.exercises?.length === 1 ? "exercise" : "exercises"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDay(day.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/exercise-plans/${plan.id}/days/${day.id}`);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isCreateDayDialogOpen} onOpenChange={setIsCreateDayDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Workout Day</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="day-name">Workout Day Name</Label>
            <Input
              id="day-name"
              value={dayName}
              onChange={(e) => setDayName(e.target.value)}
              placeholder="e.g. Push Day, Leg Day, Upper Day 1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDayDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDay}>Add Day</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutDays;
