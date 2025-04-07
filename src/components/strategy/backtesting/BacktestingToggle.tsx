
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';
import { useBacktestingStore } from './useBacktestingStore';

interface BacktestingToggleProps {
  onToggle: () => void;
  isOpen: boolean;
}

const BacktestingToggle = ({ onToggle, isOpen }: BacktestingToggleProps) => {
  const { results } = useBacktestingStore();
  
  const handleToggle = () => {
    console.log("Backtest toggle clicked, current isOpen:", isOpen);
    onToggle();
  };
  
  return (
    <Button
      variant={results ? "default" : "outline"}
      size="sm"
      className={`flex items-center gap-2 ${isOpen ? 'bg-muted' : ''} ${results ? 'border-green-500' : ''}`}
      onClick={handleToggle}
    >
      <BarChart className="h-4 w-4" />
      <span className="hidden sm:inline">
        {results ? `Results: +${results.totalReturn.toFixed(1)}%` : 'Backtest'}
      </span>
      {isOpen ? (
        <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
          <path d="M0 0H6L3 4L0 0Z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
          <path d="M0 4H6L3 0L0 4Z" fill="currentColor" />
        </svg>
      )}
    </Button>
  );
};

export default BacktestingToggle;
