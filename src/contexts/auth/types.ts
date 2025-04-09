
export type User = {
  id: string;
  email: string;
} | null;

export type AuthResult = {
  success: boolean; 
  error?: string;
};

export type AuthContextType = {
  user: User;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  signInWithProvider: (provider: 'google' | 'facebook') => Promise<AuthResult>;
};
