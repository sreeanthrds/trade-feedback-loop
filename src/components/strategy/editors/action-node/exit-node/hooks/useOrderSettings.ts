
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { 
  ExitOrderType,
  ExitNodeData,
  ExitOrderConfig
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
  const handleOrderTypeChange = useCallback((type: string) => {
    setOrderType(type as ExitOrderType);
    
    const nodeData = node.data || {};
    // Get current exit node data safely
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
    // Create updated exit order config
    const updatedOrderConfig: ExitOrderConfig = {
      ...currentExitNodeData.exitOrderConfig,
      orderType: type as ExitOrderType
    };
    
    // Create updated exit node data, maintaining both orderConfig and exitOrderConfig
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      exitOrderConfig: updatedOrderConfig,
      // Update orderConfig for backward compatibility
      orderConfig: {
        ...currentExitNodeData.orderConfig,
        orderType: type as ExitOrderType
      }
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [node.id, node.data, updateNodeData, defaultExitNodeData, setOrderType]);
  
  // Update limit price
  const handleLimitPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const limitPrice = value === '' ? undefined : parseFloat(value);
    
    setLimitPrice(limitPrice);
    
    const nodeData = node.data || {};
    // Get current exit node data safely
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
    // Create updated exit order config
    const updatedOrderConfig: ExitOrderConfig = {
      ...currentExitNodeData.exitOrderConfig,
      limitPrice
    };
    
    // Create updated exit node data
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      exitOrderConfig: updatedOrderConfig,
      // Update orderConfig for backward compatibility
      orderConfig: {
        ...currentExitNodeData.orderConfig,
        limitPrice
      }
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [node.id, node.data, updateNodeData, defaultExitNodeData, setLimitPrice]);
  
  return {
    handleOrderTypeChange,
    handleLimitPriceChange
  };
};
