
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import AlertMessage from './action-node/AlertMessage';

interface AlertNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const AlertNodeEditor = ({ node, updateNodeData }: AlertNodeEditorProps) => {
  // Force actionType to be 'alert'
  if (node.data.actionType !== 'alert') {
    updateNodeData(node.id, { 
      ...node.data, 
      actionType: 'alert',
      _lastUpdated: Date.now()
    });
  }
  
  const handleLabelChange = (value: string) => {
    updateNodeData(node.id, { 
      ...node.data, 
      label: value,
      _lastUpdated: Date.now()
    });
  };

  // Get the appropriate info message
  const getActionInfoTooltip = () => {
    return "Alert nodes notify you of trading opportunities without executing trades. Useful for manual trading or when testing a strategy.";
  };

  return (
    <NodeDetailsPanel
      nodeLabel={node.data?.label || ''}
      onLabelChange={handleLabelChange}
      infoTooltip={getActionInfoTooltip()}
      additionalContent={
        <AlertMessage />
      }
    />
  );
};

export default AlertNodeEditor;
