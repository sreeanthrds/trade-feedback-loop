
import React, { useCallback, useRef } from 'react';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { saveStrategyToLocalStorage } from '../../utils/storage/operations/saveStrategy';
import ToolbarButton from './ToolbarButton';

interface SaveButtonProps {
  nodes: any[];
  edges: any[];
  strategyId: string;
  strategyName: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ 
  nodes, 
  edges, 
  strategyId, 
  strategyName 
}) => {
  const { toast } = useToast();
  const currentStrategyIdRef = useRef(strategyId);
  const currentStrategyNameRef = useRef(strategyName);
  
  // Update refs when props change
  React.useEffect(() => {
    currentStrategyIdRef.current = strategyId;
    currentStrategyNameRef.current = strategyName;
  }, [strategyId, strategyName]);

  const handleSave = useCallback(() => {
    if (!currentStrategyIdRef.current) {
      console.error("Cannot save strategy without ID");
      toast({
        title: "Save failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`Saving strategy with ID: ${currentStrategyIdRef.current}`);
    saveStrategyToLocalStorage(nodes, edges, currentStrategyIdRef.current, currentStrategyNameRef.current);
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: `strategy_${currentStrategyIdRef.current}`,
      newValue: localStorage.getItem(`strategy_${currentStrategyIdRef.current}`)
    }));
    
    toast({
      title: "Strategy saved",
      description: "Your strategy has been saved"
    });
  }, [nodes, edges, toast]);

  return (
    <ToolbarButton
      icon={Save}
      label="Save"
      onClick={handleSave}
    />
  );
};

export default SaveButton;
