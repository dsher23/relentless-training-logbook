import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const AddCycleForm: React.FC<{ cycleId?: string; onClose: () => void }> = ({ cycleId, onClose }) => {
  const { steroidCycles, steroidCompounds, addSteroidCycle, updateSteroidCycle } = useAppContext();
  const { toast } = useToast();
  const [compound, setCompound] = useState("");
  const [dosage, setDosage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If editing an existing cycle, load its data
  useEffect(() => {
    if (cycleId) {
      const cycle = steroidCycles.find((c) => c.id === cycleId); // Use steroidCycles, not steroidCompounds
      if (cycle) {
        setCompound(cycle.compound);
        setDosage(cycle.dosage);
        setStartDate(cycle.startDate);
        setEndDate(cycle.endDate);
      }
    }
  }, [cycleId, steroidCycles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compound || !dosage || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const cycleData = {
        compound,
        dosage,
        startDate,
        endDate,
      };

      if (cycleId) {
        await updateSteroidCycle(cycleId, { ...cycleData, id: cycleId });
        toast({
          title: "Success",
          description: "Steroid cycle updated successfully.",
        });
      } else {
        await addSteroidCycle(cycleData);
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
            <Label htmlFor="compound">Compound</Label>
            <Select onValueChange={setCompound} value={compound}>
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
          </div>
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Enter dosage (e.g., 500mg/week)"
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
