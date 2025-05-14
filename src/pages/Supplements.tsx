
import React from 'react';

const Supplements = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Supplements</h1>
      <p className="text-muted-foreground mb-6">Track your supplements and nutrition</p>
      
      <div className="bg-card rounded-lg p-4 border mb-4">
        <h2 className="text-lg font-medium mb-2">Current Supplements</h2>
        <p className="text-sm text-muted-foreground">No supplements found. Add a supplement to get started.</p>
        <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md">Add Supplement</button>
      </div>
    </div>
  );
};

export default Supplements;
