
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SettingsCardProps {
  settings: {
    darkMode: boolean;
    restTimer: boolean;
    units: "kg" | "lbs";
  };
  onSettingChange: (
    setting: "darkMode" | "restTimer" | "units",
    value: boolean | string
  ) => void;
  onResetData: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  settings,
  onSettingChange,
  onResetData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={settings.darkMode}
            onCheckedChange={(checked) => onSettingChange("darkMode", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="rest-timer">Rest Timer</Label>
          <Switch
            id="rest-timer"
            checked={settings.restTimer}
            onCheckedChange={(checked) => onSettingChange("restTimer", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>Measurement Units</Label>
          <ToggleGroup
            type="single"
            value={settings.units}
            onValueChange={(value) => {
              if (value) onSettingChange("units", value);
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="kg">kg</ToggleGroupItem>
            <ToggleGroupItem value="lbs">lbs</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  your workouts, progress, and settings data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onResetData}>
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsCard;
