
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutPlan, WorkoutTemplate } from '@/types';

export const useWorkoutPlans = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);

  const addWorkoutPlan = (plan: Omit<WorkoutPlan, "id">) => {
    const validatedPlan: WorkoutPlan = {
      id: uuidv4(),
      name: plan.name || "New Workout Plan",
      description: plan.description || "",
      templates: plan.templates || [],
      active: plan.active !== undefined ? plan.active : true,
      archived: plan.archived || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      routines: plan.routines || [] 
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
      const newPlan = {
        ...planToDuplicate,
        id: uuidv4(),
        name: `${planToDuplicate.name} (Copy)`,
        active: false,
        archived: false,
        updatedAt: new Date().toISOString()
      };
      setWorkoutPlans([...workoutPlans, newPlan]);
    }
  };

  const addTemplateToPlan = (planId: string, templateId: string) => {
    setWorkoutPlans(workoutPlans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          templates: [...plan.templates, templateId]
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
          templates: plan.templates.filter(t => t !== templateId)
        };
      }
      return plan;
    }));
  };

  const setActivePlan = (planId: string) => {
    setWorkoutPlans(workoutPlans.map(plan => ({
      ...plan,
      active: plan.id === planId
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
