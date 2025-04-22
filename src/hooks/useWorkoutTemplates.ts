
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutTemplate } from '@/types';

export const useWorkoutTemplates = () => {
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);

  const addWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates([...workoutTemplates, template]);
  };

  const updateWorkoutTemplate = (template: WorkoutTemplate) => {
    setWorkoutTemplates(workoutTemplates.map(t => t.id === template.id ? template : t));
  };

  const deleteWorkoutTemplate = (id: string) => {
    setWorkoutTemplates(workoutTemplates.filter(t => t.id !== id));
  };

  const duplicateWorkoutTemplate = (id: string) => {
    const templateToDuplicate = workoutTemplates.find(t => t.id === id);
    if (templateToDuplicate) {
      const newTemplate = {
        ...templateToDuplicate,
        id: uuidv4(),
        name: `${templateToDuplicate.name} (Copy)`,
      };
      setWorkoutTemplates([...workoutTemplates, newTemplate]);
    }
  };

  return {
    workoutTemplates,
    setWorkoutTemplates,
    addWorkoutTemplate,
    updateWorkoutTemplate,
    deleteWorkoutTemplate,
    duplicateWorkoutTemplate,
  };
};
