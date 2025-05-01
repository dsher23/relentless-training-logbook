import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import NavigationHeader from '@/components/NavigationHeader';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CorePRTracker from '@/components/CorePRTracker';

interface GroupedWorkout {
  name: string;
  instances: any[];
}

const WorkoutHistory: React.FC = () => {
  const { workouts, deleteWorkout } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<any[]>([]);
  const [groupedWorkouts, setGroupedWorkouts] = useState<GroupedWorkout[]>([]);
  
  useEffect(() => {
    if (!workouts || !Array.isArray(workouts)) {
      setCompletedWorkouts([]);
      return;
    }
    
    // Strictly filter for completed workouts
    const actuallyCompletedWorkouts = workouts.filter(workout => workout.completed === true);
    console.log("Filtered completed workouts count:", actuallyCompletedWorkouts.length);
    
    // Sort by date (newest first)
    const sortedWorkouts = [...actuallyCompletedWorkouts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setCompletedWorkouts(sortedWorkouts);
    
    // Group workouts by name
    const grouped = sortedWorkouts.reduce((acc: GroupedWorkout[], workout) => {
      const existingGroup = acc.find(group => group.name === workout.name);
      if (existingGroup) {
        existingGroup.instances.push(workout);
      } else {
        acc.push({ name: workout.name, instances: [workout] });
      }
      return acc;
    }, []);
    
    setGroupedWorkouts(grouped);
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
  
  const handleEditWorkout = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/workouts/${id}`);
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className="app-container animate-fade-in pb-16">
      <NavigationHeader title="Workout History" showBack={true} showHome={true} showProfile={false} />
      
      <div className="px-4 pt-4">
        <CorePRTracker />

        {groupedWorkouts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                No completed workouts logged yet. Start and complete a workout from the Dashboard.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate('/training')}
              >
                Start a Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {groupedWorkouts.map((group) => (
              <AccordionItem key={group.name} value={group.name} className="bg-card border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {group.instances.length} workout{group.instances.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  {group.instances.map((workout) => (
                    <div key={workout.id} className="border-t">
                      <div className="px-4 py-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{formatDate(workout.date)}</h4>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleEditWorkout(workout.id, e)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => confirmDelete(workout.id, e)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                        
                        {/* Exercises Table */}
                        {workout.exercises && workout.exercises.length > 0 ? (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Exercise</TableHead>
                                  <TableHead className="text-right">Sets</TableHead>
                                  <TableHead className="text-right">Weight</TableHead>
                                  <TableHead className="text-right">Reps</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {workout.exercises.map((exercise: any) => (
                                  <TableRow key={exercise.id}>
                                    <TableCell className="font-medium">{exercise.name}</TableCell>
                                    <TableCell className="text-right">{exercise.sets?.length || 0}</TableCell>
                                    <TableCell className="text-right">
                                      {exercise.sets && exercise.sets.length > 0 && 
                                        `${Math.max(...exercise.sets.map((set: any) => set.weight || 0))} kg`
                                      }
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {exercise.sets && exercise.sets.length > 0 &&
                                        exercise.sets.map((set: any, idx: number) => (
                                          <Badge key={idx} variant="outline" className="mx-0.5">
                                            {set.reps}
                                          </Badge>
                                        ))
                                      }
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No exercises recorded</p>
                        )}
                        
                        {workout.notes && (
                          <div className="mt-3 text-sm">
                            <p className="text-muted-foreground">Notes:</p>
                            <p>{workout.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
