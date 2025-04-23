
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
import type { WorkoutTemplate, Exercise } from "@/types";
import { v4 as uuidv4 } from "uuid";

const WorkoutDays: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    workoutPlans,
    updateWorkoutPlan,
    addWorkoutTemplate,
    removeTemplateFromPlan,
    updateWorkoutTemplate,
    deleteWorkoutPlan,
    weeklyRoutines,
    updateWeeklyRoutine,
  } = useAppContext();

  const [isCreateDayDialogOpen, setIsCreateDayDialogOpen] = useState(false);
  const [dayName, setDayName] = useState("");
  const [editingDay, setEditingDay] = useState<WorkoutTemplate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteDayId, setPendingDeleteDayId] = useState<string | null>(null);

  const plan = workoutPlans.find((p) => p.id === planId);

  // New: Confirm delete dialog for workout day (not just inside edit dialog)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [dayToBulkDelete, setDayToBulkDelete] = useState<WorkoutTemplate | null>(null);

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
    // Remove from this plan
    removeTemplateFromPlan(plan.id, dayId);

    // Remove references from ALL weekly routines
    if (weeklyRoutines && Array.isArray(weeklyRoutines)) {
      weeklyRoutines.forEach((routine) => {
        if (routine.workoutDays.some(wd => wd.workoutTemplateId === dayId)) {
          const updatedRoutine = {
            ...routine,
            workoutDays: routine.workoutDays.filter(wd => wd.workoutTemplateId !== dayId)
          };
          updateWeeklyRoutine(updatedRoutine);
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
    if (!editingDay) return;
    updateWorkoutTemplate(editingDay);

    const updatedPlanTemplates = plan.workoutTemplates.map(t =>
      t.id === editingDay.id ? editingDay : t
    );
    updateWorkoutPlan({
      ...plan,
      workoutTemplates: updatedPlanTemplates
    });

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

  // New: Handle full card "Delete Workout Day" click
  const handleBulkDeleteClick = (day: WorkoutTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setDayToBulkDelete(day);
    setConfirmBulkDelete(true);
  };
  // New handler for the dialog confirm
  const handleConfirmBulkDelete = () => {
    if (!dayToBulkDelete) return;
    handleDeleteDay(dayToBulkDelete.id);
    setDayToBulkDelete(null);
    setConfirmBulkDelete(false);
  };

  const totalSets: number = (plan.workoutTemplates as WorkoutTemplate[]).reduce(
    (acc: number, curr: WorkoutTemplate) =>
      acc + (curr.exercises?.reduce((a: number, e: Exercise) => a + (e.sets?.length ?? 0), 0) ?? 0),
    0
  );

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
                onClick={() => handleEditDay(day)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{day.name || "Untitled Workout"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {(day.exercises?.length ?? 0)} {(day.exercises?.length === 1 ? "exercise" : "exercises")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* NEW: Delete Workout Day Button, triggers bulk delete dialog */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={e => handleBulkDeleteClick(day, e)}
                        aria-label="Delete Workout Day"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                      <Button
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleEditDay(day);
                        }}
                        aria-label="Edit Workout"
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

      {/* Create Dialog */}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] w-full max-w-full">
          <DialogHeader>
            <DialogTitle>Edit Workout Day</DialogTitle>
          </DialogHeader>
          {editingDay && (
            <div className="space-y-3">
              <Label htmlFor="edit-day-name">Name</Label>
              <Input
                id="edit-day-name"
                value={editingDay.name}
                onChange={(e) =>
                  setEditingDay({ ...editingDay, name: e.target.value })
                }
              />
              <Label>Exercises</Label>
              {(editingDay.exercises ?? []).length === 0 && (
                <div className="text-muted-foreground text-sm">No exercises yet.</div>
              )}
              <div className="space-y-2">
                {(editingDay.exercises ?? []).map((ex, idx) => (
                  <div key={ex.id || idx} className="flex items-center gap-2">
                    <Input
                      value={ex.name || ""}
                      className="flex-1"
                      onChange={(e) => {
                        const newExercises = [...editingDay.exercises];
                        newExercises[idx] = { ...ex, name: e.target.value || "Exercise" };
                        setEditingDay({ ...editingDay, exercises: newExercises });
                      }}
                      aria-label="Exercise Name"
                    />
                    <Input
                      type="number"
                      value={ex.sets?.[0]?.reps ?? 0}
                      min={0}
                      className="w-16"
                      onChange={e => {
                        const newExercises = [...editingDay.exercises];
                        if (!newExercises[idx].sets) newExercises[idx].sets = [];
                        if (!newExercises[idx].sets[0]) newExercises[idx].sets[0] = { reps: 0, weight: 0 };
                        newExercises[idx].sets[0] = {
                          ...newExercises[idx].sets[0],
                          reps: parseInt(e.target.value) || 0,
                        };
                        setEditingDay({ ...editingDay, exercises: newExercises });
                      }}
                      aria-label="Sets Reps"
                    />
                    <Input
                      type="number"
                      value={ex.sets?.[0]?.weight ?? 0}
                      min={0}
                      className="w-20"
                      onChange={e => {
                        const newExercises = [...editingDay.exercises];
                        if (!newExercises[idx].sets) newExercises[idx].sets = [];
                        if (!newExercises[idx].sets[0]) newExercises[idx].sets[0] = { reps: 0, weight: 0 };
                        newExercises[idx].sets[0] = {
                          ...newExercises[idx].sets[0],
                          weight: parseFloat(e.target.value) || 0,
                        };
                        setEditingDay({ ...editingDay, exercises: newExercises });
                      }}
                      aria-label="Sets Weight"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between gap-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={handleEditDialogDelete}
                  aria-label="Delete Workout"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete Workout
                </Button>
                <Button onClick={handleSaveEditDay} className="flex-1" aria-label="Save Changes">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete dialog from inside edit */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            Are you sure you want to delete this workout day? This cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              aria-label="Confirm Delete"
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NEW: Delete dialog for bulk card delete */}
      <Dialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout Day</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            Are you sure you want to delete this workout day? This will also remove it from any assigned weekly plans and this cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmBulkDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmBulkDelete}
              aria-label="Delete Workout Day"
            >
              Yes, Delete Workout Day
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutDays;

