
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for current session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        // First, check localStorage for mock auth in development
        const mockUser = localStorage.getItem('mock_current_user');
        if (mockUser) {
          try {
            const parsedUser = JSON.parse(mockUser);
            setUser({
              id: parsedUser.id,
              email: parsedUser.email || ''
            });
            setIsLoading(false);
            return; // Exit early if we found a mock user
          } catch (e) {
            console.error('Error parsing mock user:', e);
            // Continue with regular auth check
          }
        }
        
        // Regular Supabase auth check
        const { data } = await supabase.auth.getSession();
        
        if (data && data.session) {
          const { user } = data.session;
          setUser({
            id: user.id,
            email: user.email || ''
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    try {
      checkSession();
      
      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
        } else {
          // Check for mock auth
          const mockUser = localStorage.getItem('mock_current_user');
          if (mockUser) {
            try {
              const parsedUser = JSON.parse(mockUser);
              setUser({
                id: parsedUser.id,
                email: parsedUser.email || ''
              });
              return; // Exit early if we found a mock user
            } catch (e) {
              console.error('Error parsing mock user:', e);
              // Continue with setting user to null
            }
          }
          
          setUser(null);
        }
        
        setIsLoading(false);
      });
      
      return () => {
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error('Auth provider setup error:', error);
      setIsLoading(false);
      return () => {};
    }
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
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
  const signUp = async (email: string, password: string) => {
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

  // Sign out function
  const signOut = async () => {
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

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
