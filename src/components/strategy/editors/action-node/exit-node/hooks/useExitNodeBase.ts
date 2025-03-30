
import { useState, useRef, useMemo } from 'react';
import { Node } from '@xyflow/react';
import { 
  ExitConditionType, 
  ExitOrderType, 
  ExitCondition, 
  ExitOrderConfig,
  ExitNodeData
} from '../types';

interface UseExitNodeBaseProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useExitNodeBase = ({ node, updateNodeData }: UseExitNodeBaseProps) => {
  // Default exit node data - memoized to avoid recreation on each render
  const defaultExitNodeData = useMemo<ExitNodeData>(() => ({
    exitOrderConfig: {
      orderType: 'market' as ExitOrderType,
      limitPrice: undefined
    },
    // Include these for backward compatibility
    exitCondition: {
      type: 'all_positions' as ExitConditionType
    } as ExitCondition,
    orderConfig: {
      orderType: 'market' as ExitOrderType,
      limitPrice: undefined
    }
  }), []);

  // Get exit node data from node or use default
  const nodeData = node.data || {};
  const rawExitNodeData = (nodeData.exitNodeData as ExitNodeData | null) || null;
  
  // Track if we've done initialization
  const initializedRef = useRef(false);
  
  // Initialize with a properly typed version of the data
  const initialExitNodeData = useMemo<ExitNodeData>(() => {
    if (rawExitNodeData) {
      return {
        exitOrderConfig: rawExitNodeData.exitOrderConfig || defaultExitNodeData.exitOrderConfig,
        multipleOrders: rawExitNodeData.multipleOrders || false,
        orders: rawExitNodeData.orders || undefined,
        // Include these for backward compatibility
        exitCondition: rawExitNodeData.exitCondition || defaultExitNodeData.exitCondition,
        orderConfig: rawExitNodeData.orderConfig || defaultExitNodeData.orderConfig
      };
    }
    return defaultExitNodeData;
  }, [rawExitNodeData, defaultExitNodeData]);
  
  // State for exit node form
  const [exitConditionType, setExitConditionType] = useState<ExitConditionType>(
    initialExitNodeData.exitCondition?.type || 'all_positions'
  );
  
  const [orderType, setOrderType] = useState<ExitOrderType>(
    initialExitNodeData.orderConfig?.orderType || 'market'
  );
  
  const [limitPrice, setLimitPrice] = useState<number | undefined>(
    initialExitNodeData.orderConfig?.limitPrice
  );
  
  const [multipleOrders, setMultipleOrders] = useState<boolean>(
    initialExitNodeData.multipleOrders || false
  );
  
  const [exitCondition, setExitCondition] = useState<ExitCondition>(
    initialExitNodeData.exitCondition || { type: 'all_positions' } as ExitCondition
  );

  return {
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
  };
};
