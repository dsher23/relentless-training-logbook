import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Workouts from "./pages/Workouts";
import WorkoutHistory from "./pages/WorkoutHistory";
import Supplements from "./pages/Supplements";
import Training from "./pages/Training";
import Routines from "./pages/Routines";
import WeeklyOverview from "./pages/WeeklyOverview";
import Plans from "./pages/Plans";
import PlanDetail from "./pages/PlanDetail";
import DayExercises from "./pages/DayExercises";
import Measurements from "./pages/Measurements";
import Settings from "./pages/Settings";

// Protected Route component to handle authentication
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAppContext();
  console.log("ProtectedRoute: Current user state:", user);

  if (user === null) {
    console.log("ProtectedRoute: User state is still loading, rendering loading spinner...");
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("ProtectedRoute: User authenticated, rendering children");
  return children;
};

const App = () => {
  console.log("App.tsx: Rendering App component");
  console.log("App.tsx: AppProvider context initialized");

  // Log the initial route for debugging
  useEffect(() => {
    console.log("App.tsx: Current route:", window.location.pathname);
  }, []);

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-history"
            element={
              <ProtectedRoute>
                <WorkoutHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplements"
            element={
              <ProtectedRoute>
                <Supplements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/training"
            element={
              <ProtectedRoute>
                <Training />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routines"
            element={
              <ProtectedRoute>
                <Routines />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekly-overview"
            element={
              <ProtectedRoute>
                <WeeklyOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plans"
            element={
              <ProtectedRoute>
                <Plans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan/:id"
            element={
              <ProtectedRoute>
                <PlanDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/day-exercises"
            element={
              <ProtectedRoute>
                <DayExercises />
              </ProtectedRoute>
            }
          />
          <Route
            path="/measurements"
            element={
              <ProtectedRoute>
                <Measurements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/* Redirect root route to /auth if user is not logged in */}
          <Route
            path="/"
            element={<Navigate to="/auth" replace />}
          />
          {/* Catch-all route for undefined paths */}
          <Route
            path="*"
            element={<Navigate to="/auth" replace />}
          />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
