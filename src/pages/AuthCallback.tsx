
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback page loaded, processing OAuth response...');
        
        // Get current session info
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          toast({
            title: 'Authentication Error',
            description: 'There was a problem signing you in. Please try again.',
            variant: 'destructive',
          });
          navigate('/auth');
          return;
        }
        
        if (data?.session) {
          // Auth successful, show success message
          console.log('Authentication successful:', data.session);
          
          // Extract provider from user metadata if available
          const provider = data.session.user?.app_metadata?.provider || 'OAuth';
          
          toast({
            title: 'Authentication Successful',
            description: `You have been signed in successfully with ${provider}.`,
          });
          
          // Redirect to app dashboard
          navigate('/app');
        } else {
          console.log('No session found after OAuth callback');
          toast({
            title: 'Authentication Failed',
            description: 'No session was created. Please try again.',
            variant: 'destructive',
          });
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast({
          title: 'Authentication Error',
          description: 'There was a problem processing your sign in.',
          variant: 'destructive',
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold mb-2">Completing Sign In</h2>
        <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
