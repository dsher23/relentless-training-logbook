
import React from 'react';

const Training = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Training</h1>
      <p className="text-muted-foreground mb-6">Manage your workouts and training plans</p>
      
      <div className="space-y-4">
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-medium mb-2">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <button className="bg-primary text-white px-4 py-2 rounded-md">Start Workout</button>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md">Create Template</button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-medium mb-2">Workout Templates</h2>
          <p className="text-sm text-muted-foreground">No templates found. Create a template to get started.</p>
        </div>
      </div>
    </div>
  );
};

export default Training;
