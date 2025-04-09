
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User, AuthResult } from './types';

export function useAuthMethods(
  user: User, 
  setUser: React.Dispatch<React.SetStateAction<User>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const { toast } = useToast();

  // Sign in function
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      if (data && data.user) {
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${data.user.email}!`
        });
        return { success: true };
      }
      
      return { success: false, error: "Unknown error occurred" };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      // If data.session exists, the user is automatically confirmed (happens in development)
      if (data && data.session) {
        toast({
          title: "Registration successful",
          description: "You're now logged in!"
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Please check your email for verification link."
        });
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with social provider
  const signInWithProvider = async (provider: 'google' | 'facebook'): Promise<AuthResult> => {
    setIsLoading(true);
    
    try {
      if (process.env.NODE_ENV === 'development' || !supabase.auth.signInWithOAuth) {
        // Mock social auth for development
        const mockId = `mock-${provider}-${Date.now()}`;
        const mockEmail = `${provider}-user-${Date.now()}@example.com`;
        
        localStorage.setItem('mock_current_user', JSON.stringify({
          id: mockId,
          email: mockEmail,
          provider
        }));
        
        setUser({
          id: mockId,
          email: mockEmail
        });
        
        toast({
          title: `Mock ${provider} login successful`,
          description: `You are now logged in with ${mockEmail}`,
        });
        
        return { success: true };
      }
      
      // Real implementation for production
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      
      if (error) {
        toast({
          title: `${provider} login failed`,
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      // This won't complete immediately as it redirects to the provider
      return { success: true };
      
    } catch (error: any) {
      console.error(`Sign in with ${provider} error:`, error);
      return { success: false, error: error.message || `Login with ${provider} failed` };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      
      // Also clear mock auth if it exists
      localStorage.removeItem('mock_current_user');
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully."
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    signInWithProvider
  };
}
