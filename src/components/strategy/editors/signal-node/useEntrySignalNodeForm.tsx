
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { GroupCondition } from '../../utils/conditionTypes';

interface UseEntrySignalNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useEntrySignalNodeForm = ({ node, updateNodeData }: UseEntrySignalNodeFormProps) => {
  const [formData, setFormData] = useState({
    label: node.data?.label || 'Entry Signal'
  });

  // Ensure we have at least one condition group
  const [conditions, setConditions] = useState<GroupCondition[]>(
    node.data?.conditions && Array.isArray(node.data.conditions) 
      ? node.data.conditions 
      : [{
          id: `entry-root-${uuidv4().substring(0, 8)}`,
          groupLogic: 'AND' as const,
          conditions: []
        }]
  );

  // Update node data when form data changes
  useEffect(() => {
    updateNodeData(node.id, { 
      ...node.data,
      label: formData.label,
      conditions
    });
  }, [formData, conditions, node.id, node.data, updateNodeData]);

  // Handle label change
  const handleLabelChange = (newLabel: string) => {
    setFormData(prev => ({ ...prev, label: newLabel }));
  };

  // Update conditions
  const updateConditions = (updatedConditions: GroupCondition[]) => {
    setConditions(updatedConditions);
  };

  return {
    formData,
    conditions,
    handleLabelChange,
    updateConditions
  };
};
