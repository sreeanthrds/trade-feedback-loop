import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/auth';

type AuthModalProps = {
  children: React.ReactNode;
  mode?: 'signin' | 'signup';
};

const AuthModal = ({ children, mode = 'signin' }: AuthModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (authMode === 'signin') {
        const result = await signIn(email, password);
        if (result.success) {
          setIsOpen(false);
        }
      } else {
        const result = await signUp(email, password);
        if (result.success) {
          setIsOpen(false);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {authMode === 'signin' ? 'Sign In' : 'Create an Account'}
          </DialogTitle>
          <DialogDescription>
            {authMode === 'signin'
              ? 'Enter your credentials to access your account'
              : 'Fill in the information below to create your account'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {authMode === 'signin'
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
