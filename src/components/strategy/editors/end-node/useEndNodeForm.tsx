
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';

interface UseEndNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface EndNodeFormData {
  label: string;
}

export const useEndNodeForm = ({ node, updateNodeData }: UseEndNodeFormProps) => {
  const [formData, setFormData] = useState<EndNodeFormData>({
    label: node.data?.label || 'End',
  });

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFormData(prev => ({ ...prev, label: newValue }));
    updateNodeData(node.id, { label: newValue });
  };

  // Update local state if node data changes externally
  useEffect(() => {
    setFormData({
      label: node.data?.label || 'End',
    });
  }, [node.data?.label]);

  return {
    formData,
    handleLabelChange,
  };
};
