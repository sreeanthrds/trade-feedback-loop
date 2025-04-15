
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, HomeIcon } from 'lucide-react';
import UserProfileDropdown from '@/components/auth/UserProfileDropdown';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Check if we're on the strategy builder page
  const isStrategyBuilder = location.pathname.includes('/strategy-builder');

  return (
    <div className="min-h-screen flex flex-col">
      {!isStrategyBuilder && (
        <header className="border-b sticky top-0 z-50 bg-background">
          <div className="container flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-6">
              <Link to="/" className="font-semibold text-lg">Trady</Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/app" className={`text-sm ${location.pathname === '/app' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  Strategies
                </Link>
                <Link to="/app/backtesting" className={`text-sm ${location.pathname.includes('/backtesting') ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  Backtesting
                </Link>
                <Link to="/app/dashboard" className={`text-sm ${location.pathname.includes('/dashboard') ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  Dashboard
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </Button>
              
              <UserProfileDropdown />
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
