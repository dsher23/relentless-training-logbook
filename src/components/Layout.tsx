
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout: React.FC = () => {
  const location = useLocation();
  const showBottomNav = !location.pathname.includes('live-workout'); // Hide during live workout
  
  return (
    <div className="pb-16 min-h-screen bg-background"> {/* Add padding to bottom to account for the nav bar */}
      <Outlet />
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
