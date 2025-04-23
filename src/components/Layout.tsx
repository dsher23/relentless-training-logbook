
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout: React.FC = () => {
  return (
    <div className="pb-16 min-h-screen bg-background"> {/* Add padding to bottom to account for the nav bar */}
      <Outlet />
      <BottomNavigation />
    </div>
  );
};

export default Layout;
