import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProgressChart } from "@/components/exercise-tracker/ProgressChart";

const ExerciseProgressTracker: React.FC = () => {
  const { workouts } = useAppContext();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<"weight" | "volume">("weight");

  const completedWorkouts = useMemo(() => {
    return workouts?.filter((w) => w?.completed === true) || [];
  }, [workouts]);

  const allExerciseNames = useMemo(() => {
    const names = new Set<string>();
    completedWorkouts.forEach((w) =>
      w.exercises.forEach((ex) => {
        if (ex.name) names.add(ex.name);
      })
    );
    return Array.from(names).sort();
  }, [completedWorkouts]);

  const chartData = useMemo(() => {
    if (!selectedExercise) return [];

    return completedWorkouts
      .map((workout) => {
        const exercise = workout.exercises.find((ex) => ex.name === selectedExercise);
        if (!exercise || !exercise.sets?.length) return null;

        const topSet = exercise.sets.reduce(
          (best, set) => (set.weight * set.reps > best ? set.weight * set.reps : best),
          0
        );
        const totalVolume = exercise.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

        return {
          date: new Date(workout.date).toLocaleDateString(),
          weight: Math.max(...exercise.sets.map((s) => s.weight)),
          volume: totalVolume,
          topSetVolume: topSet,
        };
      })
      .filter(Boolean);
  }, [completedWorkouts, selectedExercise]);

  const getYAxisLabel = () => {
    return displayMode === "weight" ? "Weight (kg)" : "Volume (kg)";
  };

  const getMaxValue = () => {
    if (!chartData.length) return 100;
    return Math.max(...chartData.map((d) => d[displayMode]));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Exercise Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {allExerciseNames.map((name) => (
            <Button
              key={name}
              size="sm"
              variant={selectedExercise === name ? "default" : "outline"}
              onClick={() => setSelectedExercise(name)}
            >
              {name}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Progress Graph</h3>
          <Tabs value={displayMode} onValueChange={(v) => setDisplayMode(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="weight" className="text-xs px-2">
                Weight
              </TabsTrigger>
              <TabsTrigger value="volume" className="text-xs px-2">
                <BarChart className="h-3 w-3 mr-1" />
                Volume
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {selectedExercise && chartData.length > 0 ? (
          <div className="h-64">
            <ProgressChart
              data={chartData.map((d) => ({
                date: d.date,
                value: d[displayMode],
              }))}
              title={`${selectedExercise} Progress`}
              yAxisLabel={getYAxisLabel()}
              maxValue={getMaxValue()}
            />
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            {selectedExercise ? "No data found for this exercise." : "Select an exercise to view progress."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgressTracker;
