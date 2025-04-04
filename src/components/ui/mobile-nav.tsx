
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Workflow } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, toggleMenu }) => {
  const location = useLocation();
  
  // Check if current route is active
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      <button 
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 smooth-transition"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>
      
      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 animate-fade-in w-full absolute top-16 left-0">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`py-2 ${isActive('/') 
                ? 'text-primary font-medium' 
                : 'text-foreground/80'}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`py-2 ${isActive('/features') 
                ? 'text-primary font-medium' 
                : 'text-foreground/80'}`}
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`py-2 ${isActive('/pricing') 
                ? 'text-primary font-medium' 
                : 'text-foreground/80'}`}
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            <Link 
              to="/blog" 
              className={`py-2 ${isActive('/blog') 
                ? 'text-primary font-medium' 
                : 'text-foreground/80'}`}
              onClick={toggleMenu}
            >
              Blog
            </Link>
            <Link 
              to="/strategy-builder" 
              className={`py-2 flex items-center gap-1 ${isActive('/strategy-builder') 
                ? 'text-primary font-medium' 
                : 'text-foreground/80'}`}
              onClick={toggleMenu}
            >
              <Workflow className="h-4 w-4" />
              Strategy Builder
            </Link>
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                to="/login" 
                className="py-2 text-foreground/80"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary text-center"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
