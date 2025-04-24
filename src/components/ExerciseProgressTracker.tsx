import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { calculateOneRepMax } from "@/utils/numberUtils";
import { ProgressChart } from "@/components/exercise-tracker/ProgressChart";

const ExerciseProgressTracker = () => {
  const { workouts } = useAppContext();
  const [selectedExercise, setSelectedExercise] = useState("");
  const [displayMode, setDisplayMode] = useState("topSet");

  const completedWorkouts = useMemo(
    () => workouts?.filter((w) => w?.completed === true) || [],
    [workouts]
  );

  const allExercises = useMemo(() => {
    const names = new Set();
    completedWorkouts.forEach((w) =>
      w.exercises?.forEach((ex) => names.add(ex.name))
    );
    return Array.from(names).sort();
  }, [completedWorkouts]);

  const exerciseData = useMemo(() => {
    if (!selectedExercise) return [];

    const data = [];

    completedWorkouts.forEach((workout) => {
      workout.exercises?.forEach((exercise) => {
        if (exercise.name !== selectedExercise) return;

        let topWeight = 0;
        let reps = 0;
        let volume = 0;

        exercise.sets?.forEach((set) => {
          const weight = Number(set.weight || 0);
          const repCount = Number(set.reps || 0);
          const setVolume = weight * repCount;
          volume += setVolume;
          if (weight > topWeight) {
            topWeight = weight;
            reps = repCount;
          }
        });

        data.push({
          date: new Date(workout.date).toLocaleDateString(),
          weight: topWeight,
          reps,
          volume,
        });
      });
    });

    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedExercise, completedWorkouts]);

  const chartData = useMemo(() => {
    return exerciseData.map((item) => ({
      date: item.date,
      ...(displayMode === "topSet"
        ? { value: item.weight }
        : displayMode === "reps"
        ? { value: item.reps }
        : { value: item.volume }),
    }));
  }, [exerciseData, displayMode]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Exercise Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropdown to select exercise */}
        <div>
          <label className="text-sm font-medium mb-1 block">Select Exercise</label>
          <select
            className="w-full border p-2 rounded text-sm"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="">-- Select Exercise --</option>
            {allExercises.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Display Tabs */}
        <Tabs value={displayMode} onValueChange={setDisplayMode}>
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger value="topSet">Top Set</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="reps">Reps</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Progress Chart */}
        <div className="h-64">
          <ProgressChart
            data={chartData}
            displayMode={displayMode}
            yAxisLabel={
              displayMode === "topSet"
                ? "Weight (kg)"
                : displayMode === "reps"
                ? "Reps"
                : "Volume"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseProgressTracker;
