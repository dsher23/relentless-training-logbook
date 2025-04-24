import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Search, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExerciseProgressTracker = () => {
  const { workouts } = useAppContext();
  const [selectedExercise, setSelectedExercise] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const completedWorkouts = Array.isArray(workouts)
    ? workouts.filter((w) => w?.completed === true)
    : [];

  const exerciseNames = useMemo(() => {
    const namesSet = new Set<string>();
    completedWorkouts.forEach((workout) => {
      if (Array.isArray(workout.exercises)) {
        workout.exercises.forEach((exercise) => {
          if (exercise?.name) namesSet.add(exercise.name);
        });
      }
    });
    return Array.from(namesSet).sort();
  }, [completedWorkouts]);

  const filteredExerciseNames = useMemo(() => {
    if (!searchTerm) return exerciseNames;
    return exerciseNames.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exerciseNames, searchTerm]);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Exercise Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedExercise || "Select an exercise"}
              <Search className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search exercises..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="h-9"
              />
              <CommandEmpty>No exercise found.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {filteredExerciseNames.map((exercise) => (
                  <CommandItem
                    key={exercise}
                    value={exercise}
                    onSelect={() => {
                      setSelectedExercise(exercise);
                      setOpen(false);
                    }}
                  >
                    {exercise}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {!selectedExercise && (
          <div className="mt-6 text-muted-foreground text-sm text-center">
            Select an exercise to see progress.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgressTracker;
