
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell, ArrowRight, Ruler, PillIcon, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import ProgressChart from "@/components/ProgressChart";
import WorkoutCard from "@/components/WorkoutCard";
import { useAppContext } from "@/context/AppContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workouts, bodyMeasurements, supplements, supplementLogs, moodLogs } = useAppContext();
  
  // Get most recent body measurements
  const sortedMeasurements = [...bodyMeasurements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latestMeasurement = sortedMeasurements[0];
  const previousMeasurement = sortedMeasurements[1];
  
  // Get upcoming or recent workouts
  const today = new Date();
  const upcomingWorkouts = workouts
    .filter(w => new Date(w.date) >= today && !w.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const recentCompletedWorkouts = workouts
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  // Create chart data
  const weightChartData = sortedMeasurements
    .slice(0, 10)
    .reverse()
    .map(m => ({
      date: format(new Date(m.date), "MM/dd"),
      value: m.weight || 0
    }));
  
  // Calculate supplement compliance
  const today24HoursAgo = new Date(today);
  today24HoursAgo.setDate(today24HoursAgo.getDate() - 1);
  
  const recentLogs = supplementLogs.filter(
    log => new Date(log.date) >= today24HoursAgo
  );
  
  const complianceRate = supplements.length > 0 
    ? Math.round((recentLogs.filter(l => l.taken).length / supplements.length) * 100)
    : 0;
  
  return (
    <div className="app-container animate-fade-in">
      <Header 
        title="Relentless" 
        subtitle={`${format(today, "EEEE, MMMM d")}`} 
      />
      
      <div className="grid grid-cols-2 gap-4 px-4 mb-6">
        {latestMeasurement && (
          <StatCard
            title="Current Weight"
            value={`${latestMeasurement.weight} lbs`}
            icon={<Ruler className="w-4 h-4" />}
            change={previousMeasurement && {
              value: `${Math.abs((latestMeasurement.weight || 0) - (previousMeasurement.weight || 0)).toFixed(1)} lbs`,
              positive: (latestMeasurement.weight || 0) <= (previousMeasurement.weight || 0)
            }}
            onClick={() => navigate("/measurements")}
          />
        )}
        
        <StatCard
          title="Supplement Compliance"
          value={`${complianceRate}%`}
          icon={<PillIcon className="w-4 h-4" />}
          onClick={() => navigate("/supplements")}
        />
      </div>
      
      {workouts.length > 0 && (
        <section className="mb-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gym-purple"
              onClick={() => navigate("/workouts")}
            >
              See all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {upcomingWorkouts.length > 0 ? (
            <>
              <h3 className="text-sm text-muted-foreground mb-2">Upcoming Workout</h3>
              <WorkoutCard 
                workout={upcomingWorkouts[0]} 
                onClick={() => navigate(`/workouts/${upcomingWorkouts[0].id}`)}
              />
            </>
          ) : recentCompletedWorkouts.length > 0 ? (
            <>
              <h3 className="text-sm text-muted-foreground mb-2">Recent Workouts</h3>
              {recentCompletedWorkouts.map(workout => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout}
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                />
              ))}
            </>
          ) : (
            <Card className="mb-4">
              <CardContent className="p-4 flex flex-col items-center justify-center h-32">
                <Dumbbell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-center text-muted-foreground">No workouts yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate("/workouts/new")}
                >
                  Add your first workout
                </Button>
              </CardContent>
            </Card>
          )}
          
          <Button
            className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple mt-4"
            onClick={() => navigate("/workouts/new")}
          >
            <Dumbbell className="mr-2 h-4 w-4" />
            Start New Workout
          </Button>
        </section>
      )}
      
      {latestMeasurement && weightChartData.length > 1 && (
        <section className="mb-8 px-4">
          <h2 className="text-lg font-semibold mb-4">Body Progress</h2>
          <ProgressChart 
            title="Weight Trend" 
            data={weightChartData} 
          />
        </section>
      )}
      
      <section className="mb-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recovery Log</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gym-purple"
            onClick={() => navigate("/recovery")}
          >
            See all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-secondary">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gym-purple" />
              <CardTitle className="text-base font-medium">Today's Check-in</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            {moodLogs.some(log => format(new Date(log.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) ? (
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">You've already logged your recovery data today.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/recovery")}
                >
                  View Log
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">Track your recovery status for better training insights.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/recovery")}
                >
                  Log Today's Recovery
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
