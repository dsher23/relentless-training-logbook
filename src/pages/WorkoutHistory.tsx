import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
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
  
  useEffect(() => {
    if (!workouts || !Array.isArray(workouts)) {
      setCompletedWorkouts([]);
      return;
    }
    
    const strictCompletedWorkouts = workouts.filter(workout => workout.completed === true);
    
    const sortedWorkouts = [...strictCompletedWorkouts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
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
        </div>
      </Header>
      
      <div className="p-4">
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
