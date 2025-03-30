
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

  const signalNodeInfo = "Signal nodes detect specific market conditions to trigger actions in your strategy. Connect them to action nodes like Entry or Exit to execute trades when these conditions are met.";

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      infoTooltip={signalNodeInfo}
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
