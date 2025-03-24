
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { GroupCondition } from '../../utils/conditionTypes';

interface UseSignalNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface SignalNodeFormData {
  label: string;
  conditions: GroupCondition[];
}

export const useSignalNodeForm = ({ node, updateNodeData }: UseSignalNodeFormProps) => {
  const nodeData = node.data || {};
  
  // Initialize complex conditions data structure if it doesn't exist
  const [conditions, setConditions] = useState<GroupCondition[]>(
    nodeData.conditions || [
      {
        id: 'root',
        groupLogic: 'AND',
        conditions: []
      }
    ]
  );

  const [formData, setFormData] = useState<SignalNodeFormData>({
    label: nodeData.label || 'Signal',
    conditions: conditions
  });

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFormData(prev => ({ ...prev, label: newValue }));
    updateNodeData(node.id, { ...nodeData, label: newValue });
  };

  // Update node data when conditions change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeData(node.id, { 
        ...nodeData,
        conditions: conditions
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [conditions]);

  // Update local state if node data changes externally
  useEffect(() => {
    setFormData({
      label: nodeData.label || 'Signal',
      conditions: nodeData.conditions || conditions
    });
    
    if (nodeData.conditions) {
      setConditions(nodeData.conditions);
    }
  }, [nodeData.label]);

  const updateConditions = (newConditions: GroupCondition[]) => {
    setConditions(newConditions);
    setFormData(prev => ({ ...prev, conditions: newConditions }));
  };

  return {
    formData,
    conditions,
    handleLabelChange,
    updateConditions
  };
};
