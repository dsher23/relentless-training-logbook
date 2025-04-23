
import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { startOfWeek, addWeeks, format, isWithinInterval, subWeeks } from "date-fns";
import { Workout, Exercise } from "@/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, ChartBar, ChartLine, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LiftProgressData {
  weekLabel: string;
  weekStart: Date;
  weekEnd: Date;
  averageWeight: number;
  totalVolume: number;
  workoutCount: number;
  exercises: number;
  categories: Record<string, { count: number, volume: number, average: number }>;
}

const EXERCISE_CATEGORIES = {
  "Push": ["Bench Press", "Shoulder Press", "Tricep Extension", "Chest Fly", "Push-up"],
  "Pull": ["Deadlift", "Pull-up", "Lat Pulldown", "Row", "Bicep Curl"],
  "Legs": ["Squat", "Leg Press", "Leg Extension", "Leg Curl", "Lunge", "Calf Raise"],
  "Core": ["Plank", "Crunch", "Russian Twist", "Leg Raise", "Ab Rollout"]
};

const LiftProgressGraph: React.FC = () => {
  const { workouts } = useAppContext();
  const [weekOffset, setWeekOffset] = useState(0);
  const [displayMode, setDisplayMode] = useState<"volume" | "weight">("volume");
  const [filter, setFilter] = useState<string>("all");
  const [numWeeks, setNumWeeks] = useState<number>(8);
  
  // Get only completed workouts
  const completedWorkouts = workouts.filter(workout => workout.completed === true);
  
  const getExerciseCategory = (exerciseName: string): string => {
    for (const [category, exercises] of Object.entries(EXERCISE_CATEGORIES)) {
      if (exercises.some(e => exerciseName.toLowerCase().includes(e.toLowerCase()))) {
        return category;
      }
    }
    return "Other";
  };
  
  const calculateProgressData = useMemo(() => {
    if (!completedWorkouts.length) return [];
    
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    
    // Sort workouts by date
    const sortedWorkouts = [...completedWorkouts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Determine earliest week
    const earliestWorkout = sortedWorkouts[0];
    const earliestDate = new Date(earliestWorkout?.date || today);
    const earliestWeekStart = startOfWeek(earliestDate, { weekStartsOn: 1 });
    
    // Calculate number of weeks between earliest and current
    const totalWeeks = Math.max(
      Math.ceil((currentWeekStart.getTime() - earliestWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)),
      numWeeks
    );
    
    // Generate data for each week
    const progressData: LiftProgressData[] = [];
    
    for (let i = 0; i < totalWeeks; i++) {
      const weekStart = subWeeks(currentWeekStart, i);
      const weekEnd = addWeeks(weekStart, 1);
      
      // Filter workouts in this week
      const weekWorkouts = completedWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return isWithinInterval(workoutDate, { start: weekStart, end: weekEnd });
      });
      
      // Calculate metrics
      let totalWeight = 0;
      let totalExercises = 0;
      let totalSets = 0;
      let totalVolume = 0;
      
      // Track categories
      const categories: Record<string, { count: number, volume: number, average: number }> = {
        "Push": { count: 0, volume: 0, average: 0 },
        "Pull": { count: 0, volume: 0, average: 0 },
        "Legs": { count: 0, volume: 0, average: 0 },
        "Core": { count: 0, volume: 0, average: 0 },
        "Other": { count: 0, volume: 0, average: 0 }
      };
      
      weekWorkouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          const category = getExerciseCategory(exercise.name);
          
          exercise.sets.forEach(set => {
            if (set.weight && set.reps) {
              const volume = set.weight * set.reps;
              totalWeight += set.weight;
              totalVolume += volume;
              totalSets++;
              
              // Update category data
              categories[category].count++;
              categories[category].volume += volume;
              categories[category].average += set.weight;
            }
          });
          
          totalExercises++;
        });
      });
      
      // Calculate averages for categories
      Object.keys(categories).forEach(category => {
        if (categories[category].count > 0) {
          categories[category].average = categories[category].average / categories[category].count;
        }
      });
      
      const weekLabel = `Week ${totalWeeks - i}`;
      
      progressData.push({
        weekLabel,
        weekStart,
        weekEnd,
        averageWeight: totalSets > 0 ? totalWeight / totalSets : 0,
        totalVolume,
        workoutCount: weekWorkouts.length,
        exercises: totalExercises,
        categories
      });
    }
    
    return progressData.reverse();
  }, [completedWorkouts, numWeeks]);
  
  const displayData = useMemo(() => {
    if (!calculateProgressData.length) return [];
    
    return calculateProgressData.map(week => {
      const displayValue = displayMode === "volume" 
        ? (filter === "all" ? week.totalVolume : week.categories[filter]?.volume || 0)
        : (filter === "all" ? week.averageWeight : week.categories[filter]?.average || 0);
      
      return {
        name: week.weekLabel,
        value: displayValue,
        workouts: week.workoutCount,
        exercises: filter === "all" ? week.exercises : week.categories[filter]?.count || 0,
        valueLabel: displayMode === "volume" ? "Volume" : "Avg Weight"
      };
    });
  }, [calculateProgressData, displayMode, filter]);
  
  const nextWeek = () => {
    if (weekOffset < calculateProgressData.length - numWeeks) {
      setWeekOffset(prev => prev + 1);
    }
  };
  
  const previousWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset(prev => prev - 1);
    }
  };
  
  const visibleData = displayData.slice(
    Math.max(0, displayData.length - numWeeks - weekOffset),
    displayData.length - weekOffset
  );
  
  // Calculate growth trends
  const trendData = useMemo(() => {
    if (visibleData.length < 2) return { trend: 0, percentage: 0 };
    
    const firstValue = visibleData[0].value || 0;
    const lastValue = visibleData[visibleData.length - 1].value || 0;
    
    if (firstValue === 0) return { trend: 0, percentage: 0 };
    
    const change = lastValue - firstValue;
    const percentage = (change / firstValue) * 100;
    
    return {
      trend: change > 0 ? 1 : change < 0 ? -1 : 0,
      percentage: Math.abs(percentage)
    };
  }, [visibleData]);
  
  if (completedWorkouts.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            No completed workouts yet. Complete a workout to see your lift progress here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Lift Progress</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs 
              value={displayMode} 
              onValueChange={(v) => setDisplayMode(v as "volume" | "weight")}
              className="h-8"
            >
              <TabsList className="h-8">
                <TabsTrigger value="volume" className="text-xs h-7 px-2">
                  <ChartBar className="h-3 w-3 mr-1" /> Volume
                </TabsTrigger>
                <TabsTrigger value="weight" className="text-xs h-7 px-2">
                  <ChartLine className="h-3 w-3 mr-1" /> Avg Weight
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[110px] h-8">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exercises</SelectItem>
                <SelectItem value="Push">Push</SelectItem>
                <SelectItem value="Pull">Pull</SelectItem>
                <SelectItem value="Legs">Legs</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        {trendData.trend !== 0 && displayData.length > 1 && (
          <div className="mb-2 flex justify-end">
            <Badge variant={trendData.trend > 0 ? "success" : "destructive"} className="text-xs">
              {trendData.trend > 0 ? "+" : "-"}{trendData.percentage.toFixed(1)}% from start
            </Badge>
          </div>
        )}
        
        <div className="h-64">
          <ChartContainer
            className="mb-4"
            config={{
              progress: { label: "Progress" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visibleData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <div className="grid gap-1">
                            <div className="font-medium">{data.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {data.valueLabel}: <span className="font-medium text-foreground">
                                {displayMode === "volume" 
                                  ? data.value.toLocaleString() 
                                  : parseFloat(data.value.toFixed(1))} 
                                {displayMode === "volume" ? "kg (total)" : "kg"}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {data.workouts} workout{data.workouts !== 1 ? 's' : ''}, {data.exercises} exercise{data.exercises !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {displayData.length > numWeeks && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousWeek}
              disabled={weekOffset === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous weeks</span>
            </Button>
            <span className="text-xs text-muted-foreground">
              {weekOffset === 0 ? "Latest data" : `${weekOffset} ${weekOffset === 1 ? 'week' : 'weeks'} ago`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextWeek}
              disabled={weekOffset >= calculateProgressData.length - numWeeks}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next weeks</span>
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            {displayMode === "volume" 
              ? "Total volume = weight × reps across all sets" 
              : "Average weight lifted per set"}
            {filter !== "all" && ` for ${filter} exercises`}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiftProgressGraph;
