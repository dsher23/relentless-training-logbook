
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutDetail from './pages/WorkoutDetail';
import LiveWorkout from './pages/LiveWorkout';
import WorkoutHistory from './pages/WorkoutHistory';
import Plans from './pages/Plans';
import Routines from './pages/Routines';
import WorkoutSelection from './pages/WorkoutSelection';
import WorkoutBuilder from './pages/WorkoutBuilder';
import PlanDetail from './pages/PlanDetail';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Workout routes */}
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/new" element={<CreateWorkout />} />
          <Route path="/workouts/builder" element={<WorkoutBuilder />} />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
          <Route path="/workouts/builder/:id" element={<WorkoutBuilder />} />
          <Route path="/live-workout/:id" element={<LiveWorkout />} />
          <Route path="/workout-history" element={<WorkoutHistory />} />

          {/* Plan routes */}
          <Route path="/plans" element={<Plans />} />
          <Route path="/plans/:id" element={<PlanDetail />} />

          {/* Routine routes */}
          <Route path="/routines" element={<Routines />} />
          <Route path="/routines/:id" element={<Routines />} />

          {/* Workout Selection route */}
          <Route path="/workout-selection" element={<WorkoutSelection />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
