
import { useState, useCallback, useEffect, useRef } from 'react';
import { Node } from '@xyflow/react';
import { toast } from "@/hooks/use-toast";
import { 
  ExitConditionType, 
  ExitOrderType, 
  ExitCondition, 
  ExitOrderConfig,
  ExitNodeData
} from '../types/exitNodeTypes';

interface UseExitNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useExitNodeForm = ({ node, updateNodeData }: UseExitNodeFormProps) => {
  // Default exit node data if none exists
  const defaultExitNodeData: ExitNodeData = {
    exitCondition: {
      type: 'all_positions'
    },
    orderConfig: {
      orderType: 'market'
    }
  };

  // Get exit node data from node or use default
  const nodeData = node.data || {};
  const rawExitNodeData = nodeData.exitNodeData || null;
  const exitNodeData: ExitNodeData = rawExitNodeData || defaultExitNodeData;
  
  // Refs to prevent infinite loops
  const initializedRef = useRef(false);
  
  // State for exit node form
  const [exitConditionType, setExitConditionType] = useState<ExitConditionType>(
    exitNodeData.exitCondition?.type || 'all_positions'
  );
  
  const [orderType, setOrderType] = useState<ExitOrderType>(
    exitNodeData.orderConfig?.orderType || 'market'
  );
  
  const [limitPrice, setLimitPrice] = useState<number | undefined>(
    exitNodeData.orderConfig?.limitPrice
  );
  
  const [multipleOrders, setMultipleOrders] = useState<boolean>(
    exitNodeData.multipleOrders || false
  );
  
  const [exitCondition, setExitCondition] = useState<ExitCondition>(
    exitNodeData.exitCondition || { type: 'all_positions' }
  );
  
  // Initialize node data if needed - only run once
  useEffect(() => {
    if (!initializedRef.current && !nodeData.exitNodeData) {
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: defaultExitNodeData
      });
      initializedRef.current = true;
    }
  }, [nodeData, node.id, updateNodeData]);
  
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
    
    // Create a properly typed updated object
    const currentExitNodeData = nodeData.exitNodeData || defaultExitNodeData;
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      exitCondition: newCondition
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [nodeData, node.id, updateNodeData]);
  
  // Update order type
  const handleOrderTypeChange = useCallback((type: ExitOrderType) => {
    setOrderType(type);
    
    // Get current config or default
    const currentExitNodeData = nodeData.exitNodeData || defaultExitNodeData;
    const currentOrderConfig = currentExitNodeData.orderConfig || { orderType: 'market' };
    
    const updatedOrderConfig: ExitOrderConfig = {
      ...currentOrderConfig,
      orderType: type,
      // Clear limit price if switching to market order
      ...(type === 'market' && { limitPrice: undefined })
    };
    
    // Update node data
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      orderConfig: updatedOrderConfig
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [nodeData, node.id, updateNodeData]);
  
  // Update limit price
  const handleLimitPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLimitPrice(isNaN(value) ? undefined : value);
    
    if (!isNaN(value)) {
      // Get current config or default
      const currentExitNodeData = nodeData.exitNodeData || defaultExitNodeData;
      const currentOrderConfig = currentExitNodeData.orderConfig || { orderType: 'market' };
      
      const updatedOrderConfig: ExitOrderConfig = {
        ...currentOrderConfig,
        limitPrice: value
      };
      
      // Update node data
      const updatedExitNodeData: ExitNodeData = {
        ...currentExitNodeData,
        orderConfig: updatedOrderConfig
      };
      
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: updatedExitNodeData
      });
    }
  }, [nodeData, node.id, updateNodeData]);
  
  // Toggle multiple orders
  const handleMultipleOrdersToggle = useCallback(() => {
    const newValue = !multipleOrders;
    setMultipleOrders(newValue);
    
    // Get current data or default
    const currentExitNodeData = nodeData.exitNodeData || defaultExitNodeData;
    
    // Update node data
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      multipleOrders: newValue,
      // Initialize orders array if enabling multiple orders
      orders: newValue && !currentExitNodeData.orders 
        ? [currentExitNodeData.orderConfig || { orderType: 'market' }] 
        : currentExitNodeData.orders
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [multipleOrders, nodeData, node.id, updateNodeData]);
  
  // Update exit condition field
  const updateExitConditionField = useCallback((field: string, value: any) => {
    const updatedCondition = {
      ...exitCondition,
      [field]: value
    };
    
    setExitCondition(updatedCondition);
    
    // Get current data or default
    const currentExitNodeData = nodeData.exitNodeData || defaultExitNodeData;
    
    // Update node data
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      exitCondition: updatedCondition
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [exitCondition, nodeData, node.id, updateNodeData]);
  
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
