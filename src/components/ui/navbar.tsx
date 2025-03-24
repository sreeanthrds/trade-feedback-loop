
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Workflow } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  // Check if current route is active
  const isActive = (path: string) => location.pathname === path;
  
  // Handle scroll event for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if we're on the strategy builder page to hide the logo
  const isStrategyBuilderPage = location.pathname === '/strategy-builder';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Hidden on Strategy Builder page */}
          {!isStrategyBuilderPage && (
            <Link 
              to="/" 
              className="flex items-center space-x-2 smooth-transition hover:opacity-80"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl md:text-2xl font-serif font-bold text-primary">
                Trady
              </span>
            </Link>
          )}
          
          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center space-x-8 ${isStrategyBuilderPage ? 'ml-0' : 'ml-auto mr-auto'}`}>
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
              to="/strategy-builder" 
              className={`smooth-transition flex items-center gap-1 ${isActive('/strategy-builder') 
                ? 'text-primary font-medium' 
                : 'text-foreground/80 hover:text-foreground'}`}
            >
              <Workflow className="h-4 w-4" />
              Strategy Builder
            </Link>
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="text-foreground/80 hover:text-foreground smooth-transition"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary"
              >
                Sign Up
              </Link>
            </div>
          </nav>
          
          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4 ml-auto">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 smooth-transition"
              aria-label="Toggle theme"
            >
              {!isDarkMode ? (
                <Moon className="h-5 w-5 text-indigo-700 dark:text-indigo-400" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </button>
            
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
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 animate-fade-in">
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
    </header>
  );
};

export default Navbar;
