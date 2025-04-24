
import React from "react";
import { Search, Star, StarOff } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ExerciseSelectProps {
  selectedExercise: string;
  exerciseNames: string[];
  favorites: { name: string; lastUsed: Date }[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectExercise: (exercise: string) => void;
  onToggleFavorite: (exercise: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ExerciseSelect: React.FC<ExerciseSelectProps> = ({
  selectedExercise,
  exerciseNames = [], // Provide default empty array
  favorites = [], // Provide default empty array
  searchTerm = "", // Provide default empty string
  onSearchChange,
  onSelectExercise,
  onToggleFavorite,
  open,
  setOpen,
}) => {
  const isExerciseFavorite = (name: string) => {
    return favorites.some(fav => fav.name === name);
  };

  const safeExerciseNames = Array.isArray(exerciseNames) ? exerciseNames : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedExercise
            ? selectedExercise
            : "Select an exercise..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search exercises..." 
            className="h-9"
            value={searchTerm}
            onValueChange={onSearchChange}
          />
          <CommandEmpty>No exercise found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {safeExerciseNames.map((exercise) => (
              <CommandItem
                key={exercise}
                value={exercise}
                onSelect={() => {
                  onSelectExercise(exercise);
                  setOpen(false);
                }}
                className="flex justify-between items-center"
              >
                <span>{exercise}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(exercise);
                  }}
                >
                  {isExerciseFavorite(exercise) ? (
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {isExerciseFavorite(exercise) ? "Remove from favorites" : "Add to favorites"}
                  </span>
                </Button>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
