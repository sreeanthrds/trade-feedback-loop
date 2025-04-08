
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/pages/AuthPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Log route access attempts for debugging
  useEffect(() => {
    console.log(`Route access: ${location.pathname}, Auth state: ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`);
  }, [location.pathname, isAuthenticated]);
  
  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page and remember the original destination
  if (!isAuthenticated) {
    // For documentation page, we just redirect to auth
    if (location.pathname === '/documentation') {
      return <Navigate to="/auth" replace />;
    }
    
    // For other pages, we show the auth page directly
    return <AuthPage />;
  }
  
  // Otherwise, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
