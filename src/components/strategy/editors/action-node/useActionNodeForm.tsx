
import { useState } from 'react';
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
  const nodeData = node.data as NodeData;
  
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
