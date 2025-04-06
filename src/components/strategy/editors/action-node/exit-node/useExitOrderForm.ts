
import { Node } from '@xyflow/react';
import { 
  ExitOrderType, 
  ExitNodeData
} from './types';
import {
  useExitNodeBase,
  useExitNodeInitialization,
  useOrderSettings,
  useMultipleOrders,
} from './hooks';
import { useReEntrySettings } from './hooks/useReEntrySettings';

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
    multipleOrders,
    setMultipleOrders,
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
  
  // Use multiple orders hook
  const { handleMultipleOrdersToggle } = useMultipleOrders({
    node,
    updateNodeData,
    multipleOrders,
    setMultipleOrders,
    defaultExitNodeData
  });
  
  // Use re-entry settings
  const { reEntryEnabled, handleReEntryToggle } = useReEntrySettings({
    node,
    updateNodeData,
    nodeData,
    defaultExitNodeData
  });
  
  return {
    orderType,
    limitPrice,
    multipleOrders,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleMultipleOrdersToggle,
    // Add re-entry props
    reEntryEnabled,
    handleReEntryToggle
  };
};
