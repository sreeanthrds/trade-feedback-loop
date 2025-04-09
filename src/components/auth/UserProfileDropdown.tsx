
import React, { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/auth';
import AuthModal from './AuthModal';
import { User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UserProfileDropdown = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get initials from email
  const getInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || "U";
  };

  // Handle sign out with redirection
  const handleSignOut = async () => {
    try {
      await signOut();
      // Force navigation to auth page after sign out
      navigate('/auth', { replace: true });
      
      // Show toast notification
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      console.error('Error during sign out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Force re-render when auth state changes
  useEffect(() => {
    console.log('Auth state in dropdown:', isAuthenticated ? 'authenticated' : 'unauthenticated');
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <AuthModal mode="signin">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </AuthModal>
        
        <AuthModal mode="signup">
          <Button size="sm">
            Sign Up
          </Button>
        </AuthModal>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarFallback>
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>My Account</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/app/account')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/app/account?tab=settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
