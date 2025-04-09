
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from './types';

export function useAuthState() {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for current session and set up auth listener
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

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated: !!user
  };
}
