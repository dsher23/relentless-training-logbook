
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { startOfWeek, endOfWeek, format, isSameWeek, addWeeks, subWeeks } from "date-fns";

interface DayData {
  name: string;
  volume: number;
  exercises: number;
  prs: number;
  change: "increase" | "decrease" | "same";
}

const WeeklyLiftsGraph: React.FC<{ currentDate: Date }> = ({ currentDate }) => {
  const { workouts } = useAppContext();
  
  const calculateDailyData = (date: Date): DayData[] => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    const lastWeekStart = subWeeks(weekStart, 1);
    
    const dailyData: DayData[] = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    for (let i = 0; i < 7; i++) {
      const currentWorkouts = workouts.filter(w => 
        isSameWeek(new Date(w.date), date, { weekStartsOn: 1 }) && 
        new Date(w.date).getDay() === (i + 1) % 7
      );
      
      const lastWeekWorkouts = workouts.filter(w => 
        isSameWeek(new Date(w.date), lastWeekStart, { weekStartsOn: 1 }) && 
        new Date(w.date).getDay() === (i + 1) % 7
      );
      
      const todayVolume = currentWorkouts.reduce((total, workout) => 
        total + workout.exercises.reduce((exTotal, ex) => 
          exTotal + ex.sets.reduce((setTotal, set) => 
            setTotal + (set.reps * set.weight), 0), 0), 0);
      
      const lastWeekVolume = lastWeekWorkouts.reduce((total, workout) => 
        total + workout.exercises.reduce((exTotal, ex) => 
          exTotal + ex.sets.reduce((setTotal, set) => 
            setTotal + (set.reps * set.weight), 0), 0), 0);
      
      let change: "increase" | "decrease" | "same" = "same";
      if (todayVolume > lastWeekVolume) change = "increase";
      else if (todayVolume < lastWeekVolume) change = "decrease";
      
      dailyData.push({
        name: dayNames[i],
        volume: todayVolume,
        exercises: currentWorkouts.reduce((total, w) => total + w.exercises.length, 0),
        prs: currentWorkouts.reduce((total, w) => 
          total + w.exercises.filter(e => e.isWeakPoint).length, 0),
        change
      });
    }
    
    return dailyData;
  };
  
  const data = calculateDailyData(currentDate);
  const weeklyTotal = data.reduce((total, day) => total + day.volume, 0);
  const lastWeekTotal = calculateDailyData(subWeeks(currentDate, 1))
    .reduce((total, day) => total + day.volume, 0);
  const workoutCount = data.filter(d => d.volume > 0).length;
  const percentageChange = lastWeekTotal ? 
    ((weeklyTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(1) : 0;
  
  // Get workout streak
  const streak = workouts
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .reduce((count, workout) => {
      if (count === 0 || isSameWeek(new Date(workout.date), currentDate)) {
        return count + 1;
      }
      return count;
    }, 0);
  
  const getMotivationalMessage = () => {
    if (streak >= 4) return "🔥 Beast mode stays ON!";
    if (streak >= 2) return "🧱 Brick by brick, keep stacking.";
    return "💪 Every rep counts!";
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    
    const data = payload[0].payload as DayData;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">Volume: {data.volume.toLocaleString()}kg</p>
        <p className="text-sm">Exercises: {data.exercises}</p>
        {data.prs > 0 && (
          <p className="text-sm text-green-500">PRs: {data.prs}</p>
        )}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Weekly Progress</CardTitle>
          {streak >= 2 && (
            <div className="text-sm bg-gym-purple/10 text-gym-purple px-2 py-1 rounded-full">
              🔥 {streak}-Day Streak
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="volume"
                fill={(entry: DayData) => {
                  switch (entry.change) {
                    case "increase": return "#22c55e";
                    case "decrease": return "#ef4444";
                    default: return "#eab308";
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            You lifted {weeklyTotal.toLocaleString()}kg across {workoutCount} workouts this week.
            {lastWeekTotal > 0 && (
              <span>
                {" "}That's{" "}
                <span className={percentageChange > 0 ? "text-green-500" : "text-red-500"}>
                  {percentageChange > 0 ? "+" : ""}{percentageChange}%
                </span>{" "}
                vs last week!
              </span>
            )}
          </p>
          <p className="text-sm font-medium text-gym-purple">
            {getMotivationalMessage()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyLiftsGraph;
