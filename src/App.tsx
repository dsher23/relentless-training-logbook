
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/Dashboard';
import Training from './pages/Training';
import Recovery from './pages/Recovery';
import Supplements from './pages/Supplements';
import WeeklyOverview from './pages/WeeklyOverview';
import LiveWorkout from './pages/LiveWorkout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/training" element={<Training />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="/supplements" element={<Supplements />} />
            <Route path="/weekly-overview" element={<WeeklyOverview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Routes with different layouts */}
          <Route path="/live-workout" element={<LiveWorkout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
