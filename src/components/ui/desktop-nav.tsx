
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText } from 'lucide-react';

const DesktopNav: React.FC = () => {
  const location = useLocation();
  
  // Check if current route is active
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="hidden md:flex items-center space-x-8 ml-auto mr-auto">
      <Link 
        to="/" 
        className={`smooth-transition ${isActive('/') 
          ? 'text-primary font-medium' 
          : 'text-foreground/80 hover:text-foreground'}`}
      >
        Home
      </Link>
      <Link 
        to="/features" 
        className={`smooth-transition ${isActive('/features') 
          ? 'text-primary font-medium' 
          : 'text-foreground/80 hover:text-foreground'}`}
      >
        Features
      </Link>
      <Link 
        to="/pricing" 
        className={`smooth-transition ${isActive('/pricing') 
          ? 'text-primary font-medium' 
          : 'text-foreground/80 hover:text-foreground'}`}
      >
        Pricing
      </Link>
      <Link 
        to="/blog" 
        className={`smooth-transition ${isActive('/blog') 
          ? 'text-primary font-medium' 
          : 'text-foreground/80 hover:text-foreground'}`}
      >
        Blog
      </Link>
      <Link 
        to="/documentation" 
        className={`smooth-transition flex items-center ${isActive('/documentation') 
          ? 'text-primary font-medium' 
          : 'text-foreground/80 hover:text-foreground'}`}
      >
        <FileText className="h-4 w-4 mr-1" />
        Documentation
      </Link>
      <div className="flex items-center space-x-3">
        <Link 
          to="/login" 
          className="text-foreground/80 hover:text-foreground smooth-transition"
        >
          Login
        </Link>
        <Link 
          to="/app" 
          className="btn-primary"
        >
          Start Free Trial
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNav;
