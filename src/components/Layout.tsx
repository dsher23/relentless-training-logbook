
import React from 'react';
import { Outlet } from 'react-router-dom';
import TabNavigation from './TabNavigation';

const Layout: React.FC = () => {
  return (
    <div className="pb-16 min-h-screen bg-background"> {/* Add padding to bottom to account for the nav bar */}
      <Outlet />
      <TabNavigation />
    </div>
  );
};

export default Layout;
