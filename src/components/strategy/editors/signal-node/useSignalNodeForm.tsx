
import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { GroupCondition, createEmptyGroupCondition } from '../../utils/conditionTypes';

interface UseSignalNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface SignalNodeFormData {
  label: string;
  conditions: GroupCondition[];
}

interface SignalNodeData {
  label?: string;
  conditions?: GroupCondition[];
}

export const useSignalNodeForm = ({ node, updateNodeData }: UseSignalNodeFormProps) => {
  // Safely cast node.data with default fallback
  const nodeData = (node.data || {}) as SignalNodeData;
  
  // Initialize complex conditions data structure if it doesn't exist
  const initialConditions: GroupCondition[] = Array.isArray(nodeData.conditions) && nodeData.conditions.length > 0
    ? nodeData.conditions
    : [createEmptyGroupCondition()];
  
  const [conditions, setConditions] = useState<GroupCondition[]>(initialConditions);

  const [formData, setFormData] = useState<SignalNodeFormData>({
    label: nodeData.label || 'Signal',
    conditions: conditions
  });

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFormData(prev => ({ ...prev, label: newValue }));
    updateNodeData(node.id, { ...nodeData, label: newValue });
  }, [node.id, nodeData, updateNodeData]);

  // Update node data when conditions change - use useCallback to memoize this function
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeData(node.id, { 
        ...nodeData,
        conditions: conditions
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [conditions, node.id, nodeData, updateNodeData]);

  // Update local state if node data changes externally
  useEffect(() => {
    const safeNodeData = (node.data || {}) as SignalNodeData;
    setFormData({
      label: safeNodeData.label || 'Signal',
      conditions: Array.isArray(safeNodeData.conditions) ? safeNodeData.conditions : [createEmptyGroupCondition()]
    });
    
    if (Array.isArray(safeNodeData.conditions) && safeNodeData.conditions.length > 0) {
      setConditions(safeNodeData.conditions);
    }
  }, [node.data?.label, node.data?.conditions]);

  const updateConditions = useCallback((newConditions: GroupCondition[]) => {
    // Ensure newConditions is always a valid array
    const safeNewConditions = Array.isArray(newConditions) ? newConditions : [createEmptyGroupCondition()];
    setConditions(safeNewConditions);
    setFormData(prev => ({ ...prev, conditions: safeNewConditions }));
  }, []);

  return {
    formData,
    conditions,
    handleLabelChange,
    updateConditions
  };
};
