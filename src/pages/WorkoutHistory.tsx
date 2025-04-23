
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
  const [debugMode, setDebugMode] = useState<boolean>(true); // Keep debug mode on for troubleshooting
  
  useEffect(() => {
    // Enhanced debugging logs with more details
    console.log('WorkoutHistory - All workouts:', workouts);
    console.log('WorkoutHistory - Total workouts in context:', workouts.length);
    
    // Log every workout with its completed status
    workouts.forEach((workout, index) => {
      console.log(`Workout ${index}: id=${workout.id?.substring(0, 8)}, name=${workout.name}, completed=${workout.completed} (type: ${typeof workout.completed}), JSON=${JSON.stringify(workout)}`);
    });
    
    // Try multiple approaches to identify completed workouts - CRITICAL DEBUG
    const strictTrueWorkouts = workouts.filter(w => w.completed === true);
    const looseCompletedWorkouts = workouts.filter(w => w.completed);
    const allWorkouts = [...workouts]; // Create a copy to avoid mutation
    
    console.log('CRITICAL DEBUG - Strict true workouts count:', strictTrueWorkouts.length);
    console.log('CRITICAL DEBUG - Loose completed workouts count:', looseCompletedWorkouts.length);
    console.log('CRITICAL DEBUG - First 3 strict completed workouts:', strictTrueWorkouts.slice(0, 3));
    
    // CRITICAL FIX: Instead of relying on filtering, let's manually inspect each workout
    const manuallyIdentifiedCompleted = [];
    
    for (const workout of allWorkouts) {
      // Convert whatever the completed value is to a strict boolean
      const isActuallyCompleted = Boolean(workout.completed);
      
      // Log detailed inspection
      console.log(`Manual check - Workout ${workout.id?.substring(0, 8)} - Raw completed value:`, workout.completed);
      console.log(`Manual check - Workout ${workout.id?.substring(0, 8)} - Converted to boolean:`, isActuallyCompleted);
      
      // If it should be considered completed after our check, add it
      if (isActuallyCompleted) {
        // Create a clean copy with completed explicitly set to true
        manuallyIdentifiedCompleted.push({
          ...workout,
          completed: true // Force it to be true for our display
        });
      }
    }
    
    // Log the results of our manual identification
    console.log('CRITICAL DEBUG - Manually identified completed workouts:', manuallyIdentifiedCompleted.length);
    
    // Sort all workouts (both manually identified and strict true) by date, newest first
    const sortedCompleted = [...manuallyIdentifiedCompleted, ...strictTrueWorkouts]
      // Remove duplicates based on ID
      .filter((workout, index, self) => 
        index === self.findIndex(w => w.id === workout.id)
      )
      // Sort by date, newest first  
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log('WorkoutHistory - Final sorted completed workouts:', sortedCompleted.length);
    
    // Set the state with our manually verified completed workouts
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

  // Added debugging function to help diagnose the issue
  const forceCompletedWorkout = () => {
    if (workouts.length > 0) {
      const firstWorkout = workouts[0];
      
      // Force add a completed workout to our local state for testing
      setCompletedWorkouts(prev => [
        {
          ...firstWorkout,
          id: firstWorkout.id + "-test", // Ensure unique ID
          name: `${firstWorkout.name} (TEST)`,
          completed: true // EXPLICITLY set to true
        },
        ...prev
      ]);
      
      toast({
        title: "Test workout created",
        description: "A test completed workout has been added to the view (not saved to storage)"
      });
    }
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
              <h3 className="font-bold mb-1">Critical Debug Info:</h3>
              <p>Total workouts: {workouts.length}</p>
              <p>Strict TRUE completed: {workouts.filter(w => w.completed === true).length}</p>
              <p>Boolean completed: {workouts.filter(w => Boolean(w.completed)).length}</p>
              <p>Displayed completed: {completedWorkouts.length}</p>
              
              <div className="mt-3 p-2 border border-yellow-400 rounded">
                <p className="font-bold text-amber-700">WORKOUT DISPLAY DEBUG:</p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                    onClick={forceCompletedWorkout}
                  >
                    Test: Add Completed Workout
                  </Button>
                </div>
                
                <div className="mt-3">
                  <p className="font-bold">Displayed Workout IDs:</p>
                  <ul className="list-disc pl-5 mt-1">
                    {completedWorkouts.slice(0, 5).map(w => (
                      <li key={w.id} className="text-green-600">
                        {w.id.substring(0, 8)}... - {w.name} - completed:{" "}
                        <span className="font-bold">{String(w.completed)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <p className="font-bold mt-3">All Workouts (raw):</p>
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
