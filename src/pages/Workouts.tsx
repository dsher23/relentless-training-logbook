
import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Dumbbell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import WorkoutCard from "@/components/WorkoutCard";
import { useAppContext } from "@/context/AppContext";

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { workouts } = useAppContext();
  
  // Group workouts by completion status and sort by date
  const upcomingWorkouts = workouts
    .filter(w => !w.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const completedWorkouts = workouts
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="app-container animate-fade-in">
      <Header title="Workouts" />
      
      <div className="px-4 mb-6">
        <Button
          className="w-full bg-gym-purple text-white hover:bg-gym-darkPurple"
          onClick={() => navigate("/workouts/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Workout
        </Button>
      </div>
      
      {workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Dumbbell className="h-12 w-12 text-gym-purple mb-4" />
          <h2 className="text-xl font-bold mb-2">No Workouts Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start tracking your gym progress by creating your first workout.
          </p>
        </div>
      ) : (
        <>
          {upcomingWorkouts.length > 0 && (
            <section className="mb-8 px-4">
              <h2 className="text-lg font-semibold mb-4">Upcoming Workouts</h2>
              {upcomingWorkouts.map(workout => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout}
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                />
              ))}
            </section>
          )}
          
          {completedWorkouts.length > 0 && (
            <section className="px-4">
              <h2 className="text-lg font-semibold mb-4">Completed Workouts</h2>
              {completedWorkouts.map(workout => (
                <WorkoutCard 
                  key={workout.id} 
                  workout={workout}
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Workouts;
