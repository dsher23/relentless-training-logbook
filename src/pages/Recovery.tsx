
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Clock, Bed, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useAppContext } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const FEELING_OPTIONS = ["Energized", "Normal", "Tired", "Exhausted"];

const Recovery: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    weeklyRecoveryData,
    updateWeeklyRecoveryData,
    getRestDaysForCurrentWeek,
    workouts = []
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [sleepHours, setSleepHours] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [feeling, setFeeling] = useState<string>("Normal");
  const [recoveryScore, setRecoveryScore] = useState<number>(0);
  const [restDays, setRestDays] = useState<number>(0);

  useEffect(() => {
    try {
      // Load data from context
      if (weeklyRecoveryData) {
        setSleepHours(weeklyRecoveryData.sleepHours || [0, 0, 0, 0, 0, 0, 0]);
        setFeeling(weeklyRecoveryData.feeling || "Normal");
        
        // Calculate rest days
        const calculatedRestDays = getRestDaysForCurrentWeek();
        setRestDays(calculatedRestDays);
        
        // Get recovery score from context or calculate it
        setRecoveryScore(weeklyRecoveryData.recoveryScore || 0);
      }
    } catch (error) {
      console.error("Error loading recovery data:", error);
      toast({
        title: "Error",
        description: "Failed to load recovery data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [weeklyRecoveryData, getRestDaysForCurrentWeek, toast]);

  const handleSleepChange = (index: number, value: string) => {
    const newValue = parseFloat(value) || 0;
    const newSleepHours = [...sleepHours];
    newSleepHours[index] = Math.min(Math.max(newValue, 0), 24); // Clamp between 0-24 hours
    setSleepHours(newSleepHours);
  };

  const handleSave = () => {
    try {
      // Update context
      updateWeeklyRecoveryData({
        sleepHours,
        feeling,
        weekStartDate: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Recovery data saved successfully.",
      });
    } catch (error) {
      console.error("Error saving recovery data:", error);
      toast({
        title: "Error",
        description: "Failed to save recovery data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getAverageSleep = () => {
    const totalSleep = sleepHours.reduce((a, b) => a + b, 0);
    return (totalSleep / sleepHours.length).toFixed(1);
  };

  const getTotalSleep = () => {
    return sleepHours.reduce((a, b) => a + b, 0).toFixed(1);
  };

  const getRecoveryRecommendations = () => {
    const avgSleep = parseFloat(getAverageSleep());
    
    if ((feeling === "Tired" || feeling === "Exhausted") && avgSleep < 7) {
      return `You seem ${feeling.toLowerCase()} and aren't getting enough sleep (average: ${avgSleep} hours). Aim for at least 7-8 hours per night to improve recovery.`;
    } else if ((feeling === "Tired" || feeling === "Exhausted") && avgSleep >= 7) {
      return `You're getting enough sleep, but still feeling ${feeling.toLowerCase()}. Consider reducing workout intensity or adding a rest day.`;
    } else if (feeling === "Normal" && avgSleep < 7) {
      return `You're feeling normal, but could improve recovery by getting more than your current ${avgSleep} hours of sleep per night.`;
    } else if (feeling === "Energized" && avgSleep >= 7) {
      return `Great job! You're feeling energized and getting plenty of sleep (${avgSleep} hours per night).`;
    } else {
      return `You're currently feeling ${feeling.toLowerCase()} with an average of ${avgSleep} hours of sleep per night.`;
    }
  };

  const getRestDaysRecommendation = () => {
    if (restDays >= 2) {
      return `You've taken ${restDays} rest days this week. Great job balancing training and recovery!`;
    } else if (restDays === 1) {
      return `You've taken ${restDays} rest day this week. Aim for at least 2 rest days per week to optimize recovery.`;
    } else {
      return `You haven't taken any rest days this week. Adding 1-2 rest days can significantly improve recovery and performance.`;
    }
  };

  const getRecoveryScoreColor = () => {
    if (recoveryScore >= 80) return "bg-green-500";
    if (recoveryScore >= 60) return "bg-lime-500";
    if (recoveryScore >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRecoveryScoreMessage = () => {
    if (recoveryScore >= 80) return "Excellent recovery! Keep up the good work.";
    if (recoveryScore >= 60) return "Good recovery. Minor improvements could help.";
    if (recoveryScore >= 40) return "Moderate recovery. Focus on sleep and rest days.";
    return "Poor recovery. Prioritize sleep and consider taking a break.";
  };

  if (isLoading) {
    return (
      <div className="app-container animate-fade-in">
        <Header title="Recovery">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Header>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container pb-16 animate-fade-in">
      <Header title="Recovery">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Header>

      <div className="p-4 space-y-4">
        {/* Recovery Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Recovery Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Your Recovery Score</span>
                <span className="text-lg font-bold">{recoveryScore}/100</span>
              </div>
              <Progress value={recoveryScore} className={getRecoveryScoreColor()} />
              <p className="text-sm text-muted-foreground mt-2">{getRecoveryScoreMessage()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Tracking Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Moon className="mr-2 h-5 w-5 text-primary" />
              Sleep Tracking
            </CardTitle>
            <CardDescription>Track your sleep for each day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {DAY_NAMES.map((day, index) => (
                  <div key={day} className="space-y-1">
                    <Label htmlFor={`sleep-${index}`}>{day}</Label>
                    <div className="flex items-center">
                      <Input
                        id={`sleep-${index}`}
                        type="number"
                        value={sleepHours[index] || ""}
                        onChange={(e) => handleSleepChange(index, e.target.value)}
                        min="0"
                        max="24"
                        step="0.5"
                        className="w-full"
                      />
                      <span className="ml-1 text-xs">hrs</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm pt-2">
                <div>
                  <span className="font-medium">Average:</span>{" "}
                  <span className="font-bold">{getAverageSleep()} hrs</span>
                </div>
                <div>
                  <span className="font-medium">Total:</span>{" "}
                  <span className="font-bold">{getTotalSleep()} hrs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Feeling Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Bed className="mr-2 h-5 w-5 text-primary" />
              General Feeling
            </CardTitle>
            <CardDescription>How do you feel this week?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={feeling} onValueChange={setFeeling} className="flex flex-wrap gap-2">
              {FEELING_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`feeling-${option}`} />
                  <Label htmlFor={`feeling-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Recovery Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Sleep Analysis</h4>
              <p className="text-sm text-muted-foreground">{getRecoveryRecommendations()}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Rest Days</h4>
              <p className="text-sm text-muted-foreground">{getRestDaysRecommendation()}</p>
            </div>

            <Button onClick={handleSave} className="w-full">Save Recovery Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recovery;
