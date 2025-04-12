
import React, { createContext, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoading, setIsLoading, isAuthenticated } = useAuthState();
  const { signIn, signUp, signOut, signInWithProvider } = useAuthMethods(user, setUser, setIsLoading);

  // Debug logging for AuthProvider
  useEffect(() => {
    console.log('AuthProvider mounted, context created');
    return () => console.log('AuthProvider unmounted');
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    signInWithProvider
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
