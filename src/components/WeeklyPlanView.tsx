
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { WeeklyRoutine, WorkoutPlan } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WeeklyPlanView: React.FC<{ planId: string }> = ({ planId }) => {
  const { weeklyRoutines, workoutPlans, addWeeklyRoutine, updateWeeklyRoutine, deleteWeeklyRoutine } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [routineName, setRoutineName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const plan = workoutPlans.find((p) => p.id === planId);

  const handleAddRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName) {
      toast({
        title: "Error",
        description: "Routine name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newRoutine: Omit<WeeklyRoutine, "id"> = {
        name: routineName,
        workouts: [],
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        archived: false,
        workoutDays: [],
        days: {},
      };
      await addWeeklyRoutine(newRoutine);
      toast({
        title: "Success",
        description: "Weekly routine added successfully.",
      });
      setRoutineName("");
    } catch (error) {
      console.error("WeeklyPlanView.tsx: Error adding routine:", error);
      toast({
        title: "Error",
        description: "Failed to add routine.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteWeeklyRoutine(id);
      toast({
        title: "Success",
        description: "Weekly routine deleted successfully.",
      });
    } catch (error) {
      console.error("WeeklyPlanView.tsx: Error deleting routine:", error);
      toast({
        title: "Error",
        description: "Failed to delete routine.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRoutine = async (id: string, updatedRoutine: WeeklyRoutine) => {
    setIsLoading(true);
    try {
      await updateWeeklyRoutine(id, updatedRoutine);
      toast({
        title: "Success",
        description: "Weekly routine updated successfully.",
      });
    } catch (error) {
      console.error("WeeklyPlanView.tsx: Error updating routine:", error);
      toast({
        title: "Error",
        description: "Failed to update routine.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Weekly Plan View</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddRoutine} className="space-y-4">
          <div>
            <Label htmlFor="routineName">Routine Name</Label>
            <Input
              id="routineName"
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="Enter routine name"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Routine"}
          </Button>
        </form>
        <div className="space-y-2">
          {weeklyRoutines.map((routine) => (
            <div key={routine.id} className="p-2 border rounded">
              <p>{routine.name}</p>
              <p>Workouts: {routine.workouts.length}</p>
              <p>Workout Days: {routine.workoutDays.length}</p>
              <p>Days: {Object.keys(routine.days).length}</p>
              <Button
                onClick={() => navigate(`/routine/${routine.id}`)}
                className="mt-2"
              >
                View Routine
              </Button>
              <Button
                onClick={() => handleDeleteRoutine(routine.id)}
                variant="destructive"
                className="mt-2 ml-2"
                disabled={isLoading}
              >
                Delete
              </Button>
              <Button
                onClick={() => handleUpdateRoutine(routine.id, { ...routine, name: `${routine.name} Updated` })}
                className="mt-2 ml-2"
                disabled={isLoading}
              >
                Update Name
              </Button>
            </div>
          ))}
        </div>
        {plan && plan.workoutTemplates && (
          <div className="mt-4">
            <h3>Plan Workout Templates</h3>
            {plan.workoutTemplates.map((template) => (
              <div key={template.id} className="p-2 border rounded mt-2">
                <p>{template.name}</p>
                <p>Exercises: {template.exercises.length}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyPlanView;
