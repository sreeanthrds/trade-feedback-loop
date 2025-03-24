
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useSignalNodeForm } from './signal-node/useSignalNodeForm';
import SignalNodeContent from './signal-node/SignalNodeContent';

interface SignalNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const SignalNodeEditor = ({ node, updateNodeData }: SignalNodeEditorProps) => {
  const { 
    formData, 
    conditions, 
    handleLabelChange, 
    updateConditions 
  } = useSignalNodeForm({ node, updateNodeData });

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      additionalContent={
        <SignalNodeContent
          conditions={conditions}
          updateConditions={updateConditions}
        />
      }
    />
  );
};

export default SignalNodeEditor;
