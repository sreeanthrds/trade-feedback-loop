
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useEndNodeForm } from './end-node/useEndNodeForm';
import EndNodeInfoContent from './end-node/EndNodeInfoContent';

interface EndNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const EndNodeEditor = ({ node, updateNodeData }: EndNodeEditorProps) => {
  const { formData, handleLabelChange } = useEndNodeForm({ node, updateNodeData });

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      additionalContent={<EndNodeInfoContent />}
    />
  );
};

export default EndNodeEditor;
