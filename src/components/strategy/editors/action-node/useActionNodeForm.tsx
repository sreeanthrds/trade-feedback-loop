
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { NodeData } from './types';
import { 
  useInitializeNodeData,
  useStartNodeData,
  useActionNodeHandlers,
  useOptionSettings,
  useOrderType
} from './hooks';

interface UseActionNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useActionNodeForm = ({ node, updateNodeData }: UseActionNodeFormProps) => {
  // Safely cast node data with defaults
  const nodeData = (node.data || {}) as NodeData;
  
  // Initialize node data with default values
  useInitializeNodeData({
    nodeData,
    updateNodeData,
    nodeId: node.id
  });
  
  // Handle start node data and options trading
  const { startNodeSymbol, hasOptionTrading } = useStartNodeData({
    nodeId: node.id,
    updateNodeData,
    initialInstrument: nodeData?.instrument
  });
  
  // Order type related state
  const { showLimitPrice } = useOrderType({
    orderType: nodeData?.orderType
  });
  
  // Action node event handlers
  const {
    handleLabelChange,
    handleActionTypeChange,
    handlePositionTypeChange,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleLotsChange,
    handleProductTypeChange
  } = useActionNodeHandlers({
    nodeId: node.id,
    updateNodeData,
    nodeData
  });
  
  // Options settings handlers
  const {
    handleExpiryChange,
    handleStrikeTypeChange,
    handleStrikeValueChange,
    handleOptionTypeChange
  } = useOptionSettings({
    nodeId: node.id,
    updateNodeData,
    nodeData
  });

  // Force an update when action type changes
  useEffect(() => {
    if (nodeData?.actionType === 'alert' && nodeData?.positionType) {
      // Reset position type when switching to alert
      updateNodeData(node.id, { positionType: undefined });
    }
  }, [nodeData?.actionType, nodeData?.positionType, node.id, updateNodeData]);

  return {
    nodeData,
    showLimitPrice,
    hasOptionTrading,
    startNodeSymbol,
    handleLabelChange,
    handleActionTypeChange,
    handlePositionTypeChange,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleLotsChange,
    handleProductTypeChange,
    handleExpiryChange,
    handleStrikeTypeChange,
    handleStrikeValueChange,
    handleOptionTypeChange
  };
};
