
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { AuthContextType } from './types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error('useAuth hook used outside of AuthProvider!');
    
    // For better debugging in development mode, provide stack trace
    const errorStack = new Error().stack;
    console.error('Stack trace:', errorStack);
    
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
