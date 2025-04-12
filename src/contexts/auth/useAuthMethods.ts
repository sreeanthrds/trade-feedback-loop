
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
    console.log('Attempting to sign in with:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      if (data && data.user) {
        console.log('Sign in successful:', data.user);
        setUser({
          id: data.user.id,
          email: data.user.email || ''
        });
        
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
    console.log('Attempting to sign up with:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      // If data.session exists, the user is automatically confirmed (happens in development)
      if (data && data.session) {
        console.log('Sign up successful with auto-confirmation:', data.user);
        // Set user immediately for auto-confirmed accounts
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || ''
          });
        }
        
        toast({
          title: "Registration successful",
          description: "You're now logged in!"
        });
      } else if (data && data.user) {
        console.log('Sign up successful, confirmation required:', data.user);
        // For email confirmation flow
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
    console.log(`Attempting to sign in with ${provider}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      });
      
      if (error) {
        console.error(`Sign in with ${provider} error:`, error);
        toast({
          title: `${provider} login failed`,
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      console.log(`Sign in with ${provider} initiated:`, data);
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
    console.log('Attempting to sign out');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      // Explicitly set user to null after logout
      setUser(null);
      console.log('Sign out successful');
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully."
      });
    } catch (error: any) {
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
