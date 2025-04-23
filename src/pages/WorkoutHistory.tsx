
import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import WorkoutCard from '@/components/WorkoutCard';

const WorkoutHistory: React.FC = () => {
  const { workouts } = useAppContext();
  const navigate = useNavigate();
  
  // Get completed workouts and sort by date (newest first)
  const completedWorkouts = workouts
    .filter(workout => workout.completed === true) // Explicit equality check
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="app-container animate-fade-in">
      <Header title="Workout History">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Header>
      
      <div className="p-4">
        {completedWorkouts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No completed workouts yet. Complete a workout to see it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedWorkouts.map(workout => (
              <WorkoutCard 
                key={workout.id}
                workout={workout}
                onClick={() => navigate(`/workouts/${workout.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
