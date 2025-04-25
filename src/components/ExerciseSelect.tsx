
import React, { useState, useMemo } from "react";
import { Search, Star, StarOff, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useExercises, CustomExercise } from "@/hooks/useExercises";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExerciseSelectProps {
  selectedExercise: string;
  exerciseNames?: string[];
  favorites?: { name: string; lastUsed: Date }[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSelectExercise: (exercise: string) => void;
  onToggleFavorite?: (exercise: string) => void;
  onExercisesUpdate?: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ExerciseSelect: React.FC<ExerciseSelectProps> = ({
  selectedExercise = "",
  exerciseNames = [],
  favorites = [],
  searchTerm = "",
  onSearchChange = () => {},
  onSelectExercise = () => {},
  onToggleFavorite = () => {},
  onExercisesUpdate = () => {},
  open = false,
  setOpen = () => {},
}) => {
  const { toast } = useToast();
  const { customExercises, addExercise, getAllExerciseNames } = useExercises();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [isPrRelevant, setIsPrRelevant] = useState(false);
  const [prExerciseType, setPrExerciseType] = useState<string>("custom");
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Ensure we're using either provided or custom exercise names
  const combinedExerciseNames = exerciseNames && exerciseNames.length > 0 
    ? exerciseNames 
    : getAllExerciseNames();
  
  // Ensure we always have a valid array
  const safeExerciseNames = Array.isArray(combinedExerciseNames) 
    ? combinedExerciseNames.filter(Boolean) 
    : [];
  
  // Sort exercises alphabetically
  const sortedExerciseNames = useMemo(() => {
    return [...safeExerciseNames].sort((a, b) => 
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  }, [safeExerciseNames]);
  
  // Filter exercises based on search term (case insensitive)
  const filteredExerciseNames = useMemo(() => {
    if (!localSearchTerm) return sortedExerciseNames;
    
    return sortedExerciseNames.filter(name => 
      name.toLowerCase().includes((localSearchTerm || "").toLowerCase())
    );
  }, [sortedExerciseNames, localSearchTerm]);
  
  const isExerciseFavorite = (name: string) => {
    if (!favorites || !Array.isArray(favorites) || !name) return false;
    return favorites.some(fav => 
      fav?.name && fav.name.toLowerCase() === name.toLowerCase()
    );
  };
  
  const handleAddNewExercise = () => {
    if (!newExerciseName.trim()) {
      toast({
        title: "Exercise name required",
        description: "Please enter a name for the exercise.",
        variant: "destructive"
      });
      return;
    }
    
    const success = addExercise(
      newExerciseName, 
      isPrRelevant,
      isPrRelevant ? prExerciseType : undefined
    );
    
    if (success) {
      toast({
        title: "Exercise added",
        description: `${newExerciseName} has been added to your exercises.`
      });
      
      // Select the new exercise
      onSelectExercise(newExerciseName);
      setOpen(false);
      
      // Reset form
      setNewExerciseName("");
      setIsPrRelevant(false);
      setPrExerciseType("custom");
      setIsAddDialogOpen(false);
      
      // Notify parent about the update
      if (onExercisesUpdate) {
        onExercisesUpdate();
      }
    } else {
      toast({
        title: "Exercise already exists",
        description: "An exercise with this name already exists.",
        variant: "destructive"
      });
    }
  };
  
  // Remove duplicates from filteredExerciseNames
  const uniqueFilteredExerciseNames = useMemo(() => {
    const uniqueNames = new Set<string>();
    return filteredExerciseNames.filter(name => {
      const normalized = name.toLowerCase();
      if (uniqueNames.has(normalized)) return false;
      uniqueNames.add(normalized);
      return true;
    });
  }, [filteredExerciseNames]);
  
  return (
    <>
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
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search exercises..." 
              className="h-9"
              value={localSearchTerm}
              onValueChange={(value) => {
                setLocalSearchTerm(value);
                onSearchChange(value);
              }}
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              {uniqueFilteredExerciseNames.length === 0 ? (
                <CommandEmpty>
                  <div className="py-6 text-center text-sm">
                    <p>No exercise found.</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Exercise
                    </Button>
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup className="max-h-64 overflow-auto">
                  {uniqueFilteredExerciseNames.map((exercise, index) => (
                    <CommandItem
                      key={`${exercise}-${index}`}
                      value={exercise}
                      onSelect={(currentValue) => {
                        onSelectExercise(currentValue);
                        setOpen(false);
                      }}
                      className={`flex justify-between items-center ${
                        selectedExercise === exercise ? "bg-accent text-accent-foreground" : ""
                      }`}
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
              )}
              <CommandSeparator />
              <div className="p-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Exercise
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input 
                id="exercise-name" 
                placeholder="e.g., Lat Pulldown" 
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pr-relevant" 
                checked={isPrRelevant} 
                onCheckedChange={(checked) => setIsPrRelevant(checked === true)}
              />
              <Label htmlFor="pr-relevant">Mark as PR-relevant lift</Label>
            </div>
            
            {isPrRelevant && (
              <div className="space-y-2">
                <Label htmlFor="pr-type">PR Category</Label>
                <Select value={prExerciseType} onValueChange={setPrExerciseType}>
                  <SelectTrigger id="pr-type">
                    <SelectValue placeholder="Select PR category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bench-press">Bench Press</SelectItem>
                    <SelectItem value="deadlift">Deadlift</SelectItem>
                    <SelectItem value="squat">Squat</SelectItem>
                    <SelectItem value="shoulder-press">Shoulder Press</SelectItem>
                    <SelectItem value="custom">Custom PR</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This will determine which PR tracker this exercise appears in.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewExercise}>
              Add Exercise
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExerciseSelect;
