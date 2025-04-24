
import React, { useMemo, useState, useEffect } from "react";
import { useBodyMeasurements } from "@/hooks/useBodyMeasurements";
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
  const { 
    unitSystem, 
    convertWeight, 
    convertMeasurement,
    getWeightUnitDisplay, 
    getMeasurementUnitDisplay 
  } = useAppContext();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string>("");

  const weightUnit = getWeightUnitDisplay(unitSystem.bodyWeightUnit);
  const measureUnit = getMeasurementUnitDisplay(unitSystem.bodyMeasurementUnit);

  const handleSave = () => {
    // Reset error
    setError("");

    // Validate inputs
    const numericFields = [
      { key: "weight", label: "Weight", unit: weightUnit },
      { key: "chest", label: "Chest", unit: measureUnit },
      { key: "waist", label: "Waist", unit: measureUnit },
      { key: "arms", label: "Arms", unit: measureUnit },
      { key: "forearms", label: "Forearms", unit: measureUnit },
      { key: "thighs", label: "Thighs", unit: measureUnit },
      { key: "calves", label: "Calves", unit: measureUnit },
    ];

    for (const field of numericFields) {
      const value = draft[field.key as keyof Draft];
      if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
        setError(`Invalid ${field.label}: must be a positive number in ${field.unit}`);
        return;
      }
    }

    // Convert measurements to base units (kg, cm) for storage
    const measurement = {
      id: uuid(),
      date: new Date(draft.date),
      weight: draft.weight ? 
        convertWeight(Number(draft.weight), unitSystem.bodyWeightUnit, "kg") : 
        undefined,
      chest: draft.chest ? 
        convertMeasurement(Number(draft.chest), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      waist: draft.waist ? 
        convertMeasurement(Number(draft.waist), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      arms: draft.arms ? 
        convertMeasurement(Number(draft.arms), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      forearms: draft.forearms ? 
        convertMeasurement(Number(draft.forearms), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      thighs: draft.thighs ? 
        convertMeasurement(Number(draft.thighs), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      calves: draft.calves ? 
        convertMeasurement(Number(draft.calves), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      notes: draft.notes,
      photoData: draft.photoData,
    };

    addBodyMeasurement(measurement);
    toast.success("Measurement saved successfully");
    setOpen(false);
    setDraft({ date: new Date().toISOString().slice(0, 10) });
    setError("");
  };

  // Convert stored measurements (in base units) to display units
  const convertedMeasurements = useMemo(() => {
    if (!bodyMeasurements) return [];
    
    return bodyMeasurements.map(m => ({
      ...m,
      displayWeight: m.weight !== undefined ? 
        convertWeight(m.weight, "kg", unitSystem.bodyWeightUnit) : 
        undefined,
      displayChest: m.chest !== undefined ? 
        convertMeasurement(m.chest, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayWaist: m.waist !== undefined ? 
        convertMeasurement(m.waist, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayArms: m.arms !== undefined ? 
        convertMeasurement(m.arms, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayForearms: m.forearms !== undefined ? 
        convertMeasurement(m.forearms, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayThighs: m.thighs !== undefined ? 
        convertMeasurement(m.thighs, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayCalves: m.calves !== undefined ? 
        convertMeasurement(m.calves, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined
    }));
  }, [bodyMeasurements, unitSystem, convertWeight, convertMeasurement]);

  const weightRows = useMemo(
    () =>
      convertedMeasurements
        ?.filter((m) => m.displayWeight !== undefined)
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
          value: m.displayWeight!,
        })) ?? [],
    [convertedMeasurements]
  );

  // Function to display measurement with unit
  const formatMeasurement = (key: string, value: any): string => {
    if (key === "date") {
      return new Date(value as Date | string).toLocaleDateString();
    }
    if (key === "notes" || key === "id" || key === "photoData" || value === undefined) {
      return value?.toString() || "";
    }
    if (key === "weight" || key === "displayWeight") {
      return `${value} ${weightUnit}`;
    }
    if (key.startsWith("display")) {
      return `${value} ${measureUnit}`;
    }
    return value?.toString() || "";
  };

  return (
    <div className="app-container pb-8">
      <NavigationHeader title="Measurements" showBack showHome />

      <div className="p-4 space-y-4">
        {/* Latest entry card */}
        {convertedMeasurements && convertedMeasurements.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Latest Entry</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground capitalize">Date</span>
              <span>
                {formatMeasurement('date', convertedMeasurements[convertedMeasurements.length - 1].date)}
              </span>
              
              {convertedMeasurements[convertedMeasurements.length - 1].displayWeight !== undefined && (
                <>
                  <span className="text-muted-foreground capitalize">Weight</span>
                  <span>
                    {formatMeasurement('displayWeight', convertedMeasurements[convertedMeasurements.length - 1].displayWeight)}
                  </span>
                </>
              )}
              
              {convertedMeasurements[convertedMeasurements.length - 1].displayChest !== undefined && (
                <>
                  <span className="text-muted-foreground capitalize">Chest</span>
                  <span>
                    {formatMeasurement('displayChest', convertedMeasurements[convertedMeasurements.length - 1].displayChest)}
                  </span>
                </>
              )}
              
              {convertedMeasurements[convertedMeasurements.length - 1].displayWaist !== undefined && (
                <>
                  <span className="text-muted-foreground capitalize">Waist</span>
                  <span>
                    {formatMeasurement('displayWaist', convertedMeasurements[convertedMeasurements.length - 1].displayWaist)}
                  </span>
                </>
              )}
              
              {convertedMeasurements[convertedMeasurements.length - 1].displayArms !== undefined && (
                <>
                  <span className="text-muted-foreground capitalize">Arms</span>
                  <span>
                    {formatMeasurement('displayArms', convertedMeasurements[convertedMeasurements.length - 1].displayArms)}
                  </span>
                </>
              )}
              
              {convertedMeasurements[convertedMeasurements.length - 1].displayForearms !== undefined && (
                <>
                  <span className="text-muted-foreground capitalize">Forearms</span>
                  <span>
                    {formatMeasurement('displayForearms', convertedMeasurements[convertedMeasurements.length - 1].displayForearms)}
                  </span>
                </>
              )}
              
              {convertedMeasurements[convertedMeasurements.length - 1].displayThighs !== undefined && (
                <>
                  <span className="text-muted-foreground capitalize">Thighs</span>
                  <span>
                    {formatMeasurement('displayThighs', convertedMeasurements[convertedMeasurements.length - 1].displayThighs)}
                  </span>
                </>
              )}
              
              {convertedMeasurements[convertedMeasurements.length - 1].displayCalves !== undefined && (
                <>
                  <span className="text-muted-foreground capitalize">Calves</span>
                  <span>
                    {formatMeasurement('displayCalves', convertedMeasurements[convertedMeasurements.length - 1].displayCalves)}
                  </span>
                </>
              )}
              
              {convertedMeasurements[convertedMeasurements.length - 1].notes && (
                <>
                  <span className="text-muted-foreground capitalize">Notes</span>
                  <span>{convertedMeasurements[convertedMeasurements.length - 1].notes}</span>
                </>
              )}
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
              <CardTitle className="text-lg">Weight Progress ({weightUnit})</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ProgressChart
                data={weightRows}
                yAxisLabel={`Weight (${weightUnit})`}
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
                placeholder={`Weight (${weightUnit})`}
                value={draft.weight ?? ""}
                onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
              />
              <Input
                placeholder={`Chest (${measureUnit})`}
                value={draft.chest ?? ""}
                onChange={(e) => setDraft({ ...draft, chest: e.target.value })}
              />
              <Input
                placeholder={`Waist (${measureUnit})`}
                value={draft.waist ?? ""}
                onChange={(e) => setDraft({ ...draft, waist: e.target.value })}
              />
              <Input
                placeholder={`Arms (${measureUnit})`}
                value={draft.arms ?? ""}
                onChange={(e) => setDraft({ ...draft, arms: e.target.value })}
              />
              <Input
                placeholder={`Forearms (${measureUnit})`}
                value={draft.forearms ?? ""}
                onChange={(e) => setDraft({ ...draft, forearms: e.target.value })}
              />
              <Input
                placeholder={`Thighs (${measureUnit})`}
                value={draft.thighs ?? ""}
                onChange={(e) => setDraft({ ...draft, thighs: e.target.value })}
              />
              <Input
                placeholder={`Calves (${measureUnit})`}
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
