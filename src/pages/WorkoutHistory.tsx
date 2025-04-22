
import React from 'react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';

const WorkoutHistory: React.FC = () => {
  const { workouts } = useAppContext();
  
  // Get completed workouts and sort by date (newest first)
  const completedWorkouts = workouts
    .filter(workout => workout.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="app-container animate-fade-in">
      <Header title="Workout History" />
      
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
              <Card key={workout.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{workout.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(workout.date), 'PPP')} • 
                        {workout.exercises.length} exercises
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Completed
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
