
import React, { memo } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useExitSignalNodeForm } from './signal-node/useExitSignalNodeForm';
import ExitSignalNodeContent from './signal-node/ExitSignalNodeContent';

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
  } = useExitSignalNodeForm({ node, updateNodeData });

  const signalNodeInfo = "Exit signal nodes detect specific market conditions to trigger exit actions in your strategy. Connect them to Exit nodes to close positions when these conditions are met.";

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      infoTooltip={signalNodeInfo}
      additionalContent={
        <ExitSignalNodeContent
          conditions={conditions}
          updateConditions={updateConditions}
        />
      }
    />
  );
};

// Memoize the component to prevent unnecessary renders
export default memo(ExitSignalNodeEditor);
