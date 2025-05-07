
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const TrainingBlockForm: React.FC<{ blockId?: string; onClose: () => void }> = ({ blockId, onClose }) => {
  const { trainingBlocks, addTrainingBlock, updateTrainingBlock, addWeeklyRoutine } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [routineName, setRoutineName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If editing an existing training block, load its data
  useEffect(() => {
    if (blockId) {
      const block = trainingBlocks.find((b) => b.id === blockId);
      if (block) {
        setName(block.name);
        setStartDate(typeof block.startDate === 'string' ? block.startDate : new Date(block.startDate).toISOString().split('T')[0]);
        setEndDate(typeof block.endDate === 'string' ? block.endDate : block.endDate ? new Date(block.endDate).toISOString().split('T')[0] : '');
      }
    }
  }, [blockId, trainingBlocks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const blockData = {
        name,
        startDate,
        endDate,
        workouts: [], // Initialize with empty workouts array as per TrainingBlock type
      };

      if (blockId) {
        await updateTrainingBlock(blockId, { ...blockData, id: blockId });
        toast({
          title: "Success",
          description: "Training block updated successfully.",
        });
      } else {
        await addTrainingBlock(blockData);
        toast({
          title: "Success",
          description: "Training block added successfully.",
        });
      }

      // Add a weekly routine if specified
      if (routineName) {
        const routineData = {
          name: routineName,
          workouts: [],
          startDate,
          endDate,
          archived: false,
          workoutDays: [], 
          days: {}
        };
        
        await addWeeklyRoutine(routineData);
        toast({
          title: "Success",
          description: "Weekly routine added successfully.",
        });
      }

      onClose();
    } catch (error) {
      console.error("TrainingBlockForm.tsx: Error saving training block:", error);
      toast({
        title: "Error",
        description: "Failed to save training block.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{blockId ? "Edit Training Block" : "Add Training Block"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Training Block Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter training block name"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="routineName">Weekly Routine Name (Optional)</Label>
            <Input
              id="routineName"
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="Enter weekly routine name"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : blockId ? "Update Training Block" : "Add Training Block"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TrainingBlockForm;
