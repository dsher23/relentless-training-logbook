
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Create a simple Dashboard component with actual content
const Dashboard = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded-lg bg-card shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Recent Workouts</h2>
        <p className="text-sm text-muted-foreground">
          You have no recent workouts. Start training now!
        </p>
      </div>
      <div className="p-4 border rounded-lg bg-card shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Progress</h2>
        <p className="text-sm text-muted-foreground">
          Track your fitness journey and see your improvements.
        </p>
      </div>
    </div>
  </div>
);

// Create placeholder components for the main routes with minimal content
const Training = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Training</h1>
    <p>Start a new workout or continue with your training plan.</p>
  </div>
);

const WeeklyOverview = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Weekly Overview</h1>
    <p>View your weekly training schedule and progress.</p>
  </div>
);

const Supplements = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Supplements</h1>
    <p>Track your supplement intake and schedule.</p>
  </div>
);

const Recovery = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Recovery</h1>
    <p>Monitor your recovery metrics and rest periods.</p>
  </div>
);

const Profile = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Profile</h1>
    <p>View and edit your profile information.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Main routes */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="training" element={<Training />} />
        <Route path="weekly-overview" element={<WeeklyOverview />} />
        <Route path="supplements" element={<Supplements />} />
        <Route path="recovery" element={<Recovery />} />
        <Route path="profile" element={<Profile />} />
        
        {/* Catch all route to redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
