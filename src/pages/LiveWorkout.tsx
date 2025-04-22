
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Play, Pause, CheckCircle2, ChevronRight, 
  Clock, Timer, ArrowUp, ArrowDown, XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppContext, Workout, Exercise } from "@/context/AppContext";
import { formatDuration } from "date-fns";

const LiveWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { workouts, updateWorkout } = useAppContext();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [exerciseData, setExerciseData] = useState<{
    [key: string]: {
      sets: { reps: number; weight: number }[];
      notes: string;
      previousStats?: { reps: number; weight: number }[];
    }
  }>({});

  // Find the workout from the ID
  useEffect(() => {
    if (id) {
      const foundWorkout = workouts.find(w => w.id === id);
      if (foundWorkout) {
        setWorkout(foundWorkout);
        
        // Initialize exercise data
        const initialData: {
          [key: string]: {
            sets: { reps: number; weight: number }[];
            notes: string;
            previousStats?: { reps: number; weight: number }[];
          }
        } = {};
        
        foundWorkout.exercises.forEach(exercise => {
          // Find previous workout with the same exercise for comparison
          const previousWorkout = workouts
            .filter(w => w.id !== id && w.completed && w.exercises.some(e => e.name === exercise.name))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          const previousExercise = previousWorkout?.exercises.find(e => e.name === exercise.name);
          
          initialData[exercise.id] = {
            sets: exercise.sets.length > 0 ? [...exercise.sets] : Array(3).fill({ reps: 0, weight: 0 }),
            notes: "",
            previousStats: previousExercise?.sets
          };
        });
        
        setExerciseData(initialData);
      } else {
        toast({
          title: "Workout Not Found",
          description: "The requested workout could not be found.",
          variant: "destructive",
        });
        navigate("/workouts");
      }
    }
  }, [id, workouts, navigate, toast]);

  // Workout timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerRunning && !isResting) {
      interval = setInterval(() => {
        setWorkoutTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, isResting]);

  // Rest timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const handleSetUpdate = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      const updatedSets = [...exercise.sets];
      updatedSets[setIndex] = { 
        ...updatedSets[setIndex], 
        [field]: value 
      };
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: updatedSets
        }
      };
    });
  };

  const handleAddSet = (exerciseId: string) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      const lastSet = exercise.sets[exercise.sets.length - 1];
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: [...exercise.sets, { 
            reps: lastSet?.reps || 0, 
            weight: lastSet?.weight || 0 
          }]
        }
      };
    });
  };

  const handleRemoveSet = (exerciseId: string, setIndex: number) => {
    setExerciseData(prev => {
      const exercise = prev[exerciseId];
      const updatedSets = [...exercise.sets];
      updatedSets.splice(setIndex, 1);
      
      return {
        ...prev,
        [exerciseId]: {
          ...exercise,
          sets: updatedSets
        }
      };
    });
  };

  const handleNoteChange = (exerciseId: string, note: string) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        notes: note
      }
    }));
  };

  const startRest = (duration = 90) => {
    setIsResting(true);
    setRestTime(duration);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const nextExercise = () => {
    if (!workout) return;
    
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const finishWorkout = () => {
    if (!workout) return;
    
    // Update exercises with logged data
    const updatedExercises = workout.exercises.map(exercise => {
      const data = exerciseData[exercise.id];
      return {
        ...exercise,
        sets: data.sets,
        notes: data.notes || undefined,
        lastProgressDate: new Date()
      };
    });
    
    // Update the workout
    const updatedWorkout: Workout = {
      ...workout,
      exercises: updatedExercises,
      completed: true,
    };
    
    updateWorkout(updatedWorkout);
    
    toast({
      title: "Workout Completed",
      description: "Your workout has been logged successfully!",
    });
    
    navigate(`/workouts/${id}/summary`, { 
      state: { 
        duration: workoutTime,
        exercises: updatedExercises,
        previousStats: Object.fromEntries(
          updatedExercises.map(e => [e.id, exerciseData[e.id].previousStats])
        )
      } 
    });
  };

  const renderProgressIndicator = (exerciseId: string, setIndex: number) => {
    const currentData = exerciseData[exerciseId];
    if (!currentData?.previousStats || !currentData.previousStats[setIndex]) {
      return null;
    }
    
    const prevSet = currentData.previousStats[setIndex];
    const currentSet = currentData.sets[setIndex];
    
    // Compare volume (reps * weight)
    const prevVolume = prevSet.reps * prevSet.weight;
    const currentVolume = currentSet.reps * currentSet.weight;
    
    if (currentVolume > prevVolume) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (currentVolume < prevVolume) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    }
    
    return null;
  };

  if (!workout) {
    return <div className="p-4 text-center">Loading workout...</div>;
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentExerciseData = exerciseData[currentExercise?.id];

  return (
    <div className="app-container pb-8 animate-fade-in">
      <div className="sticky top-0 bg-background z-10 border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-semibold">{workout.name}</h1>
            <div className="text-muted-foreground text-sm">Live Workout</div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={toggleTimer}
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="text-sm font-mono">
              {formatDuration({
                hours: Math.floor(workoutTime / 3600),
                minutes: Math.floor((workoutTime % 3600) / 60),
                seconds: workoutTime % 60
              }).replace(/,/g, '')}
            </div>
          </div>
        </div>
        
        <div className="px-4 pb-2">
          <div className="text-sm flex justify-between items-center">
            <span>Exercise {currentExerciseIndex + 1} of {workout.exercises.length}</span>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={previousExercise} 
                disabled={currentExerciseIndex === 0}
              >
                Prev
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={nextExercise} 
                disabled={currentExerciseIndex === workout.exercises.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isResting ? (
        <div className="p-4">
          <Card className="border-2 border-primary">
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-2">Rest Time</h2>
              <div className="text-4xl font-bold mb-4">{restTime}s</div>
              <Button 
                variant="outline" 
                onClick={() => setIsResting(false)}
              >
                Skip Rest
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <h2 className="text-xl font-bold">{currentExercise.name}</h2>
          
          {currentExerciseData?.previousStats && (
            <div className="bg-muted/50 p-3 rounded-lg mb-4">
              <h3 className="text-sm font-medium mb-2">Previous Session</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="font-medium">Set</div>
                <div className="font-medium">Weight</div>
                <div className="font-medium">Reps</div>
                
                {currentExerciseData.previousStats.map((set, idx) => (
                  <React.Fragment key={`prev-${idx}`}>
                    <div>{idx + 1}</div>
                    <div>{set.weight}</div>
                    <div>{set.reps}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium">
              <div className="col-span-1">Set</div>
              <div className="col-span-4">Weight</div>
              <div className="col-span-4">Reps</div>
              <div className="col-span-3">Progress</div>
            </div>
            
            {currentExerciseData?.sets.map((set, idx) => (
              <div key={`set-${idx}`} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1 text-sm">{idx + 1}</div>
                <div className="col-span-4">
                  <Input 
                    type="number"
                    value={set.weight || ''}
                    onChange={(e) => handleSetUpdate(
                      currentExercise.id, 
                      idx, 
                      'weight', 
                      parseInt(e.target.value) || 0
                    )}
                    className="h-9"
                  />
                </div>
                <div className="col-span-4">
                  <Input 
                    type="number"
                    value={set.reps || ''}
                    onChange={(e) => handleSetUpdate(
                      currentExercise.id, 
                      idx, 
                      'reps', 
                      parseInt(e.target.value) || 0
                    )}
                    className="h-9"
                  />
                </div>
                <div className="col-span-2 flex items-center">
                  {renderProgressIndicator(currentExercise.id, idx)}
                </div>
                <div className="col-span-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => handleRemoveSet(currentExercise.id, idx)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAddSet(currentExercise.id)}
              >
                Add Set
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => startRest()}
              >
                <Timer className="h-4 w-4 mr-1" /> Start Rest
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Notes</h3>
            <Textarea 
              placeholder="How did this exercise feel?"
              value={currentExerciseData?.notes || ''}
              onChange={(e) => handleNoteChange(currentExercise.id, e.target.value)}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            {currentExerciseIndex === workout.exercises.length - 1 ? (
              <Button onClick={finishWorkout} className="bg-green-600 hover:bg-green-700 text-white flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" /> Complete Workout
              </Button>
            ) : (
              <Button onClick={nextExercise} className="bg-primary hover:bg-primary/90 flex items-center">
                Next Exercise <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveWorkout;
