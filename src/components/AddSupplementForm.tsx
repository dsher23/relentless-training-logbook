
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";
import { Supplement } from "@/types";

interface AddSupplementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSupplement?: Supplement;
}import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const AddSupplementForm: React.FC<{ supplementId?: string; onClose: () => void }> = ({ supplementId, onClose }) => {
  const { supplements, addSupplement, updateSupplement } = useAppContext();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If editing an existing supplement, load its data
  useEffect(() => {
    if (supplementId) {
      const supplement = supplements.find((s) => s.id === supplementId);
      if (supplement) {
        setName(supplement.name);
        setDosage(supplement.dosage);
        setFrequency(supplement.frequency);
      }
    }
  }, [supplementId, supplements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage || !frequency) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const supplementData = {
        name,
        dosage,
        frequency,
        date: new Date().toISOString(), // Add the required date field
      };

      if (supplementId) {
        await updateSupplement(supplementId, { ...supplementData, id: supplementId });
        toast({
          title: "Success",
          description: "Supplement updated successfully.",
        });
      } else {
        await addSupplement(supplementData);
        toast({
          title: "Success",
          description: "Supplement added successfully.",
        });
      }
      onClose();
    } catch (error) {
      console.error("AddSupplementForm.tsx: Error saving supplement:", error);
      toast({
        title: "Error",
        description: "Failed to save supplement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{supplementId ? "Edit Supplement" : "Add Supplement"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Supplement Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter supplement name"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Enter dosage (e.g., 2 capsules daily)"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Enter frequency (e.g., daily)"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : supplementId ? "Update Supplement" : "Add Supplement"}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSupplementForm;

const defaultDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AddSupplementForm: React.FC<AddSupplementFormProps> = ({
  open,
  onOpenChange,
  initialSupplement
}) => {
  const { addSupplement, updateSupplement } = useAppContext();
  const [name, setName] = useState(initialSupplement?.name || "");
  const [dosage, setDosage] = useState(initialSupplement?.dosage || "");
  const [notes, setNotes] = useState(initialSupplement?.notes || "");
  const [days, setDays] = useState<string[]>(initialSupplement?.days || [...defaultDays]);
  const [reminderTime, setReminderTime] = useState(initialSupplement?.reminderTime || "");
  
  const handleSave = () => {
    if (!name) return;
    
    const supplement: Supplement = {
      id: initialSupplement?.id || uuidv4(),
      name,
      dosage: dosage || "1 tablet",
      notes,
      days,
      history: initialSupplement?.history || [],
      reminderTime,
      schedule: initialSupplement?.schedule || {
        times: [],
        workoutDays: false
      }
    };
    
    if (initialSupplement) {
      updateSupplement(supplement);
    } else {
      addSupplement(supplement);
    }
    
    // Reset form and close
    setName("");
    setDosage("");
    setNotes("");
    setDays([...defaultDays]);
    setReminderTime("");
    onOpenChange(false);
  };
  
  const toggleDay = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialSupplement ? "Edit Supplement" : "Add Supplement"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <label htmlFor="name" className="text-right text-sm font-medium col-span-1">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Vitamin D"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <label htmlFor="dosage" className="text-right text-sm font-medium col-span-1">
              Dosage
            </label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="col-span-3"
              placeholder="1 tablet"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <label className="text-right text-sm font-medium col-span-1 mt-2">
              Days
            </label>
            <div className="flex flex-wrap gap-2 col-span-3">
              {defaultDays.map(day => (
                <Button
                  key={day}
                  type="button"
                  size="sm"
                  variant={days.includes(day) ? "default" : "outline"}
                  onClick={() => toggleDay(day)}
                  className="w-[4.5rem]"
                >
                  {day.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <label htmlFor="notes" className="text-right text-sm font-medium col-span-1">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Optional notes"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={!name}>
            {initialSupplement ? "Update Supplement" : "Add Supplement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplementForm;
