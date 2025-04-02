
import { useState, useRef } from 'react';
import { ExitCondition, ExitConditionType, ExitOrderType, ExitNodeData } from '../types';
import { useExitNodeDefaults } from './useExitNodeDefaults';

interface UseExitNodeStateProps {
  nodeData: any;
}

/**
 * Hook to manage state for exit node
 */
export const useExitNodeState = ({ nodeData }: UseExitNodeStateProps) => {
  // Get default data
  const { defaultExitNodeData } = useExitNodeDefaults();
  
  // Track if we've done initialization
  const initializedRef = useRef(false);
  
  // Get raw exit node data from node or use default
  const rawExitNodeData = (nodeData.exitNodeData as ExitNodeData | undefined) || defaultExitNodeData;
  
  // Initialize state with existing data or defaults
  const [exitConditionType, setExitConditionType] = useState<ExitConditionType>(
    rawExitNodeData.exitCondition?.type || 'all_positions'
  );
  
  const [orderType, setOrderType] = useState<ExitOrderType>(
    rawExitNodeData.orderConfig?.orderType || 'market'
  );
  
  const [limitPrice, setLimitPrice] = useState<number | undefined>(
    rawExitNodeData.orderConfig?.limitPrice
  );
  
  const [multipleOrders, setMultipleOrders] = useState<boolean>(
    rawExitNodeData.multipleOrders || false
  );
  
  const [exitCondition, setExitCondition] = useState<ExitCondition>(
    rawExitNodeData.exitCondition || { type: 'all_positions' } as ExitCondition
  );

  return {
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
  };
};
