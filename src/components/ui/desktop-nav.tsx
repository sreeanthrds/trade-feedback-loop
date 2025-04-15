
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from './button';
import { useAuth } from '@/contexts/auth';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';
import { navigationItems } from './navigation-config';

const DesktopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Check if current route is active
  const isActive = (path: string) => location.pathname === path;
  
  const handleStartFreeTrial = () => {
    navigate('/auth');
  };
  
  return (
    <nav className="hidden md:flex items-center space-x-8 ml-auto mr-auto">
      {navigationItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          className={`smooth-transition ${item.showIcon ? 'flex items-center' : ''} ${
            isActive(item.path) 
              ? 'text-primary font-medium' 
              : 'text-foreground/80 hover:text-foreground'
          }`}
        >
          {item.showIcon && item.icon && <span className="mr-1">{item.icon}</span>}
          {item.label}
        </Link>
      ))}
      
      <div className="flex items-center space-x-3">
        {isAuthenticated ? (
          <UserProfileDropdown />
        ) : (
          <>
            <Link 
              to="/auth" 
              className="flex items-center text-foreground/80 hover:text-foreground smooth-transition"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </Link>
            <Button 
              onClick={handleStartFreeTrial}
              className="btn-primary"
            >
              Start Free Trial
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default DesktopNav;
