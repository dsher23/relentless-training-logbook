import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bed, AlertTriangle, Loader } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface WeeklyRecoveryData {
  weekStart: string;
  sleepHours: number[];
  generalFeeling: "Energized" | "Normal" | "Tired" | "Exhausted";
}

const Recovery: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { weeklyRecoveryData, setWeeklyRecoveryData, workouts } = useAppContext();
  const [sleepHours, setSleepHours] = useState<number[]>(Array(7).fill(0));
  const [generalFeeling, setGeneralFeeling] = useState<"Energized" | "Normal" | "Tired" | "Exhausted">("Normal");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      if (weeklyRecoveryData) {
        setSleepHours(weeklyRecoveryData.sleepHours);
        setGeneralFeeling(weeklyRecoveryData.generalFeeling);
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error("Recovery: Error loading recovery data:", err.message);
      setError("Failed to load recovery data.");
      setIsLoading(false);
    }
  }, [weeklyRecoveryData]);

  const getCurrentWeekStart = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7; // Monday is 0
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysSinceMonday);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString();
  };

  const calculateRestDays = () => {
    const weekStart = new Date(getCurrentWeekStart());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const workoutDates = workouts
      .filter((w: any) => {
        const workoutDate = new Date(w.date);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      })
      .map((w: any) => new Date(w.date).toDateString());
    const uniqueWorkoutDays = new Set(workoutDates).size;
    return 7 - uniqueWorkoutDays;
  };

  const calculateRecoveryScore = () => {
    const avgSleep = sleepHours.reduce((sum, hours) => sum + hours, 0) / 7;
    const sleepScore = Math.min(avgSleep * 5, 50); // Max 50 points
    const feelingScore = {
      "Energized": 30,
      "Normal": 20,
      "Tired": 10,
      "Exhausted": 0,
    }[generalFeeling];
    const restDays = calculateRestDays();
    const restDaysScore = restDays >= 2 ? 20 : restDays === 1 ? 10 : 0;
    return Math.min(sleepScore + feelingScore + restDaysScore, 100);
  };

  const getRecommendations = () => {
    const avgSleep = sleepHours.reduce((sum, hours) => sum + hours, 0) / 7;
    const recommendations: string[] = [];
    if ((generalFeeling === "Tired" || generalFeeling === "Exhausted") && avgSleep < 7) {
      recommendations.push(`You seem ${generalFeeling.toLowerCase()} and aren't getting enough sleep (average: ${avgSleep.toFixed(1)} hours). Aim for at least 7-8 hours per night to improve recovery.`);
    } else if (avgSleep >= 7 && (generalFeeling === "Tired" || generalFeeling === "Exhausted")) {
      recommendations.push(`You're getting enough sleep, but still feeling ${generalFeeling.toLowerCase()}. Consider reducing workout intensity or adding a rest day.`);
    }
    const restDays = calculateRestDays();
    if (restDays < 2) {
      recommendations.push(`You've taken ${restDays} rest days this week. Aim for at least 2 rest days per week to optimize recovery.`);
    }
    return recommendations.length > 0 ? recommendations : ["You're on track with your recovery. Keep up the good work!"];
  };

  const handleSaveRecoveryData = async () => {
    setIsSaving(true);
    try {
      const newData: WeeklyRecoveryData = {
        weekStart: getCurrentWeekStart(),
        sleepHours,
        generalFeeling,
      };
      await setWeeklyRecoveryData(newData);
      toast({
        title: "Success",
        description: "Recovery data saved successfully.",
      });
    } catch (error) {
      console.error("Error saving recovery data:", error);
      toast({
        title: "Error",
        description: "Failed to save recovery data.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app-container animate-fade-in pb-16">
        <NavigationHeader title="Recovery" showBack={true} showHome={true} showProfile={false} />
        <div className="px-4 py-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
            <p className="text-muted-foreground">Loading recovery data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container animate-fade-in pb-16">
        <NavigationHeader title="Recovery" showBack={true} showHome={true} showProfile={false} />
        <div className="px-4 py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4 mx-auto" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const recoveryScore = calculateRecoveryScore();
  const recommendations = getRecommendations();

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Recovery" showBack={true} showHome={true} showProfile={false} />
      <div className="px-4 pt-4 space-y-6">
        {/* Sleep Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sleep Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map((day, index) => (
              <div key={day} className="flex items-center gap-2">
                <Label className="w-16">{day}</Label>
                <Input
                  type="number"
                  value={sleepHours[index]}
                  onChange={(e) => {
                    const newHours = [...sleepHours];
                    newHours[index] = Number(e.target.value) || 0;
                    setSleepHours(newHours);
                  }}
                  placeholder="Hours"
                  className="w-24"
                  min="0"
                  max="24"
                />
                <span className="text-muted-foreground">hours</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* General Feeling */}
        <Card>
          <CardHeader>
            <CardTitle>General Feeling</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={generalFeeling}
              onValueChange={(value: "Energized" | "Normal" | "Tired" | "Exhausted") => setGeneralFeeling(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your feeling" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Energized">Energized</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Tired">Tired</SelectItem>
                <SelectItem value="Exhausted">Exhausted</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Recovery Score */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Progress value={recoveryScore} className="w-full" />
              <span>{recoveryScore}/100</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your recovery score is {recoveryScore < 50 ? "low" : recoveryScore < 75 ? "moderate" : "good"}. Improve it by getting more sleep or adding rest days.
            </p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-sm">{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSaveRecoveryData} 
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Bed className="h-4 w-4 mr-2" />
              Save Recovery Data
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Recovery;
