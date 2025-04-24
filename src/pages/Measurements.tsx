
/* ───────────────────────────────────────────
 /* ─────────────────────────────────────────
   src/pages/Measurements.tsx
   - log new body-measurements (+ photo)
   - list previous entries
   - show weight progress graph
   ───────────────────────────────────────── */

import React, { useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProgressChart from "@/components/ProgressChart";
import { v4 as uuid } from "uuid";

interface Draft {
  date: string;
  weight?: string;
  chest?: string;
  waist?: string;
  arms?: string;
  thighs?: string;
  notes?: string;
  photoData?: string;
}

export default function Measurements() {
  const { measurements, addMeasurement } = useAppContext();

  /* drawer (modal) for new entry */
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    date: new Date().toISOString().slice(0, 10),
  });

  /* save handler */
  const handleSave = () => {
    addMeasurement({
      id: uuid(),
      date: new Date(draft.date),
      weight: draft.weight ? Number(draft.weight) : undefined,
      chest: draft.chest ? Number(draft.chest) : undefined,
      waist: draft.waist ? Number(draft.waist) : undefined,
      arms: draft.arms ? Number(draft.arms) : undefined,
      thighs: draft.thighs ? Number(draft.thighs) : undefined,
      notes: draft.notes,
      photoData: draft.photoData,
    });
    setOpen(false);
    setDraft({ date: new Date().toISOString().slice(0, 10) });
  };

  /* build rows for weight chart */
  const weightRows = useMemo(
    () =>
      (measurements ?? [])
        .filter((m) => m.weight !== undefined)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((m) => ({
          date: m.date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          value: m.weight!,
        })),
    [measurements]
  );

  return (
    <div className="app-container pb-8">
      <NavigationHeader title="Measurements" showBack showHome />

      <div className="p-4 space-y-4">
        {/* latest entry card */}
        {measurements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest entry</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(measurements[measurements.length - 1]).map(
                ([k, v]) =>
                  k !== "id" &&
                  k !== "photoData" && (
                    <React.Fragment key={k}>
                      <span className="text-muted-foreground capitalize">
                        {k}
                      </span>
                      <span>
                        {k === "date"
                          ? (v as Date).toLocaleDateString()
                          : v}
                      </span>
                    </React.Fragment>
                  )
              )}
            </CardContent>
          </Card>
        )}

        {/* weight graph */}
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

        {/* add / open drawer */}
        <Button className="w-full" onClick={() => setOpen(true)}>
          Add measurement
        </Button>

        {/* measurement drawer */}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-4 space-y-3">
            <h3 className="font-medium text-lg">New measurement</h3>

            <Input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Weight (kg)"
                value={draft.weight ?? ""}
                onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
              />
              <Input
                placeholder="Chest (cm)"
                value={draft.chest ?? ""}
                onChange={(e) => setDraft({ ...draft, chest: e.target.value })}
              />
              <Input
                placeholder="Waist (cm)"
                value={draft.waist ?? ""}
                onChange={(e) => setDraft({ ...draft, waist: e.target.value })}
              />
              <Input
                placeholder="Arms (cm)"
                value={draft.arms ?? ""}
                onChange={(e) => setDraft({ ...draft, arms: e.target.value })}
              />
              <Input
                placeholder="Thighs (cm)"
                value={draft.thighs ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, thighs: e.target.value })
                }
              />
            </div>

            <Textarea
              placeholder="Notes"
              value={draft.notes ?? ""}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />

            <label className="block text-sm font-medium">Progress photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) =>
                  setDraft({ ...draft, photoData: ev.target?.result as string });
                reader.readAsDataURL(file);
              }}
            />

            <Button className="w-full" onClick={handleSave}>
              Save
            </Button>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

