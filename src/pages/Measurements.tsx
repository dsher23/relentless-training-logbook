
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
}

export default function Measurements() {
  const { bodyMeasurements, addBodyMeasurement } = useBodyMeasurements();
  const { 
    unitSystem, 
    convertWeight: appConvertWeight, 
    convertMeasurement: appConvertMeasurement,
    getWeightUnitDisplay, 
    getMeasurementUnitDisplay 
  } = useAppContext();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string | null>("");

  const weightUnit = getWeightUnitDisplay();
  const measureUnit = getMeasurementUnitDisplay();

  const convertedMeasurements = useMemo(() => {
    if (!bodyMeasurements) return [];
    
    return bodyMeasurements.map(m => ({
      ...m,
      displayWeight: m.weight !== undefined ? 
        appConvertWeight(m.weight, "kg", unitSystem.bodyWeightUnit) : 
        undefined,
      displayChest: m.chest !== undefined ? 
        appConvertMeasurement(m.chest, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayWaist: m.waist !== undefined ? 
        appConvertMeasurement(m.waist, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayArms: m.arms !== undefined ? 
        appConvertMeasurement(m.arms, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayForearms: m.forearms !== undefined ? 
        appConvertMeasurement(m.forearms, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayThighs: m.thighs !== undefined ? 
        appConvertMeasurement(m.thighs, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined,
      displayCalves: m.calves !== undefined ? 
        appConvertMeasurement(m.calves, "cm", unitSystem.bodyMeasurementUnit) : 
        undefined
    }));
  }, [bodyMeasurements, unitSystem, appConvertWeight, appConvertMeasurement]);

  const handleSave = () => {
    setError("");

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

    const measurement = {
      id: uuid(),
      date: new Date(draft.date),
      weight: draft.weight ? 
        appConvertWeight(Number(draft.weight), unitSystem.bodyWeightUnit, "kg") : 
        undefined,
      chest: draft.chest ? 
        appConvertMeasurement(Number(draft.chest), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      waist: draft.waist ? 
        appConvertMeasurement(Number(draft.waist), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      arms: draft.arms ? 
        appConvertMeasurement(Number(draft.arms), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      forearms: draft.forearms ? 
        appConvertMeasurement(Number(draft.forearms), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      thighs: draft.thighs ? 
        appConvertMeasurement(Number(draft.thighs), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      calves: draft.calves ? 
        appConvertMeasurement(Number(draft.calves), unitSystem.bodyMeasurementUnit, "cm") : 
        undefined,
      notes: draft.notes,
    };

    addBodyMeasurement(measurement);
    toast.success("Measurement saved successfully");
    setOpen(false);
    setDraft({ date: new Date().toISOString().slice(0, 10) });
    setError("");
  };

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

  const formatMeasurement = (key: string, value: any): string => {
    if (key === "date") {
      return new Date(value as Date | string).toLocaleDateString();
    }
    if (key === "notes" || key === "id" || value === undefined) {
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

        <Button className="w-full" onClick={() => setOpen(true)}>
          Add Measurement
        </Button>

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

            <Button className="w-full" onClick={handleSave}>
              Save
            </Button>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
