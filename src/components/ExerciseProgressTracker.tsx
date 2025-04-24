
import React, { useState, useMemo, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { formatDistance } from "date-fns";
import { Star, Search, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateOneRepMax } from "@/utils/numberUtils";
import { ExerciseSelect } from "@/components/ExerciseSelect";
import { ExerciseStats } from "./exercise-tracker/ExerciseStats";
import { ExerciseHistory } from "./exercise-tracker/ExerciseHistory";
import { ProgressChart } from "./exercise-tracker/ProgressChart";
import { useExercises } from "@/hooks/useExercises";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const { getAllExerciseNames } = useExercises();
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<"topSet" | "volume" | "reps">("topSet");
  const [favorites, setFavorites] = useState<FavoriteExercise[]>(() => {
    try {
      const savedFavorites = localStorage.getItem("favoriteExercises");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  });
  
  // Force refresh when exercises change
  const [refreshKey, setRefreshKey] = useState(0);
  
  const completedWorkouts = (workouts || [])?.filter(workout => workout?.completed === true) || [];

  // Get exercise names from our custom hook instead of parsing workouts
  const exerciseNames = useMemo(() => {
    return getAllExerciseNames();
  }, [getAllExerciseNames, refreshKey]);

  const isExerciseFavorite = (name: string) => {
    if (!favorites || !Array.isArray(favorites) || !name) return false;
    return favorites.some(fav => fav?.name === name);
  };

  const toggleFavorite = (name: string) => {
    if (!name) return;
    
    let newFavorites: FavoriteExercise[];
    
    if (isExerciseFavorite(name)) {
      newFavorites = (favorites || []).filter(fav => fav?.name !== name);
    } else {
      newFavorites = [
        ...(favorites || []), 
        { name, lastUsed: new Date() }
      ];
    }
    
    setFavorites(newFavorites);
    try {
      localStorage.setItem("favoriteExercises", JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const exerciseData = useMemo(() => {
    if (!selectedExercise || !completedWorkouts || !Array.isArray(completedWorkouts)) return [];
    
    const data: ExerciseSetData[] = [];
    
    completedWorkouts.forEach(workout => {
      if (!workout?.exercises || !Array.isArray(workout.exercises)) return;
      
      const matchingExercise = workout.exercises.find(
        exercise => exercise?.name === selectedExercise
      );
      
      if (matchingExercise && Array.isArray(matchingExercise.sets) && matchingExercise.sets.length > 0) {
        let topSetValue = 0;
        let topSetWeight = 0;
        let topSetReps = 0;
        
        let totalVolume = 0;
        let totalReps = 0;
        
        matchingExercise.sets.forEach(set => {
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

  const chartData = useMemo(() => {
    return exerciseData.map(data => ({
      date: data.dateFormatted,
      [displayMode === "topSet" ? "Top Set" : displayMode === "volume" ? "Volume" : "Reps"]: 
        displayMode === "topSet" ? Number(data.weight) :
        displayMode === "volume" ? Number(data.volume) : 
        Number(data.reps),
      fullData: data,
      estimatedOneRM: Math.round(calculateOneRepMax(Number(data.weight), Number(data.reps)) * 10) / 10
    }));
  }, [exerciseData, displayMode]);

  const personalRecords = useMemo(() => {
    if (!exerciseData.length) return null;
    
    const maxWeight = Math.max(...exerciseData.map(data => Number(data.weight)));
    const maxVolume = Math.max(...exerciseData.map(data => Number(data.volume)));
    const maxReps = Math.max(...exerciseData.map(data => Number(data.reps)));
    const maxOneRM = Math.max(...exerciseData.map(data => 
      calculateOneRepMax(Number(data.weight), Number(data.reps))
    ));
    
    return { maxWeight, maxVolume, maxReps, maxOneRM };
  }, [exerciseData]);

  const progressMetrics = useMemo(() => {
    if (exerciseData.length < 2) return null;
    
    const first = exerciseData[0];
    const last = exerciseData[exerciseData.length - 1];
    
    const weightChange = Number(last.weight) - Number(first.weight);
    const weightPercentage = Number(first.weight) > 0 ? (weightChange / Number(first.weight)) * 100 : 0;
    
    const volumeChange = Number(last.volume) - Number(first.volume);
    const volumePercentage = Number(first.volume) > 0 ? (volumeChange / Number(first.volume)) * 100 : 0;
    
    const firstOneRM = calculateOneRepMax(Number(first.weight), Number(first.reps));
    const lastOneRM = calculateOneRepMax(Number(last.weight), Number(last.reps));
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

  const handleExercisesUpdate = () => {
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Exercises updated",
      description: "The exercise list has been updated."
    });
  };

  if (!completedWorkouts || completedWorkouts.length === 0) {
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
          <ExerciseSelect
            selectedExercise={selectedExercise || ""}
            exerciseNames={exerciseNames}
            favorites={favorites}
            searchTerm={searchTerm || ""}
            onSearchChange={setSearchTerm}
            onSelectExercise={setSelectedExercise}
            onToggleFavorite={toggleFavorite}
            onExercisesUpdate={handleExercisesUpdate}
            open={open}
            setOpen={setOpen}
          />
        </div>
        
        {selectedExercise ? (
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
                    <Star className="h-4 w-4 mr-1" />
                    <span className="text-xs">Add to favorites</span>
                  </>
                )}
              </Button>
            </div>
            
            <ExerciseStats
              progressMetrics={progressMetrics}
              personalRecords={personalRecords}
            />
            
            <div className="h-64">
              <ProgressChart
                data={chartData}
                displayMode={displayMode}
                maxValue={personalRecords?.[
                  displayMode === "topSet" 
                    ? "maxWeight" 
                    : displayMode === "volume" 
                      ? "maxVolume" 
                      : "maxReps"
                ]}
                yAxisLabel={getYAxisLabel()}
              />
            </div>
            
            <ExerciseHistory exerciseData={exerciseData.slice(-3)} />
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-50" />
            <p>Select an exercise to view progress</p>
            
            {favorites && favorites.length > 0 && (
              <div className="mt-6 w-full">
                <h4 className="text-sm font-medium mb-2">Favorite Exercises</h4>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((fav) => (
                    <Button
                      key={fav?.name || "unknown"}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      onClick={() => setSelectedExercise(fav?.name || "")}
                    >
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                      {fav?.name || ""}
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
