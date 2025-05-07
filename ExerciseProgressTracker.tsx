
import React, { useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { ProgressChart } from "@/components/ProgressChart";   // Updated import path

type Mode = "weight" | "volume";

export default function ExerciseProgressTracker() {
  const { workouts } = useAppContext();
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("weight");

  /* finished workouts only */
  const finished = useMemo(
    () =>
      (workouts ?? []).filter(
        (w) => w.completed === true && Array.isArray(w.exercises)
      ),
    [workouts]
  );

  /* list of unique exercise names */
  const names = useMemo(() => {
    const map = new Map<string, string>();
    finished.forEach((w) =>
      w.exercises.forEach((ex) => {
        if (!ex?.name) return;
        const canon = ex.name.trim().toLowerCase();
        if (!map.has(canon)) map.set(canon, ex.name.trim());
      })
    );
    return [...map.values()].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }, [finished]);

  /* build rows for the chart */
  const rows = useMemo(() => {
    if (!selected) return [];
    const canonSel = selected.trim().toLowerCase();

    const out: { date: string; weight: number; volume: number }[] = [];

    finished.forEach((w) => {
      let vol = 0;
      let maxWt = 0;

      w.exercises.forEach((ex) => {
        if (ex?.name?.trim().toLowerCase() !== canonSel) return;
        ex.sets?.forEach((s) => {
          const wt = Number(s.weight) || 0;
          const reps = Number(s.reps) || 0;
          vol += wt * reps;
          if (wt > maxWt) maxWt = wt;
        });
      });

      if (vol || maxWt) {
        out.push({
          date: new Date(w.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          weight: maxWt,
          volume: vol,
        });
      }
    });

    return out.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }, [finished, selected]);

  const yLabel = mode === "weight" ? "Weight (kg)" : "Volume (kg)";
  const maxVal =
    rows.length > 0 ? Math.max(...rows.map((r) => r[mode])) : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Exercise Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* exercise buttons */}
        <div className="flex flex-wrap gap-2">
          {names.map((name) => (
            <Button
              key={name}
              size="sm"
              variant={selected === name ? "default" : "outline"}
              onClick={() => setSelected(name)}
            >
              {name}
            </Button>
          ))}
        </div>

        {/* mode tabs */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Progress Graph</h3>
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
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

        {selected && rows.length > 0 ? (
          <div className="h-64">
            <ProgressChart
              data={rows.map((r) => ({ date: r.date, value: r[mode] }))}
              yAxisLabel={yLabel}
              maxValue={maxVal}
              title={`${selected} – ${mode}`}
            />
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            {selected
              ? "No data found for this exercise."
              : "Select an exercise to view progress."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
