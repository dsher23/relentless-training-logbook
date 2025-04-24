import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { formatDistance } from "date-fns";
import { Star, Search, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateOneRepMax } from "@/utils/numberUtils";
import { ExerciseSelect } from "./exercise-tracker/ExerciseSelect";
import { ExerciseStats } from "./exercise-tracker/ExerciseStats";
import { ExerciseHistory } from "./exercise-tracker/ExerciseHistory";
import { ProgressChart } from "./exercise-tracker/ProgressChart";

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
    try {
      const savedFavorites = localStorage.getItem("favoriteExercises");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  const completedWorkouts = workouts?.filter(w => w?.completed === true) || [];

  const exerciseNames = useMemo(() => {
    const namesSet = new Set<string>();
    completedWorkouts?.forEach(workout => {
      workout.exercises?.forEach(ex => {
        if (ex?.name) namesSet.add(ex.name);
      });
    });
    return Array.from(namesSet).sort();
  }, [completedWorkouts]);

  const filteredExerciseNames = useMemo(() => {
    if (!searchTerm) return exerciseNames;
    return exerciseNames.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exerciseNames, searchTerm]);

  const isExerciseFavorite = (name: string) => {
    return favorites.some(f => f?.name === name);
  };

  const toggleFavorite = (name: string) => {
    const newFavs = isExerciseFavorite(name)
      ? favorites.filter(f => f.name !== name)
      : [...favorites, { name, lastUsed: new Date() }];
    setFavorites(newFavs);
    localStorage.setItem("favoriteExercises", JSON.stringify(newFavs));
  };

  const exerciseData = useMemo(() => {
    if (!selectedExercise) return [];

    const data: ExerciseSetData[] = [];

    completedWorkouts.forEach(workout => {
      const match = workout.exercises?.find(e => e.name === selectedExercise);
      if (!match || !Array.isArray(match.sets)) return;

      let topSet = 0;
      let topWeight = 0;
      let topReps = 0;
      let totalVolume = 0;
      let totalReps = 0;

      match.sets.forEach(set => {
        const weight = Number(set.weight || 0);
        const reps = Number(set.reps || 0);
        const volume = weight * reps;
        if (volume > topSet) {
          topSet = volume;
          topWeight = weight;
          topReps = reps;
        }
        totalVolume += volume;
        totalReps += reps;
      });

      const date = new Date(workout.date);
      data.push({
        date,
        weight: topWeight,
        reps: topReps,
        sets: match.sets.length,
        volume: totalVolume,
        topSet: topWeight,
        workoutName: workout.name,
        notes: match.notes || "",
        dateFormatted: date.toLocaleDateString()
      });
    });

    return data.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [completedWorkouts, selectedExercise]);

  const chartData = useMemo(() => {
    return exerciseData.map(entry => ({
      date: entry.dateFormatted,
      [displayMode === "topSet" ? "Top Set" : displayMode === "volume" ? "Volume" : "Reps"]:
        displayMode === "topSet"
          ? Number(entry.weight)
          : displayMode === "volume"
          ? Number(entry.volume)
          : Number(entry.reps),
      fullData: entry,
      estimatedOneRM: Math.round(calculateOneRepMax(entry.weight, entry.reps) * 10) / 10
    }));
  }, [exerciseData, displayMode]);

  const personalRecords = useMemo(() => {
    if (!exerciseData.length) return null;
    const maxWeight = Math.max(...exerciseData.map(e => e.weight));
    const maxVolume = Math.max(...exerciseData.map(e => e.volume));
    const maxReps = Math.max(...exerciseData.map(e => e.reps));
    const max1RM = Math.max(...exerciseData.map(e =>
      calculateOneRepMax(e.weight, e.reps)
    ));
    return { maxWeight, maxVolume, maxReps, max1RM };
  }, [exerciseData]);

  const progressMetrics = useMemo(() => {
    if (exerciseData.length < 2) return null;
    const first = exerciseData[0];
    const last = exerciseData[exerciseData.length - 1];
    const delta = (a: number, b: number) => Number(b) - Number(a);
    const percent = (a: number, b: number) => (a > 0 ? (delta(a, b) / a) * 100 : 0);
    return {
      weightChange: delta(first.weight, last.weight),
      weightPercent: percent(first.weight, last.weight),
      volumeChange: delta(first.volume, last.volume),
      volumePercent: percent(first.volume, last.volume),
      oneRMChange: delta(
        calculateOneRepMax(first.weight, first.reps),
        calculateOneRepMax(last.weight, last.reps)
      ),
      oneRMPercent: percent(
        calculateOneRepMax(first.weight, first.reps),
        calculateOneRepMax(last.weight, last.reps)
      ),
      timespan: formatDistance(new Date(last.date), new Date(first.date))
    };
  }, [exerciseData]);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Exercise Progress</CardTitle>
          <Tabs value={displayMode} onValueChange={v => setDisplayMode(v as any)} className="h-8">
            <TabsList className="h-8">
              <TabsTrigger value="topSet" className="text-xs h-7 px-2">Top Set</TabsTrigger>
              <TabsTrigger value="volume" className="text-xs h-7 px-2">
                <BarChart className="h-3 w-3 mr-1" /> Volume
              </TabsTrigger>
              <TabsTrigger value="reps" className="text-xs h-7 px-2">Reps</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-6">
        <div className="mb-4">
          <ExerciseSelect
            selectedExercise={selectedExercise}
            exerciseNames={Array.isArray(filteredExerciseNames) ? filteredExerciseNames : []}
            favorites={Array.isArray(favorites) ? favorites : []}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectExercise={setSelectedExercise}
            onToggleFavorite={toggleFavorite}
            open={open}
            setOpen={setOpen}
          />
        </div>
        {selectedExercise ? (
          <>
            <ExerciseStats
              progressMetrics={progressMetrics}
              personalRecords={personalRecords}
            />
            <div className="h-64">
              <ProgressChart
                data={chartData}
                displayMode={displayMode}
                maxValue={
                  personalRecords?.[displayMode === "topSet" ? "maxWeight" : displayMode === "volume" ? "maxVolume" : "maxReps"]
                }
                yAxisLabel={
                  displayMode === "topSet"
                    ? "Weight (kg)"
                    : displayMode === "volume"
                    ? "Volume (kg)"
                    : "Reps"
                }
              />
            </div>
            <ExerciseHistory exerciseData={exerciseData.slice(-3)} />
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-50" />
            <p>Select an exercise to view progress</p>
            {favorites?.length > 0 && (
              <div className="mt-6 w-full">
                <h4 className="text-sm font-medium mb-2">Favorite Exercises</h4>
                <div className="flex flex-wrap gap-2">
                  {favorites.map(f => (
                    <Button
                      key={f.name}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      onClick={() => setSelectedExercise(f.name)}
                    >
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                      {f.name}
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
