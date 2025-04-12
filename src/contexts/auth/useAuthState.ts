
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
      console.log('Checking auth session');
      
      try {
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          throw error;
        }
        
        if (data && data.session) {
          console.log('Active session found:', data.session.user);
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || ''
          });
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Listen for auth changes
    const setupAuthListener = () => {
      try {
        console.log('Setting up auth state listener');
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
          
          if (session && session.user) {
            console.log('User authenticated:', session.user);
            setUser({
              id: session.user.id,
              email: session.user.email || ''
            });
          } else {
            console.log('User logged out or session expired');
            setUser(null);
          }
          
          setIsLoading(false);
        });
        
        return () => {
          console.log('Cleaning up auth listener');
          if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error('Auth listener setup error:', error);
        setIsLoading(false);
        return () => {};
      }
    };
    
    checkSession();
    const unsubscribe = setupAuthListener();
    
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isAuthenticated: !!user
  };
}
