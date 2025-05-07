
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Edit, X, ArrowLeft, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";

const PlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workoutPlans, updateWorkoutPlan, deleteWorkoutPlan, workoutTemplates, setActivePlan } = useAppContext();

  const [plan, setPlan] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load plan data
  useEffect(() => {
    if (id) {
      const foundPlan = workoutPlans.find(p => p.id === id);
      if (foundPlan) {
        setPlan(foundPlan);
        setName(foundPlan.name);
        setDescription(foundPlan.description || "");
      } else {
        toast({
          title: "Error",
          description: "Plan not found.",
          variant: "destructive",
        });
        navigate("/plans");
      }
    }
  }, [id, workoutPlans, navigate, toast]);

  const handleSave = () => {
    if (!plan) return;
    
    const updatedPlan = {
      ...plan,
      name,
      description,
    };
    
    updateWorkoutPlan(updatedPlan);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Plan updated successfully.",
    });
  };

  const handleDelete = () => {
    if (!plan) return;
    
    deleteWorkoutPlan(plan.id);
    toast({
      title: "Success",
      description: "Plan deleted successfully.",
    });
    navigate("/plans");
  };

  const handleAddTemplate = (templateId: string) => {
    if (!plan) return;
    
    const template = workoutTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const updatedPlan = {
      ...plan,
      workoutTemplates: [...plan.workoutTemplates, template],
    };
    
    updateWorkoutPlan(updatedPlan);
    toast({
      title: "Success",
      description: `${template.name} added to plan.`,
    });
  };

  const handleRemoveTemplate = (templateId: string) => {
    if (!plan) return;
    
    const updatedPlan = {
      ...plan,
      workoutTemplates: plan.workoutTemplates.filter((t: any) => t.id !== templateId),
    };
    
    updateWorkoutPlan(updatedPlan);
    toast({
      title: "Success",
      description: "Template removed from plan.",
    });
  };

  const handleSetActive = () => {
    if (!plan) return;
    
    setActivePlan(plan.id);
    toast({
      title: "Success",
      description: `${plan.name} is now the active plan.`,
    });
  };

  if (!plan) {
    return (
      <div className="app-container p-4">
        <NavigationHeader title="Loading..." showBack={true} />
        <div className="flex justify-center items-center h-40">
          <p>Loading plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container pb-16">
      <NavigationHeader title={isEditing ? "Edit Plan" : plan.name} showBack={true} />
      <div className="p-4 space-y-4">
        {isEditing ? (
          <Card>
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter plan name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter plan description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    {plan.description && (
                      <p className="text-muted-foreground mt-1">{plan.description}</p>
                    )}
                  </div>
                  <div>
                    <Button variant="ghost" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
              <Button
                variant={plan.active ? "outline" : "default"}
                onClick={handleSetActive}
                className="flex-1 mr-2"
                disabled={plan.active}
              >
                {plan.active ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Active Plan
                  </>
                ) : (
                  "Set as Active"
                )}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1 ml-2">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Plan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this workout plan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Workout Templates</CardTitle>
          </CardHeader>
          <CardContent>
            {plan.workoutTemplates.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">
                No templates added to this plan yet
              </p>
            ) : (
              <div className="space-y-2">
                {plan.workoutTemplates.map((template: any) => (
                  <Card key={template.id} className="bg-secondary/10">
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.exercises?.length || 0} exercises
                        </p>
                      </div>
                      <div className="flex">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/workout-templates/${template.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleRemoveTemplate(template.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Workout Template
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add Workout Template</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-2">
                  {workoutTemplates.length === 0 ? (
                    <p className="text-muted-foreground py-4 text-center">
                      No templates available. Create a workout template first.
                    </p>
                  ) : (
                    workoutTemplates
                      .filter((t) => !plan.workoutTemplates.some((pt: any) => pt.id === t.id))
                      .map((template) => (
                        <Card key={template.id} className="cursor-pointer hover:bg-secondary/10" onClick={() => handleAddTemplate(template.id)}>
                          <CardContent className="p-3 flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{template.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {template.exercises?.length || 0} exercises
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary">
                              Add
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanDetail;
