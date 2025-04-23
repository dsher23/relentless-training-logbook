
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutDetail from './pages/WorkoutDetail';
import LiveWorkout from './pages/LiveWorkout';
import WorkoutHistory from './pages/WorkoutHistory';
import Plans from './pages/Plans';
import Routines from './pages/Routines';
import WorkoutSelection from './pages/WorkoutSelection';
import WorkoutTypeSelection from './pages/WorkoutTypeSelection';
import WorkoutBuilder from './pages/WorkoutBuilder';
import PlanDetail from './pages/PlanDetail';
import Index from './pages/Index';
import Training from './pages/Training';
import WorkoutDays from './pages/WorkoutDays';
import DayExercises from './pages/DayExercises';
import WeeklyOverview from './pages/WeeklyOverview';
import Measurements from './pages/Measurements';
import Supplements from './pages/Supplements';
import Recovery from './pages/Recovery';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/training" element={<Training />} />
            
            <Route path="/exercise-plans" element={<Plans />} />
            <Route path="/exercise-plans/:planId" element={<PlanDetail />} />
            <Route path="/exercise-plans/:planId/days" element={<WorkoutDays />} />
            <Route path="/exercise-plans/:planId/days/:dayId" element={<DayExercises />} />
            
            <Route path="/plans" element={<Plans />} />
            
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/new" element={<CreateWorkout />} />
            <Route path="/workouts/builder" element={<WorkoutBuilder />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/workouts/builder/:id" element={<WorkoutBuilder />} />
            <Route path="/live-workout/:id" element={<LiveWorkout />} />
            <Route path="/workout-history" element={<WorkoutHistory />} />
            <Route path="/weekly-overview" element={<WeeklyOverview />} />

            <Route path="/routines" element={<Routines />} />
            <Route path="/routines/:id" element={<Routines />} />

            <Route path="/workout-selection" element={<WorkoutSelection />} />
            <Route path="/workout-type-selection" element={<WorkoutTypeSelection />} />
            
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/supplements" element={<Supplements />} />
            <Route path="/recovery" element={<Recovery />} />
            
            <Route path="/home" element={<Index />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
