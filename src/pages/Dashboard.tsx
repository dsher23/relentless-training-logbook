
import React from 'react';
import { Card } from '@/components/ui/card';
import { useFirestore } from '@/context/FirestoreContext';

const Dashboard = () => {
  const { user } = useFirestore();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome to IronLog, {user?.displayName || 'User'}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-medium">Quick Stats</h2>
          <p className="text-sm text-muted-foreground">Your training overview will appear here</p>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-medium">Recent Workouts</h2>
          <p className="text-sm text-muted-foreground">Your recent workouts will appear here</p>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-medium">Progress</h2>
          <p className="text-sm text-muted-foreground">Your progress will appear here</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
