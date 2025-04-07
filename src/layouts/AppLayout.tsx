
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import ThemeToggle from '@/components/ui/theme-toggle';
import { Home, BarChart2, Settings, User } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  // Check if we're on the strategy builder page to use full height
  const isStrategyBuilder = location.pathname.includes('/strategy-builder');
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Compact header for strategy builder
  if (isStrategyBuilder) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border bg-background z-10 h-10">
          <div className="container mx-auto px-2 h-full">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <Link to="/app" className="text-primary hover:opacity-80 transition-opacity">
                  <Home className="h-4 w-4" />
                </Link>
                <span className="text-sm font-medium">Strategy Builder</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <ThemeToggle isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  // Regular header for other pages
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background z-10">
        <div className="container mx-auto px-4 h-14">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <Link to="/app" className="text-xl font-bold text-primary hover:opacity-80 transition-opacity">
                Trady
              </Link>
              
              <nav className="hidden md:flex space-x-4 ml-6">
                <Link 
                  to="/app" 
                  className={`text-sm font-medium ${location.pathname === '/app' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Strategies
                </Link>
                <Link 
                  to="/app/backtesting" 
                  className={`text-sm font-medium ${location.pathname.includes('/backtesting') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Backtesting
                </Link>
                <Link 
                  to="/app/dashboard" 
                  className={`text-sm font-medium ${location.pathname.includes('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Results
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
