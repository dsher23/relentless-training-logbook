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

// Empty state component for when no plans exist
const EmptyState = ({ onCreatePlan }: { onCreatePlan: () => void }) => (
  <Card className="border-dashed">
    <CardContent className="pt-6 text-center">
      <div className="flex flex-col items-center justify-center p-6">
        <div className="rounded-full bg-secondary p-3 mb-4">
          <Plus className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium mb-2">Create Your First Workout Plan</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Organize your workout days into a structured training plan. Perfect for tracking progress over time.
        </p>
        <Button onClick={onCreatePlan}>
          New Workout Plan
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Plan card component to display individual plans
const PlanCard = ({ 
  plan, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onSetActive, 
  onClick 
}: { 
  plan: WorkoutPlan; 
  onEdit: (plan: WorkoutPlan) => void; 
  onDuplicate: (id: string) => void; 
  onDelete: (id: string) => void; 
  onSetActive: (id: string) => void; 
  onClick: () => void; 
}) => (
  <Card 
    key={plan.id}
    className={`${plan.active ? "border-primary" : ""} cursor-pointer hover:border-primary/50 transition-colors`}
    onClick={onClick}
  >
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg">
            {plan.name}
          </CardTitle>
          {plan.active && (
            <span className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary-foreground mt-1">
              Active Plan
            </span>
          )}
        </div>
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
              onEdit(plan);
            }}>
              <Edit className="h-4 w-4 mr-2" /> Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onDuplicate(plan.id);
            }}>
              <Copy className="h-4 w-4 mr-2" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem 
              disabled={plan.active}
              onClick={(e) => {
                e.stopPropagation();
                onSetActive(plan.id);
              }}
            >
              <Star className="h-4 w-4 mr-2" /> Set as Active
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/20"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(plan.id);
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
      <div className="flex justify-between items-center">
        <p className="text-sm">
          <span className="font-medium">{plan.workoutTemplates.length}</span>{" "}
          {plan.workoutTemplates.length === 1 ? "workout day" : "workout days"}
        </p>
        <Button 
          size="sm" 
          variant="outline"
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Plan
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Dialog for creating/editing plans
const PlanDialog = ({ 
  isOpen, 
  onClose, 
  plan, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  plan: WorkoutPlan | null; 
  onSave: (plan: WorkoutPlan) => void; 
}) => {
  const [name, setName] = useState(plan?.name || "");
  const [description, setDescription] = useState(plan?.description || "");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Plan name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    onSave({
      id: plan?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      workoutTemplates: plan?.workoutTemplates || [],
      active: plan?.active || false,
      archived: plan?.archived || false,
      routines: plan?.routines || [],
    });
    
    setName("");
    setDescription("");
  };

  React.useEffect(() => {
    if (isOpen && plan) {
      setName(plan.name);
      setDescription(plan.description || "");
    } else if (isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen, plan]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Workout Plan" : "Create New Workout Plan"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Bulk, Lean Cut Phase, Strength Cycle 6-Week"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="plan-description">Description (Optional)</Label>
            <Textarea
              id="plan-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 12-week hypertrophy focused program with progressive overload"
              rows={3}
              className="mt-1.5"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{plan ? "Save Changes" : "Create Plan"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface WorkoutPlanListProps {
  showArchived?: boolean;
}

const WorkoutPlanList: React.FC<WorkoutPlanListProps> = ({ showArchived = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    workoutPlans, 
    addWorkoutPlan, 
    updateWorkoutPlan, 
    deleteWorkoutPlan, 
    duplicateWorkoutPlan,
    setActivePlan
  } = useAppContext();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);

  const handleCreatePlan = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSavePlan = async (plan: WorkoutPlan) => {
    const isEditing = !!editingPlan;
    
    if (isEditing) {
      await updateWorkoutPlan(plan.id, plan);
      toast({
        title: "Success",
        description: "Workout plan updated successfully",
      });
      setEditingPlan(null);
    } else {
      await addWorkoutPlan(plan);
      toast({
        title: "Success",
        description: "Workout plan created successfully",
      });
      setIsCreateDialogOpen(false);
      navigate(`/exercise-plans/${plan.id}/days`);
    }
  };

  const handleDeletePlan = async (id: string) => {
    await deleteWorkoutPlan(id);
    toast({
      title: "Success",
      description: "Workout plan deleted successfully",
    });
  };

  const handleDuplicatePlan = async (id: string) => {
    await duplicateWorkoutPlan(id);
    toast({
      title: "Success",
      description: "Workout plan duplicated successfully",
    });
  };

  const handleSetActive = async (id: string) => {
    await setActivePlan(id);
    toast({
      title: "Success",
      description: "Active plan updated successfully",
    });
  };

  const filteredPlans = workoutPlans.filter(plan => plan.archived === showArchived);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{showArchived ? "Archived Plans" : "Workout Plans"}</h2>
        {!showArchived && (
          <Button 
            size="sm" 
            onClick={handleCreatePlan}
          >
            <Plus className="h-4 w-4 mr-1" /> New Plan
          </Button>
        )}
      </div>

      {filteredPlans.length === 0 ? (
        <EmptyState onCreatePlan={handleCreatePlan} />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              onEdit={setEditingPlan}
              onDuplicate={handleDuplicatePlan}
              onDelete={handleDeletePlan}
              onSetActive={handleSetActive}
              onClick={() => navigate(`/exercise-plans/${plan.id}/days`)}
            />
          ))}
        </div>
      )}

      <PlanDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        plan={null}
        onSave={handleSavePlan}
      />

      <PlanDialog 
        isOpen={editingPlan !== null} 
        onClose={() => setEditingPlan(null)}
        plan={editingPlan}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default WorkoutPlanList;
