
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Exercise } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { v4 as uuidv4 } from "uuid";

interface AddExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
  exercise?: Exercise;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ isOpen, onClose, onSave, exercise }) => {
  const { exercises, addExercise } = useAppContext();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Exercise>({
    defaultValues: exercise || {
      id: "",
      name: "",
      sets: [] as any,
      reps: 10,
      weight: 0,
      restTime: 60,
      notes: "",
      isWeakPoint: false,
      category: "other",
      prExerciseType: "",
    },
  });

  const [selectedExerciseId, setSelectedExerciseId] = React.useState<string>(exercise?.id || "new-exercise");

  React.useEffect(() => {
    if (selectedExerciseId && selectedExerciseId !== "new-exercise") {
      const selected = exercises.find(ex => ex.id === selectedExerciseId);
      if (selected) {
        setValue("name", selected.name);
        setValue("sets", selected.sets);
        setValue("reps", selected.reps);
        setValue("weight", selected.weight || 0);
        setValue("restTime", selected.restTime || 60);
        setValue("notes", selected.notes || "");
        setValue("isWeakPoint", selected.isWeakPoint || false);
        setValue("category", selected.category);
        setValue("prExerciseType", selected.prExerciseType || "");
      }
    }
  }, [selectedExerciseId, exercises, setValue]);

  const onSubmit = (data: Exercise) => {
    // Create sets array based on the sets count
    const setsCount = typeof data.sets === 'number' ? data.sets : 3;
    const setsArray = Array.from({ length: setsCount }, () => ({
      reps: data.reps,
      weight: data.weight || 0
    }));

    const newExercise: Exercise = {
      ...data,
      id: exercise?.id || uuidv4(),
      name: selectedExerciseId && selectedExerciseId !== "new-exercise" ? 
        exercises.find(ex => ex.id === selectedExerciseId)!.name : data.name,
      sets: setsArray,
      category: selectedExerciseId && selectedExerciseId !== "new-exercise" ? 
        exercises.find(ex => ex.id === selectedExerciseId)!.category : data.category,
    };
    if (selectedExerciseId === "new-exercise") {
      addExercise(newExercise);
    }
    onSave(newExercise);
  };

  const prExerciseOptions = [
    { id: "none", name: "Not tracked as PR" },
    { id: "bench-press", name: "Bench Press" },
    { id: "deadlift", name: "Deadlift" },
    { id: "squat", name: "Squat" },
    { id: "shoulder-press", name: "Shoulder Press" },
    { id: "custom", name: "Custom PR" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exercise ? "Edit Exercise" : "Add Exercise"}</DialogTitle>
          <DialogDescription>
            {exercise ? "Edit the details of this exercise." : "Add a new exercise to your workout."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="prExerciseType">PR Exercise Type</Label>
            <Select
              onValueChange={(value) => setValue("prExerciseType", value)}
              defaultValue={exercise?.prExerciseType || "none"}
            >
              <SelectTrigger id="prExerciseType">
                <SelectValue placeholder="Select PR type" />
              </SelectTrigger>
              <SelectContent>
                {prExerciseOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exerciseId">Exercise Name *</Label>
            <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
              <SelectTrigger id="exerciseId">
                <SelectValue placeholder="Select or type a new exercise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-exercise">Type a new exercise</SelectItem>
                {['upper', 'lower', 'core', 'other'].map((category) => (
                  <React.Fragment key={category}>
                    {exercises
                      .filter((ex) => ex.category === category)
                      .map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.name}
                        </SelectItem>
                      ))}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>
            {selectedExerciseId === "new-exercise" && (
              <Input
                id="name"
                placeholder="e.g., Bench Press"
                {...register("name", { required: "Exercise name is required" })}
                className="mt-2"
              />
            )}
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sets">Sets</Label>
              <Input
                id="sets"
                type="number"
                {...register("sets", { required: true, valueAsNumber: true })}
                defaultValue={3}
              />
              {errors.sets && <p className="text-destructive text-sm">Sets are required</p>}
            </div>
            <div>
              <Label htmlFor="reps">Reps Per Set</Label>
              <Input
                id="reps"
                type="number"
                {...register("reps", { required: true, valueAsNumber: true })}
                defaultValue={10}
              />
              {errors.reps && <p className="text-destructive text-sm">Reps are required</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="weight">Target Weight (kg/lb)</Label>
            <Input
              id="weight"
              type="number"
              {...register("weight", { valueAsNumber: true })}
              defaultValue={0}
            />
          </div>

          <div>
            <Label htmlFor="restTime">Rest Time (seconds)</Label>
            <Select
              onValueChange={(value) => setValue("restTime", parseInt(value))}
              defaultValue={exercise?.restTime?.toString() || "60"}
            >
              <SelectTrigger id="restTime">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">60 seconds</SelectItem>
                <SelectItem value="90">90 seconds</SelectItem>
                <SelectItem value="120">120 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => setValue("category", value as 'upper' | 'lower' | 'core' | 'other')}
              defaultValue={exercise?.category || "other"}
              disabled={selectedExerciseId !== "new-exercise"}
            >
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upper">Upper Body</SelectItem>
                <SelectItem value="lower">Lower Body</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about the exercise..."
              {...register("notes")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isWeakPoint"
              {...register("isWeakPoint")}
              defaultChecked={exercise?.isWeakPoint || false}
            />
            <Label htmlFor="isWeakPoint">Mark as weak point exercise</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
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
