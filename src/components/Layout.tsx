
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import NavigationHeader from './NavigationHeader';

const Layout: React.FC = () => {
  const location = useLocation();
  const showBottomNav = !location.pathname.includes('live-workout'); // Hide during live workout
  
  return (
    <div className="pb-16 min-h-screen bg-background"> 
      <NavigationHeader title="Relentless" showBack={false} />
      <div className="pt-14"> {/* Add padding top to account for the header */}
        <Outlet />
      </div>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
