
import React from 'react';

const WeeklyOverview = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Weekly Overview</h1>
      <p className="text-muted-foreground mb-6">View your weekly training plan and progress</p>
      
      <div className="bg-card rounded-lg p-4 border mb-4">
        <h2 className="text-lg font-medium mb-2">Weekly Routine</h2>
        <p className="text-sm text-muted-foreground">No weekly routine found. Create a routine to get started.</p>
      </div>
    </div>
  );
};

export default WeeklyOverview;
