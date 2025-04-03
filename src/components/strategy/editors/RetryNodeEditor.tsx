
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useRetryNodeForm } from './retry-node/useRetryNodeForm';
import { RetrySettingsForm } from './retry-node/RetrySettingsForm';

interface RetryNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

// Interface for the node data
interface RetryNodeData {
  actionType?: string;
  label?: string;
  [key: string]: any;
}

const RetryNodeEditor: React.FC<RetryNodeEditorProps> = ({ node, updateNodeData }) => {
  // Force actionType to be 'retry'
  const nodeData = node.data as RetryNodeData || {};
  if (nodeData?.actionType !== 'retry') {
    updateNodeData(node.id, { 
      ...nodeData, 
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
    return "Re-entry nodes allow a strategy to re-enter a position after an exit, with configurable attempt limits.";
  };

  // Ensure we always pass a string to nodeLabel
  const nodeLabel = typeof label === 'string' ? label : 'Re-entry';

  return (
    <NodeDetailsPanel
      nodeLabel={nodeLabel}
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
