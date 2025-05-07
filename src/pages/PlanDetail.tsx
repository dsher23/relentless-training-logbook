import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { WorkoutTemplate } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import NavigationHeader from '@/components/NavigationHeader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const PlanDetail: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { workoutPlans, workoutTemplates, getWorkoutPlan, getWorkoutTemplate, removeTemplateFromPlan, toggleTemplatePlanStatus } = useAppContext();
  const [plan, setPlan] = useState(getWorkoutPlan(planId || ''));
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    if (planId) {
      const currentPlan = getWorkoutPlan(planId);
      setPlan(currentPlan);

      if (currentPlan) {
        const templateDetails = currentPlan.templates.map(templateId => getWorkoutTemplate(templateId)).filter(Boolean) as WorkoutTemplate[];
        setTemplates(templateDetails);
      }
    }
  }, [planId, workoutPlans, workoutTemplates, getWorkoutPlan, getWorkoutTemplate]);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Plan Not Found</CardTitle>
            <CardDescription>The workout plan you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Button onClick={() => navigate('/workouts')} className="flex items-center gap-2">
              Return to Workout Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = (templateId: string) => {
    removeTemplateFromPlan(plan.id, templateId);
  };

  const handleToggleActive = (templateId: string) => {
    toggleTemplatePlanStatus(plan.id, templateId);
  };

  return (
    <div className="container pb-16">
      <NavigationHeader title="Plan Details" showBack={true} />
      <div className="mt-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate(`/create-workout?planId=${plan.id}`)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No templates added to this plan yet.
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map(template => (
                  <Card key={template.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.exercises.length} Exercises</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={template.active ? "default" : "secondary"}>
                          {template.active ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/create-workout?templateId=${template.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the template
                                from the plan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(template.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanDetail;
