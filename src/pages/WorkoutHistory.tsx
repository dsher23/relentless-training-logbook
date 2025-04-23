
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
  const [debugMode, setDebugMode] = useState<boolean>(true); // Keep debug mode on to diagnose
  
  useEffect(() => {
    // Safety check for workouts array
    if (!workouts || !Array.isArray(workouts)) {
      console.error("CRITICAL - WorkoutHistory - workouts is not an array:", workouts);
      setCompletedWorkouts([]);
      return;
    }
    
    console.log("CRITICAL - WorkoutHistory - All workouts:", workouts.length);
    
    // Use strict === true comparison for completed workouts
    const strictCompletedWorkouts = workouts.filter(workout => workout.completed === true);
    console.log("CRITICAL - WorkoutHistory - Strict completed workouts:", strictCompletedWorkouts.length);
    
    // Log info about ALL workouts to diagnose
    console.log("CRITICAL - All workouts completion status:");
    workouts.slice(0, 10).forEach((workout, index) => {
      console.log(`Workout ${index}: id=${workout.id?.substring(0, 8)}, name=${workout.name}, completed=${workout.completed} (${typeof workout.completed})`);
    });
    
    // Sort completed workouts by date, newest first
    const sortedWorkouts = [...strictCompletedWorkouts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log("CRITICAL - WorkoutHistory - Final sorted completed workouts:", sortedWorkouts.length);
    console.log("CRITICAL - First few completed workouts:", sortedWorkouts.slice(0, 3));
    
    // Set the state with properly filtered and sorted completed workouts
    setCompletedWorkouts(sortedWorkouts);
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
              <p>Total workouts: {workouts?.length || 0}</p>
              <p>TRUE completed workouts: {workouts?.filter(w => w.completed === true)?.length || 0}</p>
              <p>Boolean completed: {workouts?.filter(w => Boolean(w.completed))?.length || 0}</p>
              <p>Displayed completed: {completedWorkouts?.length || 0}</p>
              
              <div className="mt-3">
                <p className="font-bold">First 5 displayed workouts:</p>
                <ul className="list-disc pl-5 mt-1">
                  {completedWorkouts?.slice(0, 5)?.map(w => (
                    <li key={w.id} className="text-green-600">
                      {w.id?.substring(0, 8)}... - {w.name} - completed:{" "}
                      <span className="font-bold">{String(w.completed)}</span>
                    </li>
                  )) || <li>No completed workouts</li>}
                </ul>
              </div>
              
              <p className="font-bold mt-3">All Workouts (raw):</p>
              <ul className="list-disc pl-5">
                {workouts?.slice(0, 10)?.map(w => (
                  <li key={w.id}>
                    {w.id?.substring(0, 8)}... - {w.name} - 
                    completed: <span className={w.completed === true ? "text-green-600 font-bold" : "text-red-600"}>
                      {String(w.completed)} ({typeof w.completed})
                    </span>
                  </li>
                )) || <li>No workouts</li>}
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
