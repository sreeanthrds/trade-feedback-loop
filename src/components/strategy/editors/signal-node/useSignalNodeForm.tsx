
import { useState, useEffect, useCallback, useRef } from 'react';
import { Node } from '@xyflow/react';
import { GroupCondition } from '../../utils/conditionTypes';

interface UseSignalNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface SignalNodeFormData {
  label: string;
  conditions: GroupCondition[];
  exitConditions: GroupCondition[];
}

interface SignalNodeData {
  label?: string;
  conditions?: GroupCondition[];
  exitConditions?: GroupCondition[];
}

export const useSignalNodeForm = ({ node, updateNodeData }: UseSignalNodeFormProps) => {
  // Safely cast node.data with default fallback
  const nodeData = (node.data || {}) as SignalNodeData;
  
  // Initialize complex conditions data structure if it doesn't exist
  const initialConditions: GroupCondition[] = Array.isArray(nodeData.conditions) 
    ? nodeData.conditions
    : [
        {
          id: 'root',
          groupLogic: 'AND',
          conditions: []
        }
      ];
  
  // Initialize exit conditions data structure if it doesn't exist
  const initialExitConditions: GroupCondition[] = Array.isArray(nodeData.exitConditions) 
    ? nodeData.exitConditions
    : [
        {
          id: 'exit-root',
          groupLogic: 'AND',
          conditions: []
        }
      ];
  
  const [conditions, setConditions] = useState<GroupCondition[]>(initialConditions);
  const [exitConditions, setExitConditions] = useState<GroupCondition[]>(initialExitConditions);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  const [formData, setFormData] = useState<SignalNodeFormData>({
    label: nodeData.label || 'Signal',
    conditions: conditions,
    exitConditions: exitConditions
  });

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFormData(prev => ({ ...prev, label: newValue }));
    
    // Prevent multiple rapid updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      updateNodeData(node.id, { ...nodeData, label: newValue });
      updateTimeoutRef.current = null;
    }, 300);
  }, [node.id, nodeData, updateNodeData]);

  // Update node data when conditions change - use debounce to avoid excessive updates
  useEffect(() => {
    // Skip updates while already updating
    if (isUpdatingRef.current) return;
    
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      isUpdatingRef.current = true;
      
      updateNodeData(node.id, { 
        ...nodeData,
        conditions: conditions,
        exitConditions: exitConditions
      });
      
      // Reset update flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
      
      updateTimeoutRef.current = null;
    }, 300);
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [conditions, exitConditions, node.id, nodeData, updateNodeData]);

  // Update local state if node data changes externally
  useEffect(() => {
    const safeNodeData = (node.data || {}) as SignalNodeData;
    
    // Only update if not already updating to prevent loops
    if (!isUpdatingRef.current) {
      setFormData({
        label: safeNodeData.label || 'Signal',
        conditions: conditions,
        exitConditions: exitConditions
      });
      
      if (Array.isArray(safeNodeData.conditions)) {
        setConditions(safeNodeData.conditions);
      }
      
      if (Array.isArray(safeNodeData.exitConditions)) {
        setExitConditions(safeNodeData.exitConditions);
      }
    }
  }, [node.data?.label]);

  const updateConditions = useCallback((newConditions: GroupCondition[]) => {
    setConditions(newConditions);
    setFormData(prev => ({ ...prev, conditions: newConditions }));
  }, []);

  const updateExitConditions = useCallback((newConditions: GroupCondition[]) => {
    setExitConditions(newConditions);
    setFormData(prev => ({ ...prev, exitConditions: newConditions }));
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    formData,
    conditions,
    exitConditions,
    handleLabelChange,
    updateConditions,
    updateExitConditions
  };
};
