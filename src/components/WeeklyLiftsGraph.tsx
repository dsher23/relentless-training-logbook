
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
  
  // Make sure weeklyTotal and lastWeekTotal are numbers for comparison
  const percentageChange = lastWeekTotal > 0 ? 
    ((weeklyTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(1) : "0";
  
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
      <div className="glass-effect p-3 rounded-lg shadow-xl">
        <p className="font-heading text-sm">{data.name}</p>
        <p className="text-sm text-gym-text-secondary">Volume: {data.volume.toLocaleString()}kg</p>
        <p className="text-sm text-gym-text-secondary">Exercises: {data.exercises}</p>
        {data.prs > 0 && (
          <p className="text-sm text-gym-success">PRs: {data.prs}</p>
        )}
      </div>
    );
  };

  // Define color mapping for bars with gradients
  const getBarColor = (entry: DayData) => {
    switch (entry.change) {
      case "increase": return "url(#greenGradient)";
      case "decrease": return "url(#redGradient)";
      default: return "url(#yellowGradient)";
    }
  };
  
  return (
    <Card className="card-highlighted">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-heading">Weekly Progress</CardTitle>
          {streak >= 2 && (
            <div className="text-sm bg-gym-blue/10 text-gym-blue px-3 py-1.5 rounded-full font-medium">
              🔥 {streak}-Day Streak
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 animate-graph-in">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="#B0B0B0" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="#B0B0B0"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              />
              <Bar 
                dataKey="volume" 
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry)}
                    className="transition-opacity duration-200 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gym-text-secondary">
            You lifted {weeklyTotal.toLocaleString()}kg across {workoutCount} workouts this week.
            {Number(lastWeekTotal) > 0 && (
              <span>
                {" "}That's{" "}
                <span className={Number(percentageChange) > 0 ? "text-gym-success" : "text-gym-error"}>
                  {Number(percentageChange) > 0 ? "+" : ""}{percentageChange}%
                </span>{" "}
                vs last week!
              </span>
            )}
          </p>
          <p className="text-sm font-medium text-gym-blue">
            {getMotivationalMessage()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyLiftsGraph;
