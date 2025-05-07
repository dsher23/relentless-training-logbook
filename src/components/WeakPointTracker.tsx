import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { WeakPoint } from "@/types";

const WeakPointTracker: React.FC = () => {
  const { weakPoints, addWeakPoint, deleteWeakPoint } = useAppContext();
  const { toast } = useToast();
  const [muscleGroup, setMuscleGroup] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [sessionsPerWeekGoal, setSessionsPerWeekGoal] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddWeakPoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!muscleGroup || !date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const weakPointData: Omit<WeakPoint, "id"> = {
        muscleGroup,
        notes,
        date,
        priority,
        sessionsPerWeekGoal,
      };
      await addWeakPoint(weakPointData);
      toast({
        title: "Success",
        description: "Weak point added successfully.",
      });
      setMuscleGroup("");
      setNotes("");
      setDate("");
      setPriority("Low");
      setSessionsPerWeekGoal(1);
    } catch (error) {
      console.error("WeakPointTracker.tsx: Error adding weak point:", error);
      toast({
        title: "Error",
        description: "Failed to add weak point.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWeakPoint = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteWeakPoint(id);
      toast({
        title: "Success",
        description: "Weak point deleted successfully.",
      });
    } catch (error) {
      console.error("WeakPointTracker.tsx: Error deleting weak point:", error);
      toast({
        title: "Error",
        description: "Failed to delete weak point.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Weak Point Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddWeakPoint} className="space-y-4">
          <div>
            <Label htmlFor="muscleGroup">Muscle Group</Label>
            <Input
              id="muscleGroup"
              type="text"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              placeholder="Enter muscle group"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select onValueChange={(value: "Low" | "Medium" | "High") => setPriority(value)} value={priority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sessionsPerWeekGoal">Sessions Per Week Goal</Label>
            <Input
              id="sessionsPerWeekGoal"
              type="number"
              value={sessionsPerWeekGoal}
              onChange={(e) => setSessionsPerWeekGoal(Number(e.target.value))}
              placeholder="Enter sessions per week goal"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Weak Point"}
          </Button>
        </form>
        <div className="space-y-2">
          {weakPoints.map((point) => (
            <div key={point.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <p>{point.muscleGroup}</p>
                <p className="text-sm text-gray-500">{point.date}</p>
                <p className="text-sm text-gray-500">Priority: {point.priority}</p>
                <p className="text-sm text-gray-500">Sessions/Week Goal: {point.sessionsPerWeekGoal}</p>
                {point.notes && <p className="text-sm">{point.notes}</p>}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteWeakPoint(point.id)}
                disabled={isLoading}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeakPointTracker;
