
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { 
  ExitOrderType,
  ExitOrderConfig,
  ExitNodeData
} from '../types';

interface UseOrderSettingsProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  setOrderType: (type: ExitOrderType) => void;
  setLimitPrice: (price: number | undefined) => void;
  defaultExitNodeData: ExitNodeData;
}

export const useOrderSettings = ({
  node,
  updateNodeData,
  setOrderType,
  setLimitPrice,
  defaultExitNodeData
}: UseOrderSettingsProps) => {
  // Update order type
  const handleOrderTypeChange = useCallback((type: ExitOrderType) => {
    setOrderType(type);
    
    const nodeData = node.data || {};
    // Get current exit node data safely
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
    // Update order config
    const updatedOrderConfig: ExitOrderConfig = {
      ...currentExitNodeData.orderConfig,
      orderType: type,
      // Clear limit price if switching to market order
      ...(type === 'market' && { limitPrice: undefined })
    };
    
    // Create updated exit node data
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      orderConfig: updatedOrderConfig
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [node.id, node.data, updateNodeData, defaultExitNodeData, setOrderType]);
  
  // Update limit price
  const handleLimitPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLimitPrice(isNaN(value) ? undefined : value);
    
    if (!isNaN(value)) {
      const nodeData = node.data || {};
      // Get current exit node data safely
      const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;
      
      // Update order config
      const updatedOrderConfig: ExitOrderConfig = {
        ...currentExitNodeData.orderConfig,
        limitPrice: value
      };
      
      // Create updated exit node data
      const updatedExitNodeData: ExitNodeData = {
        ...currentExitNodeData,
        orderConfig: updatedOrderConfig
      };
      
      // Update node data
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: updatedExitNodeData
      });
    }
  }, [node.id, node.data, updateNodeData, defaultExitNodeData, setLimitPrice]);
  
  return {
    handleOrderTypeChange,
    handleLimitPriceChange
  };
};
