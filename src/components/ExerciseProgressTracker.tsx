
import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { formatDistance } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
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
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Star, StarOff, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Exercise } from "@/types";

interface ExerciseSetData {
  date: Date;
  weight: number;
  reps: number;
  sets: number;
  volume: number;
  topSet: number;
  workoutName: string;
  notes: string;
  dateFormatted: string;
}

interface FavoriteExercise {
  name: string;
  lastUsed: Date;
}

const ExerciseProgressTracker: React.FC = () => {
  const { workouts } = useAppContext();
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<"topSet" | "volume" | "reps">("topSet");
  const [favorites, setFavorites] = useState<FavoriteExercise[]>(() => {
    const savedFavorites = localStorage.getItem("favoriteExercises");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const completedWorkouts = workouts.filter(workout => workout.completed === true);

  const exerciseNames = useMemo(() => {
    const namesSet = new Set<string>();
    
    completedWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        namesSet.add(exercise.name);
      });
    });
    
    return Array.from(namesSet).sort();
  }, [completedWorkouts]);

  const filteredExerciseNames = useMemo(() => {
    if (!searchTerm) {
      return exerciseNames;
    }
    
    return exerciseNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exerciseNames, searchTerm]);

  const isExerciseFavorite = (name: string) => {
    return favorites.some(fav => fav.name === name);
  };

  const toggleFavorite = (name: string) => {
    let newFavorites: FavoriteExercise[];
    
    if (isExerciseFavorite(name)) {
      newFavorites = favorites.filter(fav => fav.name !== name);
    } else {
      newFavorites = [
        ...favorites, 
        { name, lastUsed: new Date() }
      ];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem("favoriteExercises", JSON.stringify(newFavorites));
  };

  const exerciseData = useMemo(() => {
    if (!selectedExercise) return [];
    
    const data: ExerciseSetData[] = [];
    
    completedWorkouts.forEach(workout => {
      const matchingExercise = workout.exercises.find(
        exercise => exercise.name === selectedExercise
      );
      
      if (matchingExercise && matchingExercise.sets.length > 0) {
        let topSetValue = 0;
        let topSetWeight = 0;
        let topSetReps = 0;
        
        let totalVolume = 0;
        let totalReps = 0;
        
        matchingExercise.sets.forEach(set => {
          // Fix: Explicitly convert weight and reps to numbers with fallback to 0
          const weight = Number(set?.weight || 0);
          const reps = Number(set?.reps || 0);
          
          if (weight && reps) {
            const setVolume = weight * reps;
            totalVolume += setVolume;
            totalReps += reps;
            
            if (setVolume > topSetValue) {
              topSetValue = setVolume;
              topSetWeight = weight;
              topSetReps = reps;
            }
          }
        });
        
        const workoutDate = new Date(workout.date);
        
        data.push({
          date: workoutDate,
          weight: topSetWeight,
          reps: topSetReps,
          sets: matchingExercise.sets.length,
          volume: totalVolume,
          topSet: topSetWeight,
          workoutName: workout.name,
          notes: matchingExercise.notes || "",
          dateFormatted: workoutDate.toLocaleDateString()
        });
      }
    });
    
    return data.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [completedWorkouts, selectedExercise]);

  const calculateOneRepMax = (weight: number, reps: number): number => {
    const numWeight = Number(weight);
    const numReps = Number(reps);
    
    if (numReps === 1) return numWeight;
    return numWeight * (1 + numReps / 30);
  };

  const chartData = useMemo(() => {
    return exerciseData.map(data => {
      const oneRM = calculateOneRepMax(data.weight, data.reps);
      
      return {
        date: data.dateFormatted,
        [displayMode === "topSet" ? "Top Set" : displayMode === "volume" ? "Volume" : "Reps"]: 
          displayMode === "topSet" ? data.weight :
          displayMode === "volume" ? data.volume : 
          data.reps,
        fullData: data,
        estimatedOneRM: Math.round(oneRM * 10) / 10
      };
    });
  }, [exerciseData, displayMode]);

  const personalRecords = useMemo(() => {
    if (!exerciseData.length) return null;
    
    const maxWeight = Math.max(...exerciseData.map(data => data.weight));
    const maxVolume = Math.max(...exerciseData.map(data => data.volume));
    const maxReps = Math.max(...exerciseData.map(data => data.reps));
    const maxOneRM = Math.max(...exerciseData.map(data => 
      calculateOneRepMax(data.weight, data.reps)
    ));
    
    return { maxWeight, maxVolume, maxReps, maxOneRM };
  }, [exerciseData]);

  const progressMetrics = useMemo(() => {
    if (exerciseData.length < 2) return null;
    
    const first = exerciseData[0];
    const last = exerciseData[exerciseData.length - 1];
    
    const weightChange = last.weight - first.weight;
    const weightPercentage = first.weight > 0 ? (weightChange / first.weight) * 100 : 0;
    
    const volumeChange = last.volume - first.volume;
    const volumePercentage = first.volume > 0 ? (volumeChange / first.volume) * 100 : 0;
    
    const firstOneRM = calculateOneRepMax(first.weight, first.reps);
    const lastOneRM = calculateOneRepMax(last.weight, last.reps);
    const oneRMChange = lastOneRM - firstOneRM;
    const oneRMPercentage = firstOneRM > 0 ? (oneRMChange / firstOneRM) * 100 : 0;
    
    const timespan = formatDistance(new Date(last.date), new Date(first.date));
    
    return {
      weightChange,
      weightPercentage,
      volumeChange,
      volumePercentage,
      oneRMChange,
      oneRMPercentage,
      timespan
    };
  }, [exerciseData]);

  const getYAxisLabel = () => {
    switch (displayMode) {
      case "topSet":
        return "Weight (kg)";
      case "volume":
        return "Volume (kg)";
      case "reps":
        return "Repetitions";
      default:
        return "";
    }
  };

  const getYAxisDomain = () => {
    if (chartData.length === 0) return [0, 10];
    
    const values = chartData.map(d => 
      displayMode === "topSet" ? d["Top Set"] : 
      displayMode === "volume" ? d["Volume"] : 
      d["Reps"]
    );
    
    const max = Math.max(...values);
    const min = Math.min(...values);
    const padding = (max - min) * 0.1;
    
    return [Math.max(0, min - padding), max + padding];
  };

  if (completedWorkouts.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            No completed workouts yet. Complete a workout to track your exercise progress.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Exercise Progress</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs 
              value={displayMode} 
              onValueChange={(v) => setDisplayMode(v as "topSet" | "volume" | "reps")}
              className="h-8"
            >
              <TabsList className="h-8">
                <TabsTrigger value="topSet" className="text-xs h-7 px-2">
                  Top Set
                </TabsTrigger>
                <TabsTrigger value="volume" className="text-xs h-7 px-2">
                  <BarChart className="h-3 w-3 mr-1" />
                  Volume
                </TabsTrigger>
                <TabsTrigger value="reps" className="text-xs h-7 px-2">
                  Reps
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-6">
        <div className="mb-4">
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
                  onValueChange={setSearchTerm}
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
                      className="flex justify-between items-center"
                    >
                      <span>{exercise}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(exercise);
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
        </div>
        
        {selectedExercise && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">{selectedExercise}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 p-1"
                onClick={() => toggleFavorite(selectedExercise)}
              >
                {isExerciseFavorite(selectedExercise) ? (
                  <>
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs">Favorited</span>
                  </>
                ) : (
                  <>
                    <StarOff className="h-4 w-4 mr-1" />
                    <span className="text-xs">Add to favorites</span>
                  </>
                )}
              </Button>
            </div>
            
            {progressMetrics && (
              <div className="mb-4 p-3 rounded-md bg-muted/50">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Weight</p>
                    <Badge 
                      variant={progressMetrics.weightChange > 0 ? "default" : "destructive"} 
                      className={`mt-1 text-xs ${progressMetrics.weightChange > 0 ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    >
                      {progressMetrics.weightChange > 0 ? "+" : ""}
                      {progressMetrics.weightChange} kg ({progressMetrics.weightPercentage.toFixed(1)}%)
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Est. 1RM</p>
                    <Badge 
                      variant={progressMetrics.oneRMChange > 0 ? "default" : "destructive"}
                      className={`mt-1 text-xs ${progressMetrics.oneRMChange > 0 ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    >
                      {progressMetrics.oneRMChange > 0 ? "+" : ""}
                      {progressMetrics.oneRMChange.toFixed(1)} kg ({progressMetrics.oneRMPercentage.toFixed(1)}%)
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Timespan</p>
                    <p className="text-xs font-medium mt-1">{progressMetrics.timespan}</p>
                  </div>
                </div>
              </div>
            )}
            
            {personalRecords && (
              <div className="mb-4 flex justify-between text-xs">
                <div className="text-center">
                  <p className="text-muted-foreground">Max Weight</p>
                  <p className="font-medium">{personalRecords.maxWeight} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Est. 1RM</p>
                  <p className="font-medium">{personalRecords.maxOneRM.toFixed(1)} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Max Volume</p>
                  <p className="font-medium">{personalRecords.maxVolume} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Max Reps</p>
                  <p className="font-medium">{personalRecords.maxReps}</p>
                </div>
              </div>
            )}
            
            <div className="h-64">
              {chartData.length > 0 ? (
                <ChartContainer
                  className="mb-4"
                  config={{
                    progress: { label: "Progress" },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        domain={getYAxisDomain()}
                        allowDecimals={displayMode !== "reps"}
                        label={{ 
                          value: getYAxisLabel(), 
                          angle: -90, 
                          position: 'insideLeft', 
                          style: { fontSize: 10, textAnchor: 'middle' } 
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const fullData = data.fullData as ExerciseSetData;
                            
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-md">
                                <div className="grid gap-1">
                                  <div className="font-medium">{data.date}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {displayMode === "topSet" && <span>Weight: <span className="font-medium">{fullData.weight} kg</span> × {fullData.reps} reps</span>}
                                    {displayMode === "volume" && <span>Volume: <span className="font-medium">{fullData.volume} kg</span> ({fullData.sets} sets)</span>}
                                    {displayMode === "reps" && <span>Reps: <span className="font-medium">{fullData.reps}</span> at {fullData.weight} kg</span>}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Est. 1RM: <span className="font-medium">{data.estimatedOneRM} kg</span>
                                  </div>
                                  {fullData.notes && (
                                    <div className="text-xs italic mt-1 text-muted-foreground">
                                      "{fullData.notes}"
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey={
                          displayMode === "topSet" 
                            ? "Top Set" 
                            : displayMode === "volume" 
                              ? "Volume" 
                              : "Reps"
                        }
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                      {personalRecords && displayMode === "topSet" && (
                        <ReferenceLine 
                          y={personalRecords.maxWeight} 
                          stroke="green" 
                          strokeDasharray="3 3" 
                          label={{ 
                            value: 'PR', 
                            position: 'insideTopRight',
                            fill: 'green',
                            fontSize: 10
                          }} 
                        />
                      )}
                      {personalRecords && displayMode === "volume" && (
                        <ReferenceLine 
                          y={personalRecords.maxVolume} 
                          stroke="green" 
                          strokeDasharray="3 3" 
                          label={{ 
                            value: 'PR', 
                            position: 'insideTopRight',
                            fill: 'green',
                            fontSize: 10
                          }} 
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-md border-dashed">
                  <p className="text-muted-foreground text-sm">
                    No data available for this exercise
                  </p>
                </div>
              )}
            </div>
            
            {chartData.length > 0 && (
              <div className="mt-4 text-sm">
                <h4 className="font-medium mb-2 text-sm">Recent History</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b">
                      <tr>
                        <th className="py-2 text-left font-medium">Date</th>
                        <th className="py-2 text-right font-medium">Weight</th>
                        <th className="py-2 text-right font-medium">Reps</th>
                        <th className="py-2 text-right font-medium">Volume</th>
                        <th className="py-2 text-right font-medium">Est. 1RM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exerciseData.slice(-3).reverse().map((entry, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2 text-left">{entry.dateFormatted}</td>
                          <td className="py-2 text-right">{entry.weight} kg</td>
                          <td className="py-2 text-right">{entry.reps}</td>
                          <td className="py-2 text-right">{entry.volume} kg</td>
                          <td className="py-2 text-right">
                            {calculateOneRepMax(entry.weight, entry.reps).toFixed(1)} kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
        
        {!selectedExercise && (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-50" />
            <p>Select an exercise to view progress</p>
            
            {favorites.length > 0 && (
              <div className="mt-6 w-full">
                <h4 className="text-sm font-medium mb-2">Favorite Exercises</h4>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((fav) => (
                    <Button
                      key={fav.name}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      onClick={() => setSelectedExercise(fav.name)}
                    >
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                      {fav.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgressTracker;
