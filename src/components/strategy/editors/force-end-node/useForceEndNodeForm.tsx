
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';

interface UseForceEndNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface ForceEndNodeFormData {
  label: string;
  closeAll: boolean;
  message: string;
}

export const useForceEndNodeForm = ({ node, updateNodeData }: UseForceEndNodeFormProps) => {
  const [formData, setFormData] = useState<ForceEndNodeFormData>({
    label: node.data?.label || 'Force End',
    closeAll: node.data?.closeAll !== false,
    message: node.data?.message || '',
  });

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFormData(prev => ({ ...prev, label: newValue }));
    updateNodeData(node.id, { ...node.data, label: newValue });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFormData(prev => ({ ...prev, message: newValue }));
    updateNodeData(node.id, { ...node.data, message: newValue });
  };

  const handleCloseAllChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, closeAll: checked }));
    updateNodeData(node.id, { ...node.data, closeAll: checked });
  };

  // Update local state if node data changes externally
  useEffect(() => {
    setFormData({
      label: node.data?.label || 'Force End',
      closeAll: node.data?.closeAll !== false,
      message: node.data?.message || '',
    });
  }, [node.data]);

  return {
    formData,
    handleLabelChange,
    handleMessageChange,
    handleCloseAllChange,
  };
};
