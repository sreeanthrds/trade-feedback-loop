
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  // Handle possible errors with useAuth
  const [error, setError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safely get auth context
  let authContext;
  try {
    authContext = useAuth();
    // If we get here, auth context is available
    if (!isAuthReady) {
      setIsAuthReady(true);
      console.log('Auth context successfully obtained');
    }
  } catch (err: any) {
    // If auth context is not available, handle it gracefully
    if (!error) {
      console.error('Error accessing auth context:', err.message);
      setError(err.message);
    }
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-center text-red-600 dark:text-red-400 mb-4">Authentication Error</h2>
          <p className="text-gray-600 dark:text-gray-300">
            There was a problem initializing the authentication system. Please refresh the page or try again later.
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }
  
  // Destructure auth context after confirming it exists
  const { isAuthenticated, isLoading } = authContext;
  
  // Get the intended destination from state, or default to /app
  const from = location.state?.from?.pathname || '/app';
  
  // Check for success message in query params (for redirect after signup)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const successMessage = searchParams.get('message');
    
    if (successMessage) {
      toast({
        title: "Success",
        description: decodeURIComponent(successMessage),
      });
      
      // Clean up the URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, toast]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthReady && !isLoading && isAuthenticated) {
      console.log('User is authenticated, redirecting to:', from);
      // Force immediate redirect
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from, isAuthReady]);

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="max-w-md w-full">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Trady</CardTitle>
            <CardDescription>
              Please sign in to continue to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignInForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <div className="text-sm text-muted-foreground text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
