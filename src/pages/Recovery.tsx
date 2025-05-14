
import React from 'react';

const Recovery = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Recovery</h1>
      <p className="text-muted-foreground mb-6">Track your recovery and body metrics</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-medium mb-2">Mood Tracking</h2>
          <p className="text-sm text-muted-foreground">Track your daily mood and energy levels</p>
        </div>
        
        <div className="bg-card rounded-lg p-4 border">
          <h2 className="text-lg font-medium mb-2">Body Measurements</h2>
          <p className="text-sm text-muted-foreground">Track your body measurements over time</p>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
