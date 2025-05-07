
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useFirestore } from '@/context/FirestoreContext';
import { Loader } from 'lucide-react';

const RequireAuth: React.FC = () => {
  const { isAuthenticated, isLoading } = useFirestore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to the login page but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, show the protected route
  return <Outlet />;
};

export default RequireAuth;
