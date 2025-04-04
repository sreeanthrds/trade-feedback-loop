
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useEndNodeForm } from './end-node/useEndNodeForm';

interface EndNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const EndNodeEditor = ({ node, updateNodeData }: EndNodeEditorProps) => {
  const { formData, handleLabelChange } = useEndNodeForm({ node, updateNodeData });
  
  const endNodeInfo = "The End Node represents the final state of your strategy. Any path that reaches this node will terminate. Use multiple End nodes to represent different outcomes or exit conditions.";

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      infoTooltip={endNodeInfo}
      additionalContent={null}
    />
  );
};

export default EndNodeEditor;
