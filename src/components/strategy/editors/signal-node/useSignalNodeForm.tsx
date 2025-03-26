
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
    ? nodeData.conditions.map(cond => {
        // Ensure each condition has all required properties
        return {
          id: cond?.id || `group_${Math.random().toString(36).substr(2, 9)}`,
          groupLogic: cond?.groupLogic || 'AND',
          conditions: Array.isArray(cond?.conditions) ? cond.conditions : []
        };
      })
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
      // Ensure conditions is a valid array before updating node data
      const safeConditions = Array.isArray(conditions) ? conditions : [createEmptyGroupCondition()];
      
      updateNodeData(node.id, { 
        ...nodeData,
        conditions: safeConditions
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [conditions, node.id, nodeData, updateNodeData]);

  // Update local state if node data changes externally
  useEffect(() => {
    const safeNodeData = (node.data || {}) as SignalNodeData;
    
    // Ensure we have valid data for the form
    const safeFormData = {
      label: safeNodeData.label || 'Signal',
      conditions: Array.isArray(safeNodeData.conditions) && safeNodeData.conditions.length > 0
        ? safeNodeData.conditions.map(cond => ({
            id: cond?.id || `group_${Math.random().toString(36).substr(2, 9)}`,
            groupLogic: cond?.groupLogic || 'AND',
            conditions: Array.isArray(cond?.conditions) ? cond.conditions : []
          }))
        : [createEmptyGroupCondition()]
    };
    
    setFormData(safeFormData);
    setConditions(safeFormData.conditions);
  }, [node.id]); // Only when node.id changes, not when nodeData changes

  const updateConditions = useCallback((newConditions: GroupCondition[]) => {
    // Ensure newConditions is always a valid array with valid group conditions
    const safeNewConditions = Array.isArray(newConditions) && newConditions.length > 0
      ? newConditions.map(cond => ({
          id: cond?.id || `group_${Math.random().toString(36).substr(2, 9)}`,
          groupLogic: cond?.groupLogic || 'AND',
          conditions: Array.isArray(cond?.conditions) ? cond.conditions : []
        }))
      : [createEmptyGroupCondition()];
    
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
