import React, { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { ProgressChart } from "@/components/exercise-tracker/ProgressChart";

type Row = { date: string; weight: number; volume: number };

export default function ExerciseProgressTracker() {
  const { workouts } = useAppContext();
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<"weight" | "volume">("weight");

  const finished = useMemo(
    () => (workouts ?? []).filter(w => w.completed === true && Array.isArray(w.exercises)),
    [workouts]
  );

  /** distinct exercise list */
  const names = useMemo(() => {
    const set = new Set<string>();
    finished.forEach(w => w.exercises.forEach(e => e?.name && set.add(e.name)));
    return [...set].sort();
  }, [finished]);

  /** pull history rows */
  const rows: Row[] = useMemo(() => {
    if (!selected) return [];

    const r: Row[] = [];
    finished.forEach(w => {
      let top = 0, vol = 0;
      w.exercises.forEach(e => {
        if (e.name?.toLowerCase() !== selected.toLowerCase()) return;
        e.sets?.forEach(s => {
          const wt = Number(s.weight ?? 0);
          const reps = Number(s.reps ?? 0);
          if (wt > top) top = wt;
          vol += wt * reps;
        });
      });
      if (top || vol)
        r.push({
          date: new Date(w.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
          weight: top,
          volume: vol,
        });
    });
    return r.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }, [finished, selected]);

  return (
    <Card>
      <CardHeader><CardTitle>Exercise Progress</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {/* selector buttons */}
        <div className="flex flex-wrap gap-2">
          {names.map(n => (
            <Button key={n} size="sm" variant={selected===n?"default":"outline"} onClick={()=>setSelected(n)}>
              {n}
            </Button>
          ))}
        </div>

        {/* mode tabs */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Progress Graph</h3>
          <Tabs value={mode} onValueChange={v=>setMode(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="weight" className="text-xs px-2">Weight</TabsTrigger>
              <TabsTrigger value="volume" className="text-xs px-2"><BarChart className="h-3 w-3 mr-1"/>Volume</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {selected && rows.length ? (
          <div className="h-64">
            <ProgressChart
              data={rows.map(r => ({ date: r.date, value: r[mode] }))}
              yAxisLabel={mode==="weight"?"Weight (kg)":"Volume (kg)"}
              maxValue={Math.max(...rows.map(r=>r[mode]))}
              title={`${selected} – ${mode}`}
            />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            {selected ? "No history yet." : "Select an exercise to view progress."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
