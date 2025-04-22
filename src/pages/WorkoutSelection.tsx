
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Repeat, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StartWorkoutButton from '@/components/StartWorkoutButton';

const WorkoutSelection: React.FC = () => {
  const { workoutTemplates } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="app-container animate-fade-in">
      <Header title="Select Workout" />
      
      <div className="p-4 space-y-4">
        <Link to="/workouts">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workouts
          </Button>
        </Link>

        <Card>
          <CardContent className="p-4">
            <Link to="/workouts/new">
              <Button className="w-full flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" /> Create New Workout
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <h2 className="font-semibold text-lg mt-6">Use Template</h2>
        
        {workoutTemplates.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No saved workouts found</AlertTitle>
            <AlertDescription>
              Please create a workout first before starting a session.
            </AlertDescription>
            <Button 
              className="mt-3" 
              onClick={() => navigate("/workouts/new")}
            >
              <Plus className="h-4 w-4 mr-2" /> Create Workout
            </Button>
          </Alert>
        ) : (
          <div className="space-y-3">
            {workoutTemplates.map(template => (
              <Card key={template.id} className="hover:border-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.exercises.length} exercises
                      </p>
                    </div>
                    <StartWorkoutButton 
                      workoutId={template.id} 
                      isTemplate={true} 
                    />
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

export default WorkoutSelection;
