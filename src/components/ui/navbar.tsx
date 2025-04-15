
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Logo from './logo';
import DesktopNav from './desktop-nav';
import MobileNav from './mobile-nav';
import ThemeToggle from './theme-toggle';
import { Button } from './button';
import { FileText } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);
  
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
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Hidden on Strategy Builder page */}
          {!isStrategyBuilderPage && (
            <Logo onClick={() => setIsOpen(false)} />
          )}
          
          {/* Desktop Navigation */}
          <div className={`${isStrategyBuilderPage ? 'ml-0' : 'ml-auto mr-auto'}`}>
            <DesktopNav />
          </div>
          
          {/* Documentation Link - Now always visible */}
          <Link to="/documentation" className="hidden md:flex items-center mr-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Documentation</span>
            </Button>
          </Link>
          
          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4 ml-auto">
            <ThemeToggle />
            <MobileNav isOpen={isOpen} toggleMenu={toggleMenu} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
