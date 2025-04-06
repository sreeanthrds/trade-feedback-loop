
import { Node } from '@xyflow/react';
import { 
  ExitOrderType, 
  ExitNodeData,
  ExitOrderConfig,
  QuantityType
} from './types';
import {
  useExitNodeBase,
  useExitNodeInitialization,
  useOrderSettings,
  useReEntrySettings,
} from './hooks';
import { useCallback } from 'react';

interface UseExitOrderFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useExitOrderForm = ({ node, updateNodeData }: UseExitOrderFormProps) => {
  // Use base hook for state management
  const {
    nodeData,
    defaultExitNodeData,
    initializedRef,
    orderType,
    setOrderType,
    limitPrice,
    setLimitPrice,
  } = useExitNodeBase({ node, updateNodeData });
  
  // Use initialization hook
  useExitNodeInitialization({
    node,
    updateNodeData,
    initializedRef,
    defaultExitNodeData
  });
  
  // Use order settings hook
  const { handleOrderTypeChange, handleLimitPriceChange } = useOrderSettings({
    node,
    updateNodeData,
    setOrderType,
    setLimitPrice,
    defaultExitNodeData
  });
  
  // Use re-entry settings
  const { reEntryEnabled, handleReEntryToggle } = useReEntrySettings({
    node,
    updateNodeData,
    nodeData,
    defaultExitNodeData
  });
  
  // Handle target position selection
  const handleTargetPositionChange = useCallback((positionId: string) => {
    const currentExitNodeData = (node.data?.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
    // Update exit order config with target position
    const updatedOrderConfig = {
      ...currentExitNodeData.exitOrderConfig,
      targetPositionId: positionId === '_any' ? undefined : positionId
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...node.data,
      exitNodeData: {
        ...currentExitNodeData,
        exitOrderConfig: updatedOrderConfig
      }
    });
  }, [node, updateNodeData, defaultExitNodeData]);
  
  // Handle quantity type selection
  const handleQuantityTypeChange = useCallback((quantityType: string) => {
    const currentExitNodeData = (node.data?.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
    // Update exit order config with quantity type
    const updatedOrderConfig = {
      ...currentExitNodeData.exitOrderConfig,
      quantity: quantityType as QuantityType
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...node.data,
      exitNodeData: {
        ...currentExitNodeData,
        exitOrderConfig: updatedOrderConfig
      }
    });
  }, [node, updateNodeData, defaultExitNodeData]);
  
  // Handle partial quantity percentage change
  const handlePartialQuantityChange = useCallback((percentage: number) => {
    const currentExitNodeData = (node.data?.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
    // Update exit order config with partial quantity percentage
    const updatedOrderConfig = {
      ...currentExitNodeData.exitOrderConfig,
      partialQuantityPercentage: percentage
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...node.data,
      exitNodeData: {
        ...currentExitNodeData,
        exitOrderConfig: updatedOrderConfig
      }
    });
  }, [node, updateNodeData, defaultExitNodeData]);

  // Handle specific quantity change
  const handleSpecificQuantityChange = useCallback((quantity: number) => {
    const currentExitNodeData = (node.data?.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
    // Update exit order config with specific quantity
    const updatedOrderConfig = {
      ...currentExitNodeData.exitOrderConfig,
      specificQuantity: quantity
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...node.data,
      exitNodeData: {
        ...currentExitNodeData,
        exitOrderConfig: updatedOrderConfig
      }
    });
  }, [node, updateNodeData, defaultExitNodeData]);

  // Get current values from node data with proper type checking
  const currentExitNodeData = nodeData?.exitNodeData as ExitNodeData | undefined;
  const currentExitOrderConfig = currentExitNodeData?.exitOrderConfig || defaultExitNodeData.exitOrderConfig;
  
  // Now safely extract properties from the typed object
  const targetPositionId = currentExitOrderConfig.targetPositionId;
  const quantity = currentExitOrderConfig.quantity || 'all';
  const partialQuantityPercentage = currentExitOrderConfig.partialQuantityPercentage || 50;
  const specificQuantity = currentExitOrderConfig.specificQuantity || 1;
  
  return {
    orderType,
    limitPrice,
    targetPositionId,
    quantity,
    partialQuantityPercentage,
    specificQuantity,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleTargetPositionChange,
    handleQuantityTypeChange,
    handlePartialQuantityChange,
    handleSpecificQuantityChange,
    // Re-entry props
    reEntryEnabled,
    handleReEntryToggle
  };
};
