
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import type { WorkoutTemplate, Exercise } from "@/types";

/**
 * Custom hook for managing workout days logic and state.
 * Handles dialog controls, CRUD, and related side effects.
 */
export const useWorkoutDays = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    workoutPlans,
    updateWorkoutPlan,
    addWorkoutTemplate,
    removeTemplateFromPlan,
    updateWorkoutTemplate,
    weeklyRoutines,
    updateWeeklyRoutine,
  } = useAppContext();

  // Dialog/UI state
  const [isCreateDayDialogOpen, setIsCreateDayDialogOpen] = useState(false);
  const [dayName, setDayName] = useState("");
  const [editingDay, setEditingDay] = useState<WorkoutTemplate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteDayId, setPendingDeleteDayId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [dayToBulkDelete, setDayToBulkDelete] = useState<WorkoutTemplate | null>(null);

  const plan = workoutPlans.find((p) => p.id === planId);

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
    if (plan) {
      updateWorkoutPlan({ ...plan, workoutTemplates: [...plan.workoutTemplates, newDay] });
    }
    setDayName("");
    setIsCreateDayDialogOpen(false);
    toast({
      title: "Success",
      description: `Added "${newDay.name}" to plan`,
    });
  };

  const handleDeleteDay = (dayId: string) => {
    if (!plan) return;
    removeTemplateFromPlan(plan.id, dayId);
    if (weeklyRoutines && Array.isArray(weeklyRoutines)) {
      weeklyRoutines.forEach((routine) => {
        if (routine.workoutDays.some(wd => wd.workoutTemplateId === dayId)) {
          updateWeeklyRoutine({
            ...routine,
            workoutDays: routine.workoutDays.filter(wd => wd.workoutTemplateId !== dayId)
          });
        }
      });
    }
    toast({
      title: "Workout Day Deleted",
      description: "This workout day has been permanently deleted from this plan and any assigned weekly routines.",
      variant: "destructive",
    });
  };

  const handleEditDay = (day: WorkoutTemplate) => {
    setEditingDay({
      ...day,
      name: day.name || "Untitled Workout",
      exercises: day.exercises || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEditDay = () => {
    if (!editingDay || !plan) return;
    updateWorkoutTemplate(editingDay);
    const updatedPlanTemplates = plan.workoutTemplates.map(t =>
      t.id === editingDay.id ? editingDay : t
    );
    updateWorkoutPlan({ ...plan, workoutTemplates: updatedPlanTemplates });
    setIsEditDialogOpen(false);
    setEditingDay(null);
    toast({
      title: "Workout Updated",
      description: "Your changes have been saved.",
    });
  };

  const handleEditDialogDelete = () => {
    if (editingDay?.id) {
      setIsEditDialogOpen(false);
      setPendingDeleteDayId(editingDay.id);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteDayId) {
      handleDeleteDay(pendingDeleteDayId);
      setPendingDeleteDayId(null);
      setIsDeleteDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingDay(null);
    }
  };

  const handleBulkDeleteClick = (day: WorkoutTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setDayToBulkDelete(day);
    setConfirmBulkDelete(true);
  };

  const handleConfirmBulkDelete = () => {
    if (!dayToBulkDelete) return;
    handleDeleteDay(dayToBulkDelete.id);
    setDayToBulkDelete(null);
    setConfirmBulkDelete(false);
  };

  return {
    plan,
    isCreateDayDialogOpen,
    setIsCreateDayDialogOpen,
    dayName,
    setDayName,
    editingDay,
    setEditingDay,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    pendingDeleteDayId,
    setPendingDeleteDayId,
    confirmBulkDelete,
    setConfirmBulkDelete,
    dayToBulkDelete,
    setDayToBulkDelete,
    handleCreateDay,
    handleDeleteDay,
    handleEditDay,
    handleSaveEditDay,
    handleEditDialogDelete,
    handleConfirmDelete,
    handleBulkDeleteClick,
    handleConfirmBulkDelete,
    navigate,
  };
};
