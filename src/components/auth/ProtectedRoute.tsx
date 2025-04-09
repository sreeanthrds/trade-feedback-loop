
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Log route access attempts for debugging
  useEffect(() => {
    console.log(`Protected route access: ${location.pathname}, Auth state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}, Loading: ${isLoading}`);
  }, [location.pathname, isAuthenticated, isLoading]);
  
  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page with the current location
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /auth with state:', location);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Otherwise, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
