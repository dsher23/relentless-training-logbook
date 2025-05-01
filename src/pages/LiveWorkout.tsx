
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, ChevronLeft, Clock, Save, Info, Trophy, AlertTriangle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
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
import { Badge } from "@/components/ui/badge";

// Debounce utility function
const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const LiveWorkout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTemplate = searchParams.get("isTemplate") === "true";
  const { toast } = useToast();
  const { workouts, prLifts } = useAppContext();
  
  const {
    workout,
    currentExerciseIndex,
    hasAttemptedSave,
    exerciseData,
    finishWorkout,
    loadWorkout,
    isLoading,
    nextExercise,
    previousExercise,
    handleUpdateNotes,
    handleSetUpdate,
    handleAddSet,
    handleRemoveSet,
  } = useLiveWorkout();
  
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("Workout ID is missing");
      toast({
        title: "Error",
        description: "Workout ID is missing.",
        variant: "destructive",
      });
      navigate("/workouts");
      return;
    }
    
    console.log("Loading workout with ID:", id, "isTemplate:", isTemplate);
    loadWorkout().catch((err: Error) => {
      console.error("Error in loadWorkout:", err);
      setError(`Failed to load workout: ${err.message}`);
    });
  }, [id, loadWorkout, navigate, toast, isTemplate]);
  
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

  const handleFinishWorkout = () => {
    setIsFinishing(true);
    try {
      finishWorkout();
    } catch (error) {
      console.error("Error finishing workout:", error);
      setIsFinishing(false);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPreviousPRForExercise = (exerciseId: string) => {
    if (!prLifts || !prLifts.length) return null;
    
    const exercisePRs = prLifts.filter(pr => pr.exerciseId === exerciseId);
    if (!exercisePRs.length) return null;
    
    return [...exercisePRs].sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return b.reps - a.reps;
    })[0];
  };
  
  if (isLoading) {
    return (
      <>
        <NavigationHeader title="Loading Workout" showBack={true} />
        <div className="p-4 flex justify-center items-center h-40">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your workout...</p>
          </div>
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <NavigationHeader title="Error" showBack={true} />
        <div className="p-4">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => navigate("/workouts")} className="mt-4">
                Back to Workouts
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!workout) {
    return (
      <>
        <NavigationHeader title="Error" showBack={true} />
        <div className="p-4">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <p className="mb-4">Failed to load workout. It may not exist or there was an error.</p>
              <Button onClick={() => navigate("/workouts")} className="mt-4">
                Back to Workouts
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  
  const currentExercise = workout.exercises[currentExerciseIndex];
  
  if (!currentExercise) {
    return (
      <>
        <NavigationHeader title={workout.name} showBack={true} />
        <div className="p-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">No exercises found in this workout.</p>
              <Button onClick={() => navigate("/workouts")} className="mt-4 mx-auto block">
                Back to Workouts
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;

  const ExerciseBlock: React.FC<{
    exercise: any;
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
    const previousPR = getPreviousPRForExercise(exercise.id);

    const [inputValues, setInputValues] = useState<Record<string, string>>(
      sets.reduce((acc: Record<string, string>, set: any, index: number) => {
        acc[`reps-${index}`] = set?.reps?.toString() ?? "";
        acc[`weight-${index}`] = set?.weight?.toString() ?? "";
        return acc;
      }, {})
    );

    useEffect(() => {
      setInputValues(
        sets.reduce((acc: Record<string, string>, set: any, index: number) => {
          acc[`reps-${index}`] = set?.reps?.toString() ?? "";
          acc[`weight-${index}`] = set?.weight?.toString() ?? "";
          return acc;
        }, {})
      );
    }, [exerciseData]);

    const debouncedUpdateSet = debounce((setIndex: number, field: "reps" | "weight", value: number) => {
      onUpdateSet(setIndex, field, value);
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000); // Show saving indicator for 1 second
    }, 500);

    const handleSetChange = (setIndex: number, field: "reps" | "weight", value: string) => {
      // Allow empty string while typing
      setInputValues(prev => ({
        ...prev,
        [`${field}-${setIndex}`]: value,
      }));

      // Only update global state if the value is a valid number
      const numValue = Number(value);
      if (value !== "" && !isNaN(numValue)) {
        debouncedUpdateSet(setIndex, field, numValue);
      }
    };

    const handleNotesChange = (notes: string) => {
      onUpdateNotes(notes);
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold flex items-center">
            {exercise.name}
            {exercise.prExerciseType && (
              <Badge variant="default" className="ml-2 bg-yellow-500/10 text-yellow-600 border-yellow-500 flex items-center gap-1">
                <Trophy className="h-3 w-3" /> PR Lift
              </Badge>
            )}
          </h3>
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
                {previousPR && (
                  <div className="border rounded-md p-3 bg-yellow-50 border-yellow-200">
                    <h4 className="font-medium flex items-center mb-1">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" /> 
                      Personal Record
                    </h4>
                    <p className="text-sm">
                      {previousPR.weight} kg × {previousPR.reps} reps
                      {previousPR.date && (
                        <span className="ml-1 text-muted-foreground">
                          ({new Date(previousPR.date).toLocaleDateString()})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="exercise-notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="exercise-notes"
                    className="col-span-3"
                    value={exerciseData?.notes || ""}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Add notes about your performance or form..."
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-1 font-medium text-sm">Set</div>
            <div className="col-span-5 font-medium text-sm">Weight</div>
            <div className="col-span-5 font-medium text-sm">Reps</div>
            <div className="col-span-1"></div>
          </div>
          
          {sets.map((set: any, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 text-sm font-medium">{index + 1}</div>
              <div className="col-span-5">
                <Input
                  type="number"
                  id={`weight-${index}`}
                  placeholder="0"
                  inputMode="decimal"
                  value={inputValues[`weight-${index}`] ?? ""}
                  onChange={(e) => handleSetChange(index, "weight", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="col-span-5">
                <Input
                  type="number"
                  id={`reps-${index}`}
                  placeholder="0"
                  inputMode="numeric"
                  value={inputValues[`reps-${index}`] ?? ""}
                  onChange={(e) => handleSetChange(index, "reps", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onRemoveSet(index);
                    setInputValues(prev => {
                      const newValues = { ...prev };
                      delete newValues[`reps-${index}`];
                      delete newValues[`weight-${index}`];
                      return newValues;
                    });
                  }}
                  className="h-9 w-9 p-0"
                >
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            onClick={() => {
              onAddSet();
              setInputValues(prev => ({
                ...prev,
                [`reps-${sets.length}`]: "",
                [`weight-${sets.length}`]: "",
              }));
            }}
            variant="secondary"
            size="sm"
            className="w-full mt-2"
          >
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
              {isTemplate ? "Template" : "Workout"} • Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleTimer} size="sm">
              <Clock className="h-4 w-4 mr-2" />
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button 
              onClick={handleFinishWorkout} 
              disabled={hasAttemptedSave || isFinishing}
              size="sm"
            >
              {isFinishing ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Finish
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mb-4 flex justify-between">
          <p className="text-sm text-muted-foreground">
            Time: {Math.floor(elapsedTime / 60)}:{String(elapsedTime % 60).padStart(2, '0')}
          </p>
          <p className="text-sm text-muted-foreground">
            {isSaving ? "Saving..." : "Progress Saved"}
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
        
        <div className="flex justify-between items-center">
          <Button
            onClick={previousExercise}
            disabled={currentExerciseIndex === 0}
            variant="secondary"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {isLastExercise ? (
            <p className="text-sm text-muted-foreground">
              Last exercise – click Finish to save
            </p>
          ) : (
            <span></span>
          )}
          <Button
            onClick={nextExercise}
            disabled={isLastExercise}
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
