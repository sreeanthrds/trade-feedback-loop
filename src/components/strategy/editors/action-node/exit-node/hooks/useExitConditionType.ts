
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { 
  ExitConditionType, 
  ExitCondition,
  ExitNodeData
} from '../types';

interface UseExitConditionTypeProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  setExitConditionType: (type: ExitConditionType) => void;
  setExitCondition: (condition: ExitCondition) => void;
  defaultExitNodeData: ExitNodeData;
}

export const useExitConditionType = ({
  node,
  updateNodeData,
  setExitConditionType,
  setExitCondition,
  defaultExitNodeData
}: UseExitConditionTypeProps) => {
  // Update exit condition type
  const handleExitConditionTypeChange = useCallback((type: ExitConditionType) => {
    setExitConditionType(type);
    
    // Create default condition for the new type
    let newCondition: ExitCondition;
    
    switch (type) {
      case 'vpi':
      case 'vpt':
        newCondition = { type, identifier: '' } as ExitCondition;
        break;
      case 'all_positions':
        newCondition = { type } as ExitCondition;
        break;
      case 'realized_pnl':
      case 'unrealized_pnl':
        newCondition = { type, value: 100, direction: 'above' } as ExitCondition;
        break;
      case 'premium_change':
      case 'position_value_change':
        newCondition = { type, percentage: 10, direction: 'increase' } as ExitCondition;
        break;
      case 'price_target':
        newCondition = { type, price: 0, direction: 'above' } as ExitCondition;
        break;
      case 'indicator_underlying':
      case 'indicator_contract':
        newCondition = { type, indicator: 'RSI', condition: 'above', value: 70 } as ExitCondition;
        break;
      case 'time_based':
        newCondition = { type, minutes: 30 } as ExitCondition;
        break;
      case 'market_close':
        newCondition = { type, minutesBefore: 15 } as ExitCondition;
        break;
      case 'limit_to_market':
        newCondition = { type, waitSeconds: 60 } as ExitCondition;
        break;
      case 'rolling':
        newCondition = { type, daysBeforeExpiry: 2 } as ExitCondition;
        break;
      default:
        newCondition = { type: 'all_positions' } as ExitCondition;
    }
    
    setExitCondition(newCondition);
    
    // Get current exit node data with type safety
    const nodeData = node.data || {};
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
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
  }, [node.id, node.data, updateNodeData, defaultExitNodeData, setExitConditionType, setExitCondition]);
  
  return {
    handleExitConditionTypeChange
  };
};
