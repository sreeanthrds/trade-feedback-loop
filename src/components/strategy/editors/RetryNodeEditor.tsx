
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useRetryNodeForm } from './retry-node/useRetryNodeForm';
import { RetrySettingsForm } from './retry-node/RetrySettingsForm';

interface RetryNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const RetryNodeEditor: React.FC<RetryNodeEditorProps> = ({ node, updateNodeData }) => {
  // Force actionType to be 'retry'
  if (node.data?.actionType !== 'retry') {
    updateNodeData(node.id, { 
      ...node.data, 
      actionType: 'retry',
      _lastUpdated: Date.now()
    });
  }

  const {
    label,
    groupNumber,
    maxReEntries,
    handleLabelChange,
    handleGroupNumberChange,
    handleMaxReEntriesChange
  } = useRetryNodeForm({ node, updateNodeData });

  // Get the appropriate info message
  const getActionInfoTooltip = () => {
    return "Retry nodes allow a strategy to re-enter a position after an exit, with configurable attempt limits.";
  };

  return (
    <NodeDetailsPanel
      nodeLabel={label || "Retry"}
      onLabelChange={handleLabelChange}
      infoTooltip={getActionInfoTooltip()}
      additionalContent={
        <RetrySettingsForm 
          groupNumber={groupNumber}
          maxReEntries={maxReEntries}
          onGroupNumberChange={handleGroupNumberChange}
          onMaxReEntriesChange={handleMaxReEntriesChange}
        />
      }
    />
  );
};

export default RetryNodeEditor;
