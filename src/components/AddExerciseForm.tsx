
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Exercise } from "@/types";

interface AddExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [restTime, setRestTime] = useState<string>("90");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Exercise name required",
        description: "Please enter an exercise name.",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      id: uuidv4(),
      name: name.trim(),
      sets: Array(sets).fill({
        reps,
        weight: weight || 0
      }),
      restTime: restTime !== "custom" ? parseInt(restTime) : undefined,
      notes: notes.trim() || undefined,
      lastProgressDate: new Date(),
      isWeakPoint: false
    };

    onSave(newExercise);
    resetForm();
    onClose();

    toast({
      title: "Exercise added",
      description: `${name} has been added to your workout.`,
    });
  };

  const resetForm = () => {
    setName("");
    setSets(3);
    setReps(10);
    setWeight(undefined);
    setRestTime("90");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); resetForm(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-name">Exercise Name*</Label>
            <Input 
              id="exercise-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bench Press"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Sets</Label>
              <Input 
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reps">Reps Per Set</Label>
              <Input 
                id="reps"
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Target Weight (kg/lb)</Label>
            <Input 
              id="weight"
              type="number"
              min="0"
              step="0.5"
              value={weight === undefined ? "" : weight}
              onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Optional"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rest-time">Rest Time (seconds)</Label>
            <Select 
              value={restTime} 
              onValueChange={setRestTime}
            >
              <SelectTrigger id="rest-time">
                <SelectValue placeholder="Select rest time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30s</SelectItem>
                <SelectItem value="60">60s</SelectItem>
                <SelectItem value="90">90s</SelectItem>
                <SelectItem value="120">120s</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {restTime === "custom" && (
              <p className="text-sm text-muted-foreground">
                You can set a custom rest time during your workout.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea 
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., slow tempo, pause at bottom"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Exercise
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseForm;
