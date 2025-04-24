
import React, { useMemo, useState, useEffect } from "react";
import { useBodyMeasurements } from "@/hooks/useBodyMeasurements";
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
import { toast } from "sonner";

interface Draft {
  date: string;
  weight?: string;
  chest?: string;
  waist?: string;
  arms?: string;
  forearms?: string;
  thighs?: string;
  calves?: string;
  notes?: string;
  photoData?: string;
}

export default function Measurements() {
  const { bodyMeasurements, addBodyMeasurement } = useBodyMeasurements();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string>("");

  const handleSave = () => {
    // Reset error
    setError("");

    // Validate inputs
    const numericFields = [
      { key: "weight", label: "Weight", unit: "lbs" },
      { key: "chest", label: "Chest", unit: "in" },
      { key: "waist", label: "Waist", unit: "in" },
      { key: "arms", label: "Arms", unit: "in" },
      { key: "forearms", label: "Forearms", unit: "in" },
      { key: "thighs", label: "Thighs", unit: "in" },
      { key: "calves", label: "Calves", unit: "in" },
    ];

    for (const field of numericFields) {
      const value = draft[field.key as keyof Draft];
      if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
        setError(`Invalid ${field.label}: must be a positive number in ${field.unit}`);
        return;
      }
    }

    // Convert successful measurements to numbers
    const measurement = {
      id: uuid(),
      date: new Date(draft.date),
      weight: draft.weight ? Number(draft.weight) : undefined,
      chest: draft.chest ? Number(draft.chest) : undefined,
      waist: draft.waist ? Number(draft.waist) : undefined,
      arms: draft.arms ? Number(draft.arms) : undefined,
      forearms: draft.forearms ? Number(draft.forearms) : undefined,
      thighs: draft.thighs ? Number(draft.thighs) : undefined,
      calves: draft.calves ? Number(draft.calves) : undefined,
      notes: draft.notes,
      photoData: draft.photoData,
    };

    addBodyMeasurement(measurement);
    toast.success("Measurement saved successfully");
    setOpen(false);
    setDraft({ date: new Date().toISOString().slice(0, 10) });
    setError("");
  };

  const weightRows = useMemo(
    () =>
      bodyMeasurements
        ?.filter((m) => m.weight !== undefined)
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        })
        .map((m) => ({
          date: new Date(m.date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          }),
          value: m.weight!,
        })) ?? [],
    [bodyMeasurements]
  );

  return (
    <div className="app-container pb-8">
      <NavigationHeader title="Measurements" showBack showHome />

      <div className="p-4 space-y-4">
        {/* Latest entry card */}
        {bodyMeasurements && bodyMeasurements.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest Entry</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(bodyMeasurements[bodyMeasurements.length - 1])
                .filter(([k]) => k !== "id" && k !== "photoData")
                .map(([k, v]) => (
                  <React.Fragment key={k}>
                    <span className="text-muted-foreground capitalize">{k}</span>
                    <span>
                      {k === "date"
                        ? new Date(v as Date | string).toLocaleDateString()
                        : v}
                      {k === "weight" ? " lbs" : k !== "date" && k !== "notes" ? " in" : ""}
                    </span>
                  </React.Fragment>
                ))}
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-muted-foreground">
            No measurements recorded yet.
          </p>
        )}

        {/* Weight graph */}
        {weightRows.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weight Progress</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ProgressChart
                data={weightRows}
                yAxisLabel="Weight (lbs)"
                maxValue={Math.max(...weightRows.map((r) => r.value))}
              />
            </CardContent>
          </Card>
        )}

        {/* Add / open drawer button */}
        <Button className="w-full" onClick={() => setOpen(true)}>
          Add Measurement
        </Button>

        {/* Measurement drawer */}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-4 space-y-3">
            <h3 className="font-medium text-lg">New Measurement</h3>
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <Input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Weight (lbs)"
                value={draft.weight ?? ""}
                onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
              />
              <Input
                placeholder="Chest (in)"
                value={draft.chest ?? ""}
                onChange={(e) => setDraft({ ...draft, chest: e.target.value })}
              />
              <Input
                placeholder="Waist (in)"
                value={draft.waist ?? ""}
                onChange={(e) => setDraft({ ...draft, waist: e.target.value })}
              />
              <Input
                placeholder="Arms (in)"
                value={draft.arms ?? ""}
                onChange={(e) => setDraft({ ...draft, arms: e.target.value })}
              />
              <Input
                placeholder="Forearms (in)"
                value={draft.forearms ?? ""}
                onChange={(e) => setDraft({ ...draft, forearms: e.target.value })}
              />
              <Input
                placeholder="Thighs (in)"
                value={draft.thighs ?? ""}
                onChange={(e) => setDraft({ ...draft, thighs: e.target.value })}
              />
              <Input
                placeholder="Calves (in)"
                value={draft.calves ?? ""}
                onChange={(e) => setDraft({ ...draft, calves: e.target.value })}
              />
            </div>

            <Textarea
              placeholder="Notes"
              value={draft.notes ?? ""}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            />

            <label className="block text-sm font-medium mb-1">Progress Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) =>
                  setDraft({
                    ...draft,
                    photoData: ev.target?.result as string,
                  });
                reader.readAsDataURL(file);
              }}
              className="w-full"
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
