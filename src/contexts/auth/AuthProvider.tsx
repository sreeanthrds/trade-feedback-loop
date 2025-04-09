
import React, { createContext } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoading, setIsLoading, isAuthenticated } = useAuthState();
  const { signIn, signUp, signOut, signInWithProvider } = useAuthMethods(user, setUser, setIsLoading);

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
