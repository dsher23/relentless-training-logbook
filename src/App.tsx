
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';
import { Toaster } from '@/components/ui/toaster';
import TabNavigation from '@/components/TabNavigation';
import { AppProvider } from '@/context/AppContext';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Workouts from '@/pages/Workouts';
import WorkoutTypeSelection from '@/pages/WorkoutTypeSelection';
import CreateWorkout from '@/pages/CreateWorkout';
import WorkoutDetail from '@/pages/WorkoutDetail';
import LiveWorkout from '@/pages/LiveWorkout';
import WorkoutSummary from '@/pages/WorkoutSummary';
import WeeklyOverview from '@/pages/WeeklyOverview';
import Recovery from '@/pages/Recovery';
import Supplements from '@/pages/Supplements';
import Measurements from '@/pages/Measurements';
import ProgressPhotos from '@/pages/ProgressPhotos';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import Routines from '@/pages/Routines';
import Plans from '@/pages/Plans';
import PlanDetail from '@/pages/PlanDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workout-selection" element={<WorkoutTypeSelection />} />
            <Route path="/workouts/:workoutId" element={<WorkoutDetail />} />
            <Route path="/workouts/new" element={<CreateWorkout />} />
            <Route path="/live-workout/:workoutId" element={<LiveWorkout />} />
            <Route path="/workout-summary/:workoutId" element={<WorkoutSummary />} />
            <Route path="/weekly" element={<WeeklyOverview />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="/supplements" element={<Supplements />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/progress-photos" element={<ProgressPhotos />} />
            <Route path="/routines" element={<Routines />} />
            <Route path="/routines/:templateId" element={<CreateWorkout />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/plans/:planId" element={<PlanDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <TabNavigation />
          <Toaster />
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
