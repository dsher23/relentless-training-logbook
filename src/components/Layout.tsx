
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TabNavigationExtended from './TabNavigation';
import NavigationHeader from './NavigationHeader';

const Layout: React.FC = () => {
  const location = useLocation();
  const showBottomNav = !location.pathname.includes('live-workout'); // Hide during live workout
  
  // Don't show the header on pages that have their own (like Dashboard)
  const hideHeader = location.pathname === '/dashboard' || 
                     location.pathname.includes('/profile') ||
                     location.pathname.includes('/settings');
  
  return (
    <div className="pb-16 min-h-screen bg-background"> 
      {!hideHeader && <NavigationHeader title="IronLog" showBack={false} />}
      <div className={!hideHeader ? "pt-14" : ""}> {/* Add padding top only if header is shown */}
        <Outlet />
      </div>
      {showBottomNav && <TabNavigationExtended />}
    </div>
  );
};

export default Layout;
