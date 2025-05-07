
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Create a simple HomePage component
const HomePage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to IronLog</h1>
      <p className="mb-4">
        Track your workouts, monitor your progress, and achieve your fitness goals.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-card hover:bg-card/90 transition-colors cursor-pointer">
          <h2 className="text-lg font-semibold mb-2">Start Training</h2>
          <p className="text-sm text-muted-foreground">
            Begin your workout session or create a new training plan.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-card hover:bg-card/90 transition-colors cursor-pointer">
          <h2 className="text-lg font-semibold mb-2">View Progress</h2>
          <p className="text-sm text-muted-foreground">
            Check your workout history and track your improvements.
          </p>
        </div>
      </div>
    </div>
  );
};

// Create placeholder components for the main routes to avoid 404 errors
const Dashboard = () => <div className="p-4">Dashboard Page</div>;
const Training = () => <div className="p-4">Training Page</div>;
const WeeklyOverview = () => <div className="p-4">Weekly Overview Page</div>;
const Supplements = () => <div className="p-4">Supplements Page</div>;
const Recovery = () => <div className="p-4">Recovery Page</div>;
const Profile = () => <div className="p-4">Profile Page</div>;

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
