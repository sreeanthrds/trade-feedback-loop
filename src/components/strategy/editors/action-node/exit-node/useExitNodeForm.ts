
import { Node } from '@xyflow/react';
import { 
  ExitConditionType, 
  ExitOrderType, 
  ExitCondition, 
  ExitNodeData
} from './types';
import {
  useExitNodeBase,
  useExitNodeInitialization,
  useExitConditionType,
  useOrderSettings,
  useMultipleOrders,
  useExitConditionField
} from './hooks';

interface UseExitNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useExitNodeForm = ({ node, updateNodeData }: UseExitNodeFormProps) => {
  // Use base hook for state management
  const {
    nodeData,
    defaultExitNodeData,
    initializedRef,
    exitConditionType,
    setExitConditionType,
    orderType,
    setOrderType,
    limitPrice,
    setLimitPrice,
    multipleOrders,
    setMultipleOrders,
    exitCondition,
    setExitCondition
  } = useExitNodeBase({ node, updateNodeData });
  
  // Use initialization hook
  useExitNodeInitialization({
    node,
    updateNodeData,
    initializedRef,
    defaultExitNodeData
  });
  
  // Use condition type hook
  const { handleExitConditionTypeChange } = useExitConditionType({
    node,
    updateNodeData,
    setExitConditionType,
    setExitCondition,
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
  
  // Use exit condition field hook
  const { updateExitConditionField } = useExitConditionField({
    node,
    updateNodeData,
    exitCondition,
    setExitCondition,
    defaultExitNodeData
  });
  
  return {
    exitConditionType,
    orderType,
    limitPrice,
    multipleOrders,
    exitCondition,
    handleExitConditionTypeChange,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleMultipleOrdersToggle,
    updateExitConditionField
  };
};
