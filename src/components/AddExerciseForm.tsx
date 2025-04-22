
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
import { FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
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
      isWeakPoint: false // Added the missing required property
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
          <FormItem>
            <FormLabel htmlFor="exercise-name">Exercise Name*</FormLabel>
            <FormControl>
              <Input 
                id="exercise-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Bench Press"
                autoFocus
              />
            </FormControl>
          </FormItem>
          
          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel htmlFor="sets">Sets</FormLabel>
              <FormControl>
                <Input 
                  id="sets"
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel htmlFor="reps">Reps Per Set</FormLabel>
              <FormControl>
                <Input 
                  id="reps"
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(parseInt(e.target.value) || 1)}
                />
              </FormControl>
            </FormItem>
          </div>
          
          <FormItem>
            <FormLabel htmlFor="weight">Target Weight (kg/lb)</FormLabel>
            <FormControl>
              <Input 
                id="weight"
                type="number"
                min="0"
                step="0.5"
                value={weight === undefined ? "" : weight}
                onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Optional"
              />
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel htmlFor="rest-time">Rest Time (seconds)</FormLabel>
            <Select 
              value={restTime} 
              onValueChange={setRestTime}
            >
              <SelectTrigger>
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
              <FormDescription>
                You can set a custom rest time during your workout.
              </FormDescription>
            )}
          </FormItem>
          
          <FormItem>
            <FormLabel htmlFor="notes">Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., slow tempo, pause at bottom"
              />
            </FormControl>
          </FormItem>
          
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
