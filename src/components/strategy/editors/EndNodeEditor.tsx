
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel, InfoBox } from './shared';

interface EndNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface NodeData {
  label?: string;
}

const EndNodeEditor = ({ node, updateNodeData }: EndNodeEditorProps) => {
  const nodeData = node.data as NodeData | undefined;
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  return (
    <NodeDetailsPanel
      nodeLabel={nodeData?.label || 'End'}
      onLabelChange={handleLabelChange}
      additionalContent={
        <InfoBox>
          <p className="mb-2">
            The End Node represents the final state of your strategy. Any path that reaches this node will terminate.
          </p>
          <p>
            Use multiple End nodes to represent different outcomes or exit conditions.
          </p>
        </InfoBox>
      }
    />
  );
};

export default EndNodeEditor;
