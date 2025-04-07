
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Settings, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useTheme } from '@/hooks/use-theme';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  // Get page title based on current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/app/strategy-builder':
        return 'Strategy Builder';
      case '/app/backtesting':
        return 'Backtesting';
      case '/app/dashboard':
        return 'Results Dashboard';
      default:
        return 'Trady App';
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background z-10">
        <div className="container mx-auto px-4 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-primary hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to website</span>
              </Link>
              <div className="h-6 border-r border-border"></div>
              <span className="text-xl font-bold">{getPageTitle()}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </Button>
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
