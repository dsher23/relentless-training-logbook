
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { calculateOneRepMax } from "@/utils/numberUtils";
import { format } from "date-fns";
import { ChevronDown, ExternalLink, Trophy, Plus } from "lucide-react";
import { ProgressChart } from "@/components/ProgressChart";
import { useExercises } from "@/hooks/useExercises";
import { PR } from "@/types/pr";
import { toast } from "sonner";

const STORAGE_KEY = "ironlog_direct_prs";

const CorePRTracker: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, unitSystem, convertWeight, getWeightUnitDisplay } = useAppContext();
  const { customExercises, CORE_LIFTS } = useExercises();
  const [selectedLift, setSelectedLift] = useState<string>("bench-press");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [error, setError] = useState("");
  const [directPRs, setDirectPRs] = useState<PR[]>([]);
  const [prData, setPrData] = useState<{
    weight: number;
    reps: number;
    oneRM: number;
    date: string;
    workoutId: string;
  } | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  const weightUnit = getWeightUnitDisplay(unitSystem.liftingWeightUnit);

  const prExerciseOptions = [
    { id: "bench-press", name: "Bench Press" },
    { id: "deadlift", name: "Deadlift" },
    { id: "squat", name: "Squat" },
    { id: "shoulder-press", name: "Shoulder Press" },
    // Add custom PR types dynamically
    ...customExercises
      .filter(ex => ex.isPrRelevant && ex.prExerciseType === "custom")
      .map(ex => ({ id: `custom-${ex.name}`, name: ex.name }))
  ];

  useEffect(() => {
    const storedPRs = localStorage.getItem(STORAGE_KEY);
    if (storedPRs) {
      try {
        setDirectPRs(JSON.parse(storedPRs));
      } catch (err) {
        console.error("Failed to parse stored PRs", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(directPRs));
  }, [directPRs]);

  const handleLogPR = () => {
    setError("");
    
    const weight = Number(newWeight);
    if (!weight || weight <= 0) {
      setError("Please enter a valid weight");
      return;
    }

    // Convert weight to kg for storage (our standard unit)
    const weightInKg = convertWeight(weight, unitSystem.liftingWeightUnit, "kg");

    const newPR: PR = {
      exerciseId: selectedLift,
      weight: weightInKg, // Store in kg
      date: new Date().toISOString(),
      reps: 1,
      isDirectEntry: true
    };

    setDirectPRs(prev => [...prev, newPR]);
    setNewWeight("");
    setIsDialogOpen(false);
    toast.success(`PR logged successfully (${weight} ${weightUnit})!`);
  };

  useEffect(() => {
    if (!workouts || !Array.isArray(workouts)) return;

    const completedWorkouts = workouts.filter(w => w?.completed === true);
    
    let bestOneRM = 0;
    let bestSet = null;
    let bestWorkoutDate = null;
    let bestWorkoutId = null;
    const historyData: any[] = [];

    // Process direct PRs
    directPRs.forEach(pr => {
      if (pr.exerciseId === selectedLift) {
        // Convert stored weight (kg) to display unit
        const displayWeight = convertWeight(pr.weight, "kg", unitSystem.liftingWeightUnit);
        
        const oneRM = calculateOneRepMax(displayWeight, pr.reps);
        if (oneRM > bestOneRM) {
          bestOneRM = oneRM;
          bestSet = { weight: displayWeight, reps: pr.reps };
          bestWorkoutDate = pr.date;
          bestWorkoutId = undefined;
        }
        
        historyData.push({
          date: format(new Date(pr.date), "MM/dd/yy"),
          fullData: {
            weight: displayWeight,
            reps: pr.reps,
            volume: displayWeight * pr.reps,
            notes: "Direct PR Entry"
          },
          "Top Set": displayWeight,
          "Reps": pr.reps,
          "Volume": displayWeight * pr.reps,
          estimatedOneRM: oneRM
        });
      }
    });

    // Process workout PRs
    (completedWorkouts || []).forEach(workout => {
      if (!workout?.exercises || !Array.isArray(workout.exercises)) return;
      
      workout.exercises.forEach(exercise => {
        const isCustomPR = selectedLift.startsWith('custom-');
        const customExerciseName = isCustomPR ? selectedLift.replace('custom-', '') : '';
        
        const isPRMatch = (exercise.prExerciseType === selectedLift) || 
          (!exercise.prExerciseType && 
           exercise.name.toLowerCase().includes(
             (prExerciseOptions.find(l => l.id === selectedLift)?.name || "").toLowerCase()
           )) ||
           (isCustomPR && exercise.name === customExerciseName);
        
        if (isPRMatch) {
          let bestSetInExercise = null;
          let bestOneRMInExercise = 0;
          
          if (!exercise?.sets || !Array.isArray(exercise.sets)) return;
          
          exercise.sets.forEach(set => {
            // Convert weights to display unit
            const weight = set?.weight ? convertWeight(Number(set.weight), "kg", unitSystem.liftingWeightUnit) : 0;
            const reps = Number(set?.reps);
            const oneRM = calculateOneRepMax(weight, reps);
            
            if (oneRM > bestOneRMInExercise) {
              bestOneRMInExercise = oneRM;
              bestSetInExercise = { ...set, weight };
            }
          });
          
          if (bestSetInExercise) {
            const weight = Number(bestSetInExercise.weight);
            const reps = Number(bestSetInExercise.reps);
            const oneRM = calculateOneRepMax(weight, reps);
            
            historyData.push({
              date: format(new Date(workout.date), "MM/dd/yy"),
              fullData: {
                weight: weight,
                reps: reps,
                volume: weight * reps,
                notes: exercise.notes || ""
              },
              "Top Set": weight,
              "Reps": reps,
              "Volume": weight * reps,
              estimatedOneRM: oneRM,
              workoutId: workout.id
            });
            
            if (oneRM > bestOneRM) {
              bestOneRM = oneRM;
              bestSet = bestSetInExercise;
              bestWorkoutDate = workout.date;
              bestWorkoutId = workout.id;
            }
          }
        }
      });
    });

    historyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setChartData(historyData);

    if (bestSet && bestWorkoutDate) {
      setPrData({
        weight: Number(bestSet.weight),
        reps: Number(bestSet.reps),
        oneRM: bestOneRM,
        date: format(new Date(bestWorkoutDate), "MMM d, yyyy"),
        workoutId: bestWorkoutId
      });
    } else {
      setPrData(null);
    }
  }, [workouts, selectedLift, directPRs, unitSystem, convertWeight]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-base">
          <span>Core Lift PR Tracker</span>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-1" />
                  Log Lift
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log New PR</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {prExerciseOptions.find(l => l.id === selectedLift)?.name || "Select lift"}
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        {prExerciseOptions.map(lift => (
                          <DropdownMenuItem 
                            key={lift.id}
                            onClick={() => setSelectedLift(lift.id)}
                          >
                            {lift.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div>
                    <Input
                      type="number"
                      placeholder={`Weight (${weightUnit})`}
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleLogPR}
                  >
                    Save PR
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  {prExerciseOptions.find(l => l.id === selectedLift)?.name || "Select lift"}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {prExerciseOptions.map(lift => (
                  <DropdownMenuItem 
                    key={lift.id}
                    onClick={() => setSelectedLift(lift.id)}
                  >
                    {lift.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {prData ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-lg flex items-center">
                    <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                    {prExerciseOptions.find(l => l.id === selectedLift)?.name} PR
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Achieved on {prData.date}
                  </p>
                </div>
                {prData.workoutId && (
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/workouts/${prData.workoutId}`)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> View Workout
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-secondary/30 p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Top Set</p>
                  <p className="font-medium text-lg">{prData.weight}{weightUnit} × {prData.reps}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-md text-center">
                  <p className="text-xs text-muted-foreground">Est. 1RM</p>
                  <p className="font-medium text-lg">{prData.oneRM.toFixed(1)}{weightUnit}</p>
                </div>
              </div>
              
              <div className="h-64">
                {chartData.length > 0 && (
                  <ProgressChart 
                    data={chartData.map(item => ({
                      date: item.date,
                      value: item.estimatedOneRM || item.fullData.weight
                    }))}
                    maxValue={prData.weight * 1.2}
                    yAxisLabel={`Weight (${weightUnit})`}
                    displayMode="topSet"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No data available for this lift</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => navigate('/workout-selection')}
              >
                Log a Workout
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CorePRTracker;
