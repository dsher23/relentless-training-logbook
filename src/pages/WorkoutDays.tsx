
import React from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DayHeader from "@/components/DayHeader";
import WorkoutDayCard from "@/components/WorkoutDayCard";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useWorkoutDays } from "@/hooks/useWorkoutDays";

/**
 * Workout Days Page - Lists, creates, edits, and deletes workout days in a plan.
 */
const WorkoutDays: React.FC = () => {
  const {
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
    confirmBulkDelete,
    setConfirmBulkDelete,
    dayToBulkDelete,
    handleCreateDay,
    handleEditDay,
    handleSaveEditDay,
    handleEditDialogDelete,
    handleConfirmDelete,
    handleBulkDeleteClick,
    handleConfirmBulkDelete,
    navigate,
  } = useWorkoutDays();

  if (!plan) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Plan Not Found" />
        <div className="p-4">
          <Button onClick={() => navigate("/exercise-plans")} variant="outline">
            Back to Exercise Plans
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in">
      <Header title={`${plan.name} - Workout Days`} />

      <DayHeader
        title="Workout Days"
        onBack={() => navigate(`/exercise-plans/${plan.id}`)}
        onAdd={() => setIsCreateDayDialogOpen(true)}
      />

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
              <Button onClick={() => setIsCreateDayDialogOpen(true)}>
                Add Workout Day
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 px-4">
          {plan.workoutTemplates.map((day) => (
            <WorkoutDayCard
              key={day.id}
              day={day}
              onEdit={handleEditDay}
              onDelete={handleBulkDeleteClick}
            />
          ))}
        </div>
      )}

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
                  Delete Workout
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
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        title="Confirm Deletion"
        message="Are you sure you want to delete this workout day? This cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
      />

      {/* Bulk card delete dialog */}
      <DeleteConfirmDialog
        open={confirmBulkDelete}
        onOpenChange={setConfirmBulkDelete}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setConfirmBulkDelete(false)}
        title="Delete Workout Day"
        message="Are you sure you want to delete this workout day? This will also remove it from any assigned weekly plans and this cannot be undone."
        confirmLabel="Yes, Delete Workout Day"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default WorkoutDays;
