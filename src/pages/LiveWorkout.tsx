import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, ChevronLeft, Clock, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { Exercise } from "@/types";
import { useLiveWorkout } from "@/hooks/useLiveWorkout";
import { Textarea } from "@/components/ui/textarea";
import NavigationHeader from "@/components/NavigationHeader";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LiveWorkout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTemplate = searchParams.get("isTemplate") === "true";
  const { toast } = useToast();
  const { workouts } = useAppContext();
  
  const {
    workout,
    currentExerciseIndex,
    hasAttemptedSave,
    exerciseData,
    finishWorkout,
    loadWorkout,
    nextExercise,
    previousExercise,
    handleUpdateNotes,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet
  } = useLiveWorkout();
  
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "Workout ID is missing.",
        variant: "destructive"
      });
      navigate("/workouts");
      return;
    }
    
    loadWorkout();
  }, [id, loadWorkout, navigate, toast]);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRunning) {
      if (!startTime) {
        setStartTime(new Date());
        setCurrentTime(new Date());
      }
      
      intervalId = setInterval(() => {
        setCurrentTime(new Date());
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    
    return () => clearInterval(intervalId);
  }, [isRunning, startTime]);
  
  useEffect(() => {
    if (startTime && currentTime) {
      const timeDiff = currentTime.getTime() - startTime.getTime();
      setElapsedTime(Math.floor(timeDiff / 1000));
    }
  }, [startTime, currentTime]);
  
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  if (!workout) {
    return (
      <>
        <NavigationHeader title="Loading" showBack={true} />
        <div className="p-4">Loading workout...</div>
      </>
    );
  }
  
  const currentExercise = workout.exercises[currentExerciseIndex];
  
  if (!currentExercise) {
    return (
      <>
        <NavigationHeader title={workout.name} showBack={true} />
        <div className="p-4">No exercises found in this workout.</div>
      </>
    );
  }

  const ExerciseBlock: React.FC<{
    exercise: Exercise;
    exerciseData: any;
    onAddSet: () => void;
    onRemoveSet: (index: number) => void;
    onUpdateSet: (setIndex: number, field: "reps" | "weight", value: number) => void;
    onUpdateNotes: (notes: string) => void;
  }> = ({
    exercise,
    exerciseData,
    onAddSet,
    onRemoveSet,
    onUpdateSet,
    onUpdateNotes,
  }) => {
    const sets = exerciseData?.sets || [];

    const handleSetChange = (setIndex: number, field: "reps" | "weight", value: number) => {
      onUpdateSet(setIndex, field, value);
    };

    const handleNotesChange = (notes: string) => {
      onUpdateNotes(notes);
    };

    const previousStats = exercise.previousStats || {};

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{exercise.name}</h3>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="w-4 h-4 mr-2" />
                Details
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>{exercise.name} Details</SheetTitle>
                <SheetDescription>
                  View and edit details for this exercise.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="exercise-notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="exercise-notes"
                    className="col-span-3"
                    value={exerciseData?.notes || ""}
                    onChange={(e) => handleNotesChange(e.target.value)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="space-y-2">
          {sets.map((set: any, index: number) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor={`reps-${index}`}>Reps</Label>
                <Input
                  type="number"
                  id={`reps-${index}`}
                  placeholder="0"
                  value={set?.reps || ""}
                  onChange={(e) => handleSetChange(index, "reps", Number(e.target.value))}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`weight-${index}`}>Weight</Label>
                <Input
                  type="number"
                  id={`weight-${index}`}
                  placeholder="0"
                  value={set?.weight || ""}
                  onChange={(e) => handleSetChange(index, "weight", Number(e.target.value))}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveSet(index)}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={onAddSet} variant="secondary" size="sm">
            Add Set
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader 
        title={workout.name}
        showBack={true}
        showHome={true} 
        showProfile={false}
      />
      
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {isTemplate ? "Template" : "Workout"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsRunning(prev => !prev)}>
              <Clock className="h-4 w-4 mr-2" />
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={finishWorkout} disabled={hasAttemptedSave}>
              <Save className="h-4 w-4 mr-2" />
              Finish
            </Button>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Time: {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
          </p>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-4">
            <ExerciseBlock
              exercise={currentExercise}
              exerciseData={exerciseData[currentExercise.id]}
              onAddSet={() => handleAddSet(currentExercise.id)}
              onRemoveSet={(index) => handleRemoveSet(currentExercise.id, index)}
              onUpdateSet={(setIndex, field, value) => handleSetUpdate(currentExercise.id, setIndex, field, value)}
              onUpdateNotes={(notes) => handleUpdateNotes(currentExercise.id, notes)}
            />
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button
            onClick={previousExercise}
            disabled={currentExerciseIndex === 0}
            variant="secondary"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={nextExercise}
            disabled={currentExerciseIndex === workout.exercises.length - 1}
            variant="secondary"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveWorkout;
