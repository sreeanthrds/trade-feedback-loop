
import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitCondition, ExitConditionType, ExitNodeData } from './types';

interface UseExitNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useExitNodeForm = ({ node, updateNodeData }: UseExitNodeFormProps) => {
  // Safely extract the node data
  const nodeData = node.data || {};
  const exitNodeData = nodeData.exitNodeData || {} as ExitNodeData;
  
  // Get initial values with fallbacks
  const initialExitCondition = exitNodeData.exitCondition || { type: 'vpi' } as ExitCondition;
  const initialOrderConfig = exitNodeData.orderConfig || { orderType: 'market' };
  const initialMultipleOrders = exitNodeData.multipleOrders || false;

  // Setup state
  const [exitConditionType, setExitConditionType] = useState<ExitConditionType>(
    initialExitCondition.type as ExitConditionType
  );
  const [exitCondition, setExitCondition] = useState<ExitCondition>(initialExitCondition);
  const [orderType, setOrderType] = useState(initialOrderConfig.orderType);
  const [limitPrice, setLimitPrice] = useState<number | undefined>(initialOrderConfig.limitPrice);
  const [multipleOrders, setMultipleOrders] = useState(initialMultipleOrders);

  // Update exit condition field
  const updateExitConditionField = useCallback((field: string, value: any) => {
    setExitCondition(prev => {
      const updated = { ...prev, [field]: value };
      
      // Update node data
      updateNodeData(node.id, {
        ...nodeData,
        exitNodeData: {
          ...exitNodeData,
          exitCondition: updated
        }
      });
      
      return updated;
    });
  }, [exitNodeData, nodeData, node.id, updateNodeData]);

  // Handle exit condition type change
  const handleExitConditionTypeChange = useCallback((type: string) => {
    const newType = type as ExitConditionType;
    setExitConditionType(newType);
    
    // Create a new exit condition based on the type
    let newExitCondition: ExitCondition;
    
    switch (newType) {
      case 'vpi':
      case 'vpt':
        newExitCondition = { type: newType, identifier: '' };
        break;
      case 'all_positions':
        newExitCondition = { type: newType };
        break;
      case 'realized_pnl':
      case 'unrealized_pnl':
        newExitCondition = { type: newType, value: 0, direction: 'above' };
        break;
      case 'premium_change':
      case 'position_value_change':
        newExitCondition = { type: newType, percentage: 10, direction: 'increase' };
        break;
      case 'price_target':
        newExitCondition = { type: newType, price: 0, direction: 'above' };
        break;
      case 'indicator_underlying':
      case 'indicator_contract':
        newExitCondition = { type: newType, indicator: 'RSI', condition: 'above', value: 70 };
        break;
      case 'time_based':
        newExitCondition = { type: newType, minutes: 30 };
        break;
      case 'market_close':
        newExitCondition = { type: newType, minutesBefore: 15 };
        break;
      case 'limit_to_market':
        newExitCondition = { type: newType, waitSeconds: 60 };
        break;
      case 'rolling':
        newExitCondition = { type: newType, daysBeforeExpiry: 2, strikeDifference: 0 };
        break;
      default:
        newExitCondition = { type: newType };
    }
    
    setExitCondition(newExitCondition);
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: {
        ...exitNodeData,
        exitCondition: newExitCondition
      }
    });
  }, [exitNodeData, nodeData, node.id, updateNodeData]);

  // Handle order type change
  const handleOrderTypeChange = useCallback((type: string) => {
    setOrderType(type as 'market' | 'limit');
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: {
        ...exitNodeData,
        orderConfig: {
          ...exitNodeData.orderConfig,
          orderType: type
        }
      }
    });
  }, [exitNodeData, nodeData, node.id, updateNodeData]);

  // Handle limit price change
  const handleLimitPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setLimitPrice(value);
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: {
        ...exitNodeData,
        orderConfig: {
          ...exitNodeData.orderConfig,
          limitPrice: value
        }
      }
    });
  }, [exitNodeData, nodeData, node.id, updateNodeData]);

  // Handle multiple orders toggle
  const handleMultipleOrdersToggle = useCallback((checked: boolean) => {
    setMultipleOrders(checked);
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: {
        ...exitNodeData,
        multipleOrders: checked
      }
    });
  }, [exitNodeData, nodeData, node.id, updateNodeData]);

  // Sync state with node data when it changes externally
  useEffect(() => {
    const currentExitNodeData = nodeData.exitNodeData || {} as ExitNodeData;
    const currentExitCondition = currentExitNodeData.exitCondition || { type: 'vpi' } as ExitCondition;
    const currentOrderConfig = currentExitNodeData.orderConfig || { orderType: 'market' };
    
    setExitConditionType(currentExitCondition.type as ExitConditionType);
    setExitCondition(currentExitCondition);
    setOrderType(currentOrderConfig.orderType);
    setLimitPrice(currentOrderConfig.limitPrice);
    setMultipleOrders(currentExitNodeData.multipleOrders || false);
  }, [nodeData]);

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
