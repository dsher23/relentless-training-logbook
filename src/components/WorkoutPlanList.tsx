
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Copy, Edit, Trash, Star, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/context/AppContext";
import { WorkoutPlan } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const WorkoutPlanList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    workoutPlans, 
    workoutTemplates,
    addWorkoutPlan, 
    updateWorkoutPlan, 
    deleteWorkoutPlan, 
    duplicateWorkoutPlan,
    setActivePlan
  } = useAppContext();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDescription, setNewPlanDescription] = useState("");

  const handleCreatePlan = () => {
    if (!newPlanName.trim()) {
      toast({
        title: "Error",
        description: "Plan name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newPlan: WorkoutPlan = {
      id: crypto.randomUUID(),
      name: newPlanName.trim(),
      description: newPlanDescription.trim() || undefined,
      workoutTemplates: [],
      isActive: false
    };

    addWorkoutPlan(newPlan);
    
    toast({
      title: "Success",
      description: "Workout plan created successfully",
    });
    
    setNewPlanName("");
    setNewPlanDescription("");
    setIsCreateDialogOpen(false);
    navigate(`/plans/${newPlan.id}`);
  };

  const handleEditPlan = () => {
    if (!editingPlan || !editingPlan.name.trim()) {
      toast({
        title: "Error",
        description: "Plan name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    updateWorkoutPlan(editingPlan);
    
    toast({
      title: "Success",
      description: "Workout plan updated successfully",
    });
    
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: string) => {
    deleteWorkoutPlan(id);
    
    toast({
      title: "Success",
      description: "Workout plan deleted successfully",
    });
  };

  const handleDuplicatePlan = (id: string) => {
    duplicateWorkoutPlan(id);
    
    toast({
      title: "Success",
      description: "Workout plan duplicated successfully",
    });
  };

  const handleSetActive = (id: string) => {
    setActivePlan(id);
    
    toast({
      title: "Success",
      description: "Active plan updated successfully",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Workout Plans</h2>
        <Button 
          size="sm" 
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> New Plan
        </Button>
      </div>

      {workoutPlans.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-secondary p-3 mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Workout Plans</h3>
              <p className="text-muted-foreground mb-4">
                Create a workout plan to organize multiple workout days together.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Create Your First Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {workoutPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`${plan.isActive ? "border-primary" : ""} cursor-pointer`}
              onClick={() => navigate(`/plans/${plan.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {plan.name}
                    {plan.isActive && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary/20 px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                        Active
                      </span>
                    )}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setEditingPlan(plan);
                      }}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicatePlan(plan.id);
                      }}>
                        <Copy className="h-4 w-4 mr-2" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        disabled={plan.isActive}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetActive(plan.id);
                        }}
                      >
                        <Star className="h-4 w-4 mr-2" /> Set as Active
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {plan.description && (
                  <p className="text-muted-foreground text-sm mb-2">
                    {plan.description}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">{plan.workoutTemplates.length}</span>{" "}
                  {plan.workoutTemplates.length === 1 ? "workout" : "workouts"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Workout Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input
                id="plan-name"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="e.g. Push Pull Legs, Upper/Lower Split"
              />
            </div>
            <div>
              <Label htmlFor="plan-description">Description (Optional)</Label>
              <Textarea
                id="plan-description"
                value={newPlanDescription}
                onChange={(e) => setNewPlanDescription(e.target.value)}
                placeholder="e.g. My 6-day hypertrophy plan"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingPlan !== null} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Workout Plan</DialogTitle>
          </DialogHeader>
          {editingPlan && (
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-plan-name">Plan Name</Label>
                <Input
                  id="edit-plan-name"
                  value={editingPlan.name}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-plan-description">Description (Optional)</Label>
                <Textarea
                  id="edit-plan-description"
                  value={editingPlan.description || ""}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditPlan}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutPlanList;
