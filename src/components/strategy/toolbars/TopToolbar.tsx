
import React from 'react';
import { Panel } from '@xyflow/react';
import { Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import ThemeToggle from '@/components/ui/theme-toggle';

const TopToolbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const strategyStore = useStrategyStore();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <Panel position="top-center">
      <div className="flex gap-2 bg-background/90 p-2 rounded-md shadow-md">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => strategyStore.undo()}
          disabled={strategyStore.historyIndex <= 0}
        >
          <Undo className="h-4 w-4" />
          <span className="sr-only">Undo</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => strategyStore.redo()}
          disabled={strategyStore.historyIndex >= strategyStore.history.length - 1}
        >
          <Redo className="h-4 w-4" />
          <span className="sr-only">Redo</span>
        </Button>
        <ThemeToggle isDarkMode={theme === 'dark'} toggleTheme={toggleTheme} />
      </div>
    </Panel>
  );
};

export default TopToolbar;
