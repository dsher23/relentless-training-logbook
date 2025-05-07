
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, updateDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import useSettings from "@/hooks/useSettings";
import NavigationHeader from "@/components/NavigationHeader";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, settings: appSettings, updateSettings } = useAppContext();
  const { settings, updateSetting } = useSettings();
  
  const [isDeloadMode, setIsDeloadMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set deload mode from app context
    if (appSettings) {
      setIsDeloadMode(appSettings.deloadMode || false);
    }
  }, [appSettings]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/auth");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDeloadMode = async (enabled: boolean) => {
    setIsDeloadMode(enabled);
    
    if (user) {
      try {
        // Update in Firestore
        const settingsRef = doc(db, `users/${user.uid}/settings/app`);
        await updateDoc(settingsRef, {
          deloadMode: enabled
        });
        
        // Update in app context
        updateSettings({
          deloadMode: enabled
        });
        
        toast({
          title: enabled ? "Deload Mode Activated" : "Deload Mode Deactivated",
          description: enabled 
            ? "Your workout intensity will be adjusted for recovery." 
            : "Your workout intensity will return to normal.",
        });
      } catch (error) {
        console.error("Error updating deload mode:", error);
        setIsDeloadMode(!enabled); // Revert UI change
        toast({
          title: "Error",
          description: "Failed to update deload mode. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBodyWeightUnitChange = async (value: 'kg' | 'lbs' | 'stone') => {
    await updateSetting('bodyWeightUnit', value);
    toast({
      title: "Settings Updated",
      description: `Body weight unit changed to ${value}.`,
    });
  };

  const handleBodyMeasurementUnitChange = async (value: 'cm' | 'in') => {
    await updateSetting('bodyMeasurementUnit', value);
    toast({
      title: "Settings Updated",
      description: `Body measurement unit changed to ${value}.`,
    });
  };

  const handleLiftingWeightUnitChange = async (value: 'kg' | 'lbs') => {
    await updateSetting('liftingWeightUnit', value);
    toast({
      title: "Settings Updated",
      description: `Lifting weight unit changed to ${value}.`,
    });
  };

  return (
    <div className="app-container pb-16">
      <NavigationHeader title="Settings" showBack={true} />
      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Units</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bodyWeightUnit">Body Weight Unit</Label>
              <Select
                value={settings.bodyWeightUnit}
                onValueChange={(value) => handleBodyWeightUnitChange(value as 'kg' | 'lbs' | 'stone')}
              >
                <SelectTrigger id="bodyWeightUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  <SelectItem value="stone">Stone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyMeasurementUnit">Body Measurement Unit</Label>
              <Select
                value={settings.bodyMeasurementUnit}
                onValueChange={(value) => handleBodyMeasurementUnitChange(value as 'cm' | 'in')}
              >
                <SelectTrigger id="bodyMeasurementUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                  <SelectItem value="in">Inches (in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="liftingWeightUnit">Lifting Weight Unit</Label>
              <Select
                value={settings.liftingWeightUnit}
                onValueChange={(value) => handleLiftingWeightUnitChange(value as 'kg' | 'lbs')}
              >
                <SelectTrigger id="liftingWeightUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="deload-mode">Deload Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce workout intensity for recovery periods
                </p>
              </div>
              <Switch
                id="deload-mode"
                checked={isDeloadMode}
                onCheckedChange={handleToggleDeloadMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Logged in as: {user?.email || "Not logged in"}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/profile")}
              >
                Edit Profile
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold">IronLog Training App</p>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              <p className="text-xs text-muted-foreground mt-2">
                © 2025 IronLog. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
