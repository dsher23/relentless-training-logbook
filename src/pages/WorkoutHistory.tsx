
import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import WorkoutCard from '@/components/WorkoutCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const WorkoutHistory: React.FC = () => {
  const { workouts, deleteWorkout } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<any[]>([]);
  
  // Update completed workouts whenever workouts change
  useEffect(() => {
    // Strict check for completed === true
    const completed = workouts
      .filter(workout => workout.completed === true)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setCompletedWorkouts(completed);
    
    console.log('WorkoutHistory - Total workouts in context:', workouts.length);
    console.log('WorkoutHistory - Completed workouts found:', completed.length);
    console.log('WorkoutHistory - Completed workout IDs:', completed.map(w => w.id));
    console.log('WorkoutHistory - All workout completion statuses:', workouts.map(w => ({id: w.id, completed: w.completed})));
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
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
      
      <Dialog open={!!workoutToDelete} onOpenChange={(open) => !open && setWorkoutToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workout</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWorkoutToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWorkout}>
              Delete Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutHistory;
