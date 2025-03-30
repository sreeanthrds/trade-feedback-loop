
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitNodeData, ExitOrderConfig } from '../types';

interface UseMultipleOrdersProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  multipleOrders: boolean;
  setMultipleOrders: (value: boolean) => void;
  defaultExitNodeData: ExitNodeData;
}

export const useMultipleOrders = ({
  node,
  updateNodeData,
  multipleOrders,
  setMultipleOrders,
  defaultExitNodeData
}: UseMultipleOrdersProps) => {
  // Toggle multiple orders
  const handleMultipleOrdersToggle = useCallback(() => {
    const newValue = !multipleOrders;
    setMultipleOrders(newValue);
    
    const nodeData = node.data || {};
    // Get current exit node data safely
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
    // Determine orders array based on exitOrderConfig to ensure we have it
    const ordersArray = newValue && !currentExitNodeData.orders 
      ? [currentExitNodeData.exitOrderConfig] 
      : currentExitNodeData.orders;
    
    // Create updated exit node data
    const updatedExitNodeData: ExitNodeData = {
      ...currentExitNodeData,
      multipleOrders: newValue,
      // Include orders array only if multiple orders is enabled
      ...(newValue ? { orders: ordersArray } : {})
    };
    
    // Update node data
    updateNodeData(node.id, {
      ...nodeData,
      exitNodeData: updatedExitNodeData
    });
  }, [multipleOrders, node.id, node.data, updateNodeData, defaultExitNodeData, setMultipleOrders]);
  
  return {
    handleMultipleOrdersToggle
  };
};
