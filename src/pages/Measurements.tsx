
/* ───────────────────────────────────────────
   src/pages/Measurements.tsx
   Shows latest body-measurement entries and a simple progress line-chart
   Uses the unified ProgressChart in src/components/ProgressChart.tsx
   ─────────────────────────────────────────── */

import React, { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressChart } from "@/components/ProgressChart";   // Updated to named import
import NavigationHeader from "@/components/NavigationHeader";

export default function Measurements() {
  const { bodyMeasurements = [] } = useAppContext(); // Use bodyMeasurements instead of measurements

  /* order by date ascending */
  const sorted = useMemo(
    () =>
      [...bodyMeasurements].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [bodyMeasurements]
  );

  /* example: chart body-weight if it exists */
  const weightRows = useMemo(
    () =>
      sorted
        .filter((m) => m.weight !== undefined)
        .map((m) => ({
          date: new Date(m.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          value: Number(m.weight),
        })),
    [sorted]
  );

  const latest = sorted[sorted.length - 1];

  return (
    <div className="app-container pb-8">
      <NavigationHeader title="Measurements" showBack showHome />

      <div className="p-4 space-y-4">
        {/* current stats */}
        {latest ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest entry</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Date</span>
              <span>{new Date(latest.date).toLocaleDateString()}</span>
              {Object.entries(latest).map(
                ([k, v]) =>
                  k !== "date" && v !== undefined && (
                    <React.Fragment key={k}>
                      <span className="text-muted-foreground capitalize">
                        {k}
                      </span>
                      <span>{v}</span>
                    </React.Fragment>
                  )
              )}
            </CardContent>
          </Card>
        ) : (
          <p>No measurements logged yet.</p>
        )}

        {/* weight progress graph */}
        {weightRows.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weight progress</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ProgressChart
                data={weightRows}
                yAxisLabel="Weight (kg)"
                maxValue={Math.max(...weightRows.map((r) => r.value))}
              />
            </CardContent>
          </Card>
        )}

        {/* add-measurement button (placeholder) */}
        <Button
          className="w-full"
          onClick={() => {
            /* navigate to add-measurement form if you have one */
          }}
        >
          Add measurement
        </Button>
      </div>
    </div>
  );
}
