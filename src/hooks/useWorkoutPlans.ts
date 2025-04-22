
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutPlan, WorkoutTemplate } from '@/types';

export const useWorkoutPlans = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);

  const addWorkoutPlan = (plan: WorkoutPlan) => {
    const validatedPlan: WorkoutPlan = {
      id: plan.id || uuidv4(),
      name: plan.name || "New Workout Plan",
      description: plan.description || "",
      workoutTemplates: plan.workoutTemplates || [],
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      archived: plan.archived || false
    };
    
    setWorkoutPlans([...workoutPlans, validatedPlan]);
  };

  const updateWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans(workoutPlans.map(p => p.id === plan.id ? plan : p));
  };

  const deleteWorkoutPlan = (id: string) => {
    setWorkoutPlans(workoutPlans.filter(p => p.id !== id));
  };

  const duplicateWorkoutPlan = (id: string) => {
    const planToDuplicate = workoutPlans.find(p => p.id === id);
    if (planToDuplicate) {
      // Create new IDs for all templates within the plan
      const duplicatedTemplates = planToDuplicate.workoutTemplates.map(template => ({
        ...template,
        id: uuidv4()
      }));
      
      const newPlan = {
        ...planToDuplicate,
        id: uuidv4(),
        name: `${planToDuplicate.name} (Copy)`,
        workoutTemplates: duplicatedTemplates,
        isActive: false,
        archived: false
      };
      setWorkoutPlans([...workoutPlans, newPlan]);
    }
  };

  const addTemplateToPlan = (planId: string, templateId: string) => {
    const template = workoutPlans.flatMap(p => p.workoutTemplates).find(t => t.id === templateId);
    
    setWorkoutPlans(workoutPlans.map(plan => {
      if (plan.id === planId && template) {
        return {
          ...plan,
          workoutTemplates: [...plan.workoutTemplates, template]
        };
      }
      return plan;
    }));
  };

  const removeTemplateFromPlan = (planId: string, templateId: string) => {
    setWorkoutPlans(workoutPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          workoutTemplates: plan.workoutTemplates.filter(t => t.id !== templateId)
        };
      }
      return plan;
    }));
  };

  const setActivePlan = (planId: string) => {
    setWorkoutPlans(workoutPlans.map(plan => ({
      ...plan,
      isActive: plan.id === planId
    })));
  };

  return {
    workoutPlans,
    setWorkoutPlans,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    duplicateWorkoutPlan,
    addTemplateToPlan,
    removeTemplateFromPlan,
    setActivePlan
  };
};
