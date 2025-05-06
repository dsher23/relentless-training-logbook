import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import CreateWorkout from "./pages/CreateWorkout";
import WorkoutDetail from "./pages/WorkoutDetail";
import LiveWorkout from "./pages/LiveWorkout";
import WorkoutHistory from "./pages/WorkoutHistory";
import Plans from "./pages/Plans";
import Routines from "./pages/Routines";
import WorkoutSelection from "./pages/WorkoutSelection";
import WorkoutTypeSelection from "./pages/WorkoutTypeSelection";
import WorkoutBuilder from "./pages/WorkoutBuilder";
import PlanDetail from "./pages/PlanDetail";
import Index from "./pages/Index";
import Training from "./pages/Training";
import WorkoutDays from "./pages/WorkoutDays";
import DayExercises from "./pages/DayExercises";
import WeeklyOverview from "./pages/WeeklyOverview";
import Measurements from "./pages/Measurements";
import ProgressPhotos from "./pages/ProgressPhotos";
import Supplements from "./pages/Supplements";
import Recovery from "./pages/Recovery";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import EditExercise from "./components/EditExercise";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Error Boundary Component to catch runtime errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-white">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

function App() {
  return (
    // Wrap the entire app in AppProvider to provide context to all components
    <AppProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Auth route for unauthenticated users */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Redirect root to dashboard or auth */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected routes under Layout */}
            <Route element={<Layout />}>
              {/* Main routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />

              {/* Exercise Plans Routes */}
              <Route path="/exercise-plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
              <Route path="/exercise-plans/:planId" element={<ProtectedRoute><PlanDetail /></ProtectedRoute>} />
              <Route path="/exercise-plans/:planId/days" element={<ProtectedRoute><WorkoutDays /></ProtectedRoute>} />
              <Route path="/exercise-plans/:planId/days/:dayId" element={<ProtectedRoute><DayExercises /></ProtectedRoute>} />
              <Route path="/exercise-plans/days/:dayId" element={<ProtectedRoute><DayExercises /></ProtectedRoute>} />
              <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />

              {/* Workout Routes */}
              <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
              <Route path="/workouts/new" element={<ProtectedRoute><CreateWorkout /></ProtectedRoute>} />
              <Route path="/workouts/builder" element={<ProtectedRoute><WorkoutBuilder /></ProtectedRoute>} />
              <Route path="/workouts/:id" element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>} />
              <Route path="/workouts/builder/:id" element={<ProtectedRoute><WorkoutBuilder /></ProtectedRoute>} />
              <Route path="/workouts/builder/edit-exercise/:exerciseId" element={<ProtectedRoute><EditExercise /></ProtectedRoute>} />
              <Route path="/workouts/start/:id" element={<ProtectedRoute><LiveWorkout /></ProtectedRoute>} />
              <Route path="/live-workout/:id" element={<ProtectedRoute><LiveWorkout /></ProtectedRoute>} />
              <Route path="/workout-history" element={<ProtectedRoute><WorkoutHistory /></ProtectedRoute>} />
              <Route path="/weekly-overview" element={<ProtectedRoute><WeeklyOverview /></ProtectedRoute>} />

              {/* Routines Routes */}
              <Route path="/routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
              <Route path="/routines/:id" element={<ProtectedRoute><Routines /></ProtectedRoute>} />

              {/* Workout Selection Routes */}
              <Route path="/workout-selection" element={<ProtectedRoute><WorkoutSelection /></ProtectedRoute>} />
              <Route path="/workout-type-selection" element={<ProtectedRoute><WorkoutTypeSelection /></ProtectedRoute>} />

              {/* Other Feature Routes */}
              <Route path="/measurements" element={<ProtectedRoute><Measurements /></ProtectedRoute>} />
              <Route path="/progress-photos" element={<ProtectedRoute><ProgressPhotos /></ProtectedRoute>} />
              <Route path="/supplements" element={<ProtectedRoute><Supplements /></ProtectedRoute>} />
              <Route path="/recovery" element={<ProtectedRoute><Recovery /></ProtectedRoute>} />

              {/* User Routes */}
              <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </Router>
    </AppProvider>
  );
}

export default App;
