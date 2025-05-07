
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { FirestoreProvider } from './context/FirestoreContext';
import { Toaster } from './components/ui/toaster';

import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Training from './pages/Training';
import LiveWorkout from './pages/LiveWorkout';
import WorkoutHistory from './pages/WorkoutHistory';
import CreateWorkout from './pages/CreateWorkout';
import ProgressPhotos from './pages/ProgressPhotos';
import Settings from './pages/Settings';
import WeeklyOverview from './pages/WeeklyOverview';
import WorkoutTypeSelection from './pages/WorkoutTypeSelection';
import Recovery from './pages/Recovery';
import Supplements from './pages/Supplements';
import MoodLog from './pages/MoodLog';
import RequireAuth from './components/RequireAuth';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AppProvider>
      <FirestoreProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/training" element={<Training />} />
                <Route path="/workouts" element={<Training />} />
                <Route path="/live-workout/:id" element={<LiveWorkout />} />
                <Route path="/workout-history" element={<WorkoutHistory />} />
                <Route path="/create-workout" element={<CreateWorkout />} />
                <Route path="/progress-photos" element={<ProgressPhotos />} />
                <Route path="/weekly-overview" element={<WeeklyOverview />} />
                <Route path="/workout-selection" element={<WorkoutTypeSelection />} />
                <Route path="/recovery" element={<Recovery />} />
                <Route path="/supplements" element={<Supplements />} />
                <Route path="/mood-log" element={<MoodLog />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </FirestoreProvider>
    </AppProvider>
  );
}

export default App;
