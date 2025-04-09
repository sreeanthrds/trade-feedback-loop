
import React, { useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ToolbarButton from './ToolbarButton';

interface ResetButtonProps {
  resetStrategy: () => void;
  strategyId: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({ resetStrategy, strategyId }) => {
  const { toast } = useToast();

  const handleReset = useCallback(async () => {
    if (!strategyId) {
      console.error("Cannot reset strategy without ID");
      toast({
        title: "Reset failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`Resetting strategy with ID: ${strategyId}`);
    
    localStorage.removeItem(`strategy_${strategyId}`);
    
    resetStrategy();
    
    toast({
      title: "Strategy reset",
      description: "Your strategy has been reset to default"
    });
  }, [resetStrategy, toast, strategyId]);

  return (
    <ToolbarButton
      icon={RotateCcw}
      label="Reset"
      onClick={handleReset}
    />
  );
};

export default ResetButton;
