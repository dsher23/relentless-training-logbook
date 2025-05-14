
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';

const LiveWorkout = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        
        <h1 className="text-xl font-bold">Live Workout</h1>
        
        <Button className="flex items-center gap-2">
          <Save size={16} />
          Save
        </Button>
      </div>
      
      <div className="bg-card rounded-lg p-4 border mb-4">
        <h2 className="text-lg font-medium mb-2">Current Workout</h2>
        <p className="text-muted-foreground">No exercises added yet. Add an exercise to get started.</p>
        <Button className="mt-4 w-full">Add Exercise</Button>
      </div>
    </div>
  );
};

export default LiveWorkout;
