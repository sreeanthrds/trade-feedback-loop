
import { useCallback } from 'react';
import { Node } from '@xyflow/react';
import { 
  ExitCondition,
  ExitNodeData
} from '../types';

interface UseExitConditionFieldProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  exitCondition: ExitCondition;
  setExitCondition: (condition: ExitCondition) => void;
  defaultExitNodeData: ExitNodeData;
}

export const useExitConditionField = ({
  node,
  updateNodeData,
  exitCondition,
  setExitCondition,
  defaultExitNodeData
}: UseExitConditionFieldProps) => {
  // Update exit condition field
  const updateExitConditionField = useCallback((field: string, value: any) => {
    // Create a new object to avoid mutating the original
    const updatedCondition = {
      ...exitCondition,
      [field]: value
    } as ExitCondition;
    
    setExitCondition(updatedCondition);
    
    const nodeData = node.data || {};
    // Get current exit node data safely
    const currentExitNodeData = (nodeData.exitNodeData as ExitNodeData) || defaultExitNodeData;
    
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
  }, [exitCondition, node.id, node.data, updateNodeData, defaultExitNodeData, setExitCondition]);
  
  return {
    updateExitConditionField
  };
};
