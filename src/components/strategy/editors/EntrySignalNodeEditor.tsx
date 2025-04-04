
import React, { memo, ChangeEvent } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useEntrySignalNodeForm } from './signal-node/useEntrySignalNodeForm';
import EntrySignalNodeContent from './signal-node/EntrySignalNodeContent';

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
  } = useEntrySignalNodeForm({ node, updateNodeData });

  const signalNodeInfo = "Entry signal nodes detect specific market conditions to trigger entry actions in your strategy. Connect them to Entry nodes to execute trades when these conditions are met.";

  // Create a wrapped handler that extracts the value from the event
  const onLabelChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    handleLabelChange(e.target.value);
  };

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label || 'Entry Signal'}
      onLabelChange={onLabelChangeHandler}
      infoTooltip={signalNodeInfo}
      additionalContent={
        <EntrySignalNodeContent
          conditions={conditions}
          updateConditions={updateConditions}
        />
      }
    />
  );
};

// Memoize the component to prevent unnecessary renders
export default memo(EntrySignalNodeEditor);
