
import React, { useCallback } from 'react';
import { Play } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

interface BacktestButtonProps {
  toggleBacktest?: () => void;
  isRunning: boolean;
}

const BacktestButton: React.FC<BacktestButtonProps> = ({ 
  toggleBacktest,
  isRunning
}) => {
  const handleBacktestClick = useCallback(() => {
    console.log("Backtest button clicked, toggleBacktest exists:", !!toggleBacktest);
    
    if (toggleBacktest) {
      toggleBacktest();
    }
  }, [toggleBacktest]);

  return (
    <ToolbarButton
      icon={Play}
      label={isRunning ? 'Running...' : 'Backtest'}
      onClick={handleBacktestClick}
      disabled={isRunning}
      variant="default"
    />
  );
};

export default BacktestButton;
