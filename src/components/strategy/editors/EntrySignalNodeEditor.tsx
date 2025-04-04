
import React, { memo } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useSignalNodeForm } from './signal-node/useSignalNodeForm';
import SignalNodeContent from './signal-node/SignalNodeContent';

interface EntrySignalNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const EntrySignalNodeEditor = ({ node, updateNodeData }: EntrySignalNodeEditorProps) => {
  const { 
    formData, 
    conditions,
    handleLabelChange, 
    updateConditions
  } = useSignalNodeForm({ node, updateNodeData });

  const entrySignalNodeInfo = "Entry signal nodes detect specific market conditions to trigger entry actions in your strategy. Connect them to action nodes like Entry to execute trades when these conditions are met.";

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      infoTooltip={entrySignalNodeInfo}
      additionalContent={
        <SignalNodeContent
          conditions={conditions}
          updateConditions={updateConditions}
          conditionContext="entry"
          showTabSelector={false}
        />
      }
    />
  );
};

// Memoize the component to prevent unnecessary renders
export default memo(EntrySignalNodeEditor);
