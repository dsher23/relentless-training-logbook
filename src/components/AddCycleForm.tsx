
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { SteroidCycle } from "@/types";

const AddCycleForm: React.FC<{ cycleId?: string; onClose: () => void }> = ({ cycleId, onClose }) => {
  const { steroidCycles, steroidCompounds, addSteroidCycle, updateSteroidCycle } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [selectedCompound, setSelectedCompound] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If editing an existing cycle, load its data
  useEffect(() => {
    if (cycleId) {
      const cycle = steroidCycles.find((c) => c.id === cycleId);
      if (cycle) {
        setName(cycle.name);
        setStartDate(cycle.startDate);
        setEndDate(cycle.endDate);
      }
    }
  }, [cycleId, steroidCycles]);

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
      const cycleData: Partial<SteroidCycle> = {
        name,
        compounds: [],
        startDate,
        endDate,
        isPrivate: false
      };

      if (cycleId) {
        await updateSteroidCycle(cycleId, { ...cycleData, id: cycleId } as SteroidCycle);
        toast({
          title: "Success",
          description: "Steroid cycle updated successfully.",
        });
      } else {
        await addSteroidCycle(cycleData as Omit<SteroidCycle, "id">);
        toast({
          title: "Success",
          description: "Steroid cycle added successfully.",
        });
      }
      onClose();
    } catch (error) {
      console.error("AddCycleForm.tsx: Error saving steroid cycle:", error);
      toast({
        title: "Error",
        description: "Failed to save steroid cycle.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{cycleId ? "Edit Steroid Cycle" : "Add Steroid Cycle"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Cycle Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter cycle name"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="compound">Compound</Label>
            <Select onValueChange={setSelectedCompound} value={selectedCompound}>
              <SelectTrigger id="compound">
                <SelectValue placeholder="Select a compound" />
              </SelectTrigger>
              <SelectContent>
                {steroidCompounds.map((comp) => (
                  <SelectItem key={comp.id} value={comp.name}>
                    {comp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs mt-1 text-muted-foreground">
              You can add compounds after creating the cycle
            </p>
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : cycleId ? "Update Cycle" : "Add Cycle"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCycleForm;
