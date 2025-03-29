
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Node } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { 
  ExitConditionType, 
  ExitOrderType, 
  ExitCondition, 
  ExitOrderConfig,
  ExitNodeData
} from '../exit-node/types';

interface UseExitNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useExitNodeForm = ({ node, updateNodeData }: UseExitNodeFormProps) => {
  // Default exit node data if none exists
  const defaultExitNodeData = useMemo(() => ({
    exitCondition: {
      type: 'all_positions' as ExitConditionType
    },
    orderConfig: {
      orderType: 'market' as ExitOrderType
    }
  }), []);

  // Get exit node data from node or use default
  const nodeData = node.data || {};
  const rawExitNodeData = nodeData.exitNodeData as ExitNodeData | null || null;
  
  // Track if we've done initialization
  const initializedRef = useRef(false);
  
  // Initialize with a properly typed version of the data
  const initialExitNodeData = useMemo(() => {
    if (rawExitNodeData) {
      return {
        exitCondition: rawExitNodeData.exitCondition || defaultExitNodeData.exitCondition,
        orderConfig: rawExitNodeData.orderConfig || defaultExitNodeData.orderConfig,
        multipleOrders: rawExitNodeData.multipleOrders || false,
        orders: rawExitNodeData.orders || undefined
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
    initialExitNodeData.exitCondition || { type: 'all_positions' }
  );
  
  // Initialize node data only once if needed
  useEffect(() => {
    if (!initializedRef.current && !nodeData.exitNodeData) {
      initializedRef.current = true;
      
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: defaultExitNodeData
      });
    }
  }, [node.id, nodeData, updateNodeData]); // Remove defaultExitNodeData from dependencies
  
  // Update exit condition type
  const handleExitConditionTypeChange = useCallback((type: ExitConditionType) => {
    setExitConditionType(type);
    
    // Create default condition for the new type
    let newCondition: ExitCondition;
    
    switch (type) {
      case 'vpi':
      case 'vpt':
        newCondition = { type, identifier: '' };
        break;
      case 'all_positions':
        newCondition = { type };
        break;
      case 'realized_pnl':
      case 'unrealized_pnl':
        newCondition = { type, value: 100, direction: 'above' };
        break;
      case 'premium_change':
      case 'position_value_change':
        newCondition = { type, percentage: 10, direction: 'increase' };
        break;
      case 'price_target':
        newCondition = { type, price: 0, direction: 'above' };
        break;
      case 'indicator_underlying':
      case 'indicator_contract':
        newCondition = { type, indicator: 'RSI', condition: 'above', value: 70 };
        break;
      case 'time_based':
        newCondition = { type, minutes: 30 };
        break;
      case 'market_close':
        newCondition = { type, minutesBefore: 15 };
        break;
      case 'limit_to_market':
        newCondition = { type, waitSeconds: 60 };
        break;
      case 'rolling':
        newCondition = { type, daysBeforeExpiry: 2 };
        break;
      default:
        newCondition = { type: 'all_positions' };
    }
    
    setExitCondition(newCondition);
    
    // Create updated exit node data with type safety
    const currentExitNodeData = nodeData.exitNodeData as ExitNodeData || defaultExitNodeData;
    
    // Create updated object
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      exitCondition: newCondition
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [nodeData, node.id, updateNodeData, defaultExitNodeData]);
  
  // Update order type
  const handleOrderTypeChange = useCallback((type: ExitOrderType) => {
    setOrderType(type);
    
    // Get current exit node data safely
    const currentExitNodeData = nodeData.exitNodeData as ExitNodeData || defaultExitNodeData;
    
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
  }, [nodeData, node.id, updateNodeData, defaultExitNodeData]);
  
  // Update limit price
  const handleLimitPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLimitPrice(isNaN(value) ? undefined : value);
    
    if (!isNaN(value)) {
      // Get current exit node data safely
      const currentExitNodeData = nodeData.exitNodeData as ExitNodeData || defaultExitNodeData;
      
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
  }, [nodeData, node.id, updateNodeData, defaultExitNodeData]);
  
  // Toggle multiple orders
  const handleMultipleOrdersToggle = useCallback(() => {
    const newValue = !multipleOrders;
    setMultipleOrders(newValue);
    
    // Get current exit node data safely
    const currentExitNodeData = nodeData.exitNodeData as ExitNodeData || defaultExitNodeData;
    
    // Determine orders array
    const ordersArray = newValue && !currentExitNodeData.orders 
      ? [currentExitNodeData.orderConfig] 
      : currentExitNodeData.orders;
    
    // Create updated exit node data
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      multipleOrders: newValue,
      // Include orders array only if multiple orders is enabled
      ...(newValue && { orders: ordersArray })
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [multipleOrders, nodeData, node.id, updateNodeData, defaultExitNodeData]);
  
  // Update exit condition field
  const updateExitConditionField = useCallback((field: string, value: any) => {
    // Create a new object to avoid mutating the original
    const updatedCondition = {
      ...exitCondition,
      [field]: value
    };
    
    setExitCondition(updatedCondition);
    
    // Get current exit node data safely
    const currentExitNodeData = nodeData.exitNodeData as ExitNodeData || defaultExitNodeData;
    
    // Create updated exit node data
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      exitCondition: updatedCondition
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [exitCondition, nodeData, node.id, updateNodeData, defaultExitNodeData]);
  
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
