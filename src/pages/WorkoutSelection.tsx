
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';

const WorkoutSelection: React.FC = () => {
  const { workoutTemplates } = useAppContext();

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
        <div className="space-y-3">
          {workoutTemplates.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No workout templates available
                </p>
                <Link to="/routines">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Create Template
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            workoutTemplates.map(template => (
              <Card key={template.id} className="hover:border-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.exercises.length} exercises
                      </p>
                    </div>
                    <Link to={`/live-workout/${template.id}`} state={{ isTemplate: true }}>
                      <Button size="sm">
                        <Repeat className="h-4 w-4 mr-1" /> Start
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutSelection;
