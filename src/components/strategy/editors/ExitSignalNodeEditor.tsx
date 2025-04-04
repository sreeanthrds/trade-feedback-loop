
import React, { memo } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useSignalNodeForm } from './signal-node/useSignalNodeForm';
import SignalNodeContent from './signal-node/SignalNodeContent';

interface ExitSignalNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ExitSignalNodeEditor = ({ node, updateNodeData }: ExitSignalNodeEditorProps) => {
  const { 
    formData, 
    conditions,
    handleLabelChange, 
    updateConditions
  } = useSignalNodeForm({ node, updateNodeData });

  const exitSignalNodeInfo = "Exit signal nodes detect specific market conditions to trigger exit actions in your strategy. Connect them to action nodes like Exit to close positions when these conditions are met.";

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      infoTooltip={exitSignalNodeInfo}
      additionalContent={
        <SignalNodeContent
          conditions={conditions}
          updateConditions={updateConditions}
          conditionContext="exit"
          showTabSelector={false}
        />
      }
    />
  );
};

// Memoize the component to prevent unnecessary renders
export default memo(ExitSignalNodeEditor);
