
import React, { useEffect, useCallback } from 'react';
import { Panel } from '@xyflow/react';
import { Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useStrategyStore } from '@/hooks/use-strategy-store';

const TopToolbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const strategyStore = useStrategyStore();
  
  // Move the theme toggle to a callback to prevent render-time updates
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);
  
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
        <Button
          size="sm"
          variant="outline"
          onClick={toggleTheme}
          className="flex items-center gap-2"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </Panel>
  );
};

export default TopToolbar;
