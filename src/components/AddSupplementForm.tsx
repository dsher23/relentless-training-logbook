
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
}

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
