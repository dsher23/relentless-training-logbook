
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Bug } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import WorkoutCard from '@/components/WorkoutCard';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useToast } from '@/hooks/use-toast';

const WorkoutHistory: React.FC = () => {
  const { workouts, deleteWorkout } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<any[]>([]);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  
  useEffect(() => {
    // Log all workouts for debugging
    console.log('WorkoutHistory - All workouts:', workouts);
    console.log('WorkoutHistory - Total workouts in context:', workouts.length);
    
    // Log detailed information about each workout for debugging
    workouts.forEach(workout => {
      console.log(`Workout ${workout.id}: name=${workout.name}, completed=${workout.completed}, type=${typeof workout.completed}`);
    });
    
    // CRITICAL FIX: Use strict boolean comparison for completed workouts
    const strictCompleted = workouts.filter(w => w.completed === true);
    
    console.log('WorkoutHistory - Strictly completed workouts:', strictCompleted);
    console.log('WorkoutHistory - Completed count:', strictCompleted.length);
    console.log('WorkoutHistory - Completed workout IDs:', strictCompleted.map(w => w.id));
    
    // Sort completed workouts by date, newest first
    const sortedCompleted = strictCompleted.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    console.log('WorkoutHistory - Sorted completed workouts found:', sortedCompleted.length);
    if (sortedCompleted.length > 0) {
      console.log('WorkoutHistory - First completed workout:', sortedCompleted[0]);
    }
    
    // Set the completed workouts state
    setCompletedWorkouts(sortedCompleted);
  }, [workouts]);

  const handleDeleteWorkout = () => {
    if (!workoutToDelete) return;
    
    deleteWorkout(workoutToDelete);
    toast({
      title: "Workout deleted",
      description: "The workout has been removed from your history."
    });
    setWorkoutToDelete(null);
  };

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setWorkoutToDelete(id);
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <div className="app-container animate-fade-in">
      <Header title="Workout History">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDebugMode}
            title="Debug Mode"
          >
            <Bug className="h-4 w-4" />
          </Button>
        </div>
      </Header>
      
      <div className="p-4">
        {debugMode && (
          <Card className="mb-4 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4 text-xs">
              <h3 className="font-bold mb-1">Debug Info:</h3>
              <p>Total workouts: {workouts.length}</p>
              <p>Completed workouts: {completedWorkouts.length}</p>
              <p className="font-bold mt-2">All Workouts:</p>
              <ul className="list-disc pl-5">
                {workouts.slice(0, 10).map(w => (
                  <li key={w.id}>
                    {w.id.substring(0, 8)}... - {w.name} - 
                    completed: <span className={w.completed === true ? "text-green-600 font-bold" : "text-red-600"}>
                      {String(w.completed)} ({typeof w.completed})
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {completedWorkouts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                No completed workouts logged yet. Start and complete a workout from the Dashboard.
              </p>
              <Button 
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/training')}
              >
                Start a Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {completedWorkouts.map(workout => (
              <div key={workout.id} className="relative">
                <WorkoutCard 
                  workout={workout}
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                  actionButton={
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => confirmDelete(workout.id, e)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <DeleteConfirmDialog 
        open={!!workoutToDelete}
        onOpenChange={(open) => !open && setWorkoutToDelete(null)}
        onConfirm={handleDeleteWorkout}
        onCancel={() => setWorkoutToDelete(null)}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        confirmLabel="Delete Workout"
        cancelLabel="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default WorkoutHistory;
