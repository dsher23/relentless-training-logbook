
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext, WorkoutTemplate, WorkoutPlan } from "@/context/AppContext";
import Header from "@/components/Header";
import StartWorkoutButton from "@/components/StartWorkoutButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    workoutPlans,
    workoutTemplates,
    updateWorkoutPlan,
    addWorkoutTemplate,
    duplicateWorkoutTemplate,
    updateWorkoutTemplate,
    addTemplateToPlan,
    removeTemplateFromPlan,
    setActivePlan,
  } = useAppContext();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  
  const plan = workoutPlans.find((p) => p.id === planId);
  
  if (!plan) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Plan Not Found" />
        <div className="p-4">
          <Button onClick={() => navigate("/exercise-plans")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plans
          </Button>
        </div>
      </div>
    );
  }
  
  const planTemplates = plan.workoutTemplates;
  const availableTemplates = workoutTemplates.filter(
    (t) => !planTemplates.some((pt) => pt.id === t.id)
  );
  
  const handleAddExistingTemplate = (templateId: string) => {
    if (addTemplateToPlan) {
      addTemplateToPlan(plan.id, templateId);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Added workout to plan`,
      });
    }
  };
  
  const handleCreateNewTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }
    
    const newTemplate: WorkoutTemplate = {
      id: crypto.randomUUID(),
      name: newTemplateName.trim(),
      exercises: [],
    };
    
    addWorkoutTemplate(newTemplate);
    
    if (addTemplateToPlan) {
      addTemplateToPlan(plan.id, newTemplate.id);
    }
    
    setNewTemplateName("");
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Created "${newTemplate.name}" in plan`,
    });
    
    // Navigate to edit the new template
    navigate(`/exercise-plans/${plan.id}/days/${newTemplate.id}`);
  };
  
  const handleRemoveTemplate = (templateId: string) => {
    if (removeTemplateFromPlan) {
      removeTemplateFromPlan(plan.id, templateId);
      
      toast({
        title: "Success",
        description: "Removed workout from plan",
      });
    }
  };
  
  const handleEditTemplate = (templateId: string) => {
    navigate(`/exercise-plans/${plan.id}/days/${templateId}`);
  };
  
  const handleViewWorkoutDays = () => {
    navigate(`/exercise-plans/${plan.id}/days`);
  };
  
  const handleDuplicateTemplate = (templateId: string) => {
    if (duplicateWorkoutTemplate) {
      duplicateWorkoutTemplate(templateId);
    }
  };
  
  const handleSetActiveRoutine = () => {
    if (setActivePlan) {
      setActivePlan(plan.id);
      
      toast({
        title: "Success",
        description: "Set as active workout plan",
      });
    }
  };
  
  return (
    <div className="app-container animate-fade-in">
      <Header title={plan.name} />
      
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/exercise-plans")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          {!plan.isActive && (
            <Button onClick={handleSetActiveRoutine}>
              <Star className="h-4 w-4 mr-1" /> Set as Active
            </Button>
          )}
          <Button 
            onClick={handleViewWorkoutDays}
            className="ml-auto"
          >
            Manage Workout Days
          </Button>
        </div>
        
        {plan.description && (
          <p className="text-muted-foreground">{plan.description}</p>
        )}
        
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Workouts in Plan</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Existing
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Create New
            </Button>
          </div>
        </div>
        
        {planTemplates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center justify-center p-6">
                <div className="rounded-full bg-secondary p-3 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Workouts Added</h3>
                <p className="text-muted-foreground mb-4">
                  Add existing workouts or create new ones to build your plan.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    Add Existing
                  </Button>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    Create New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {planTemplates.map((template) => (
              <Card 
                key={template.id}
                className="hover:border-primary"
                onClick={() => handleEditTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.exercises.length} exercises
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTemplate(template.id);
                        }}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTemplate(template.id);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Duplicate</span>
                      </Button>
                      <StartWorkoutButton
                        workoutId={template.id}
                        isTemplate
                        className="h-8"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Existing Workout</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {availableTemplates.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No available workouts to add</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableTemplates.map(template => (
                  <Card 
                    key={template.id} 
                    className="hover:border-primary cursor-pointer"
                    onClick={() => handleAddExistingTemplate(template.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {template.exercises.length} exercises
                          </p>
                        </div>
                        <Button size="sm">Add</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Workout Day</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="template-name">Workout Day Name</Label>
            <Input
              id="template-name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="e.g. Push Day, Leg Day"
            />
            <p className="text-xs text-muted-foreground mt-1">
              You'll be able to add exercises after creation
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewTemplate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanDetail;
