
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { ExitNodeForm } from './action-node/exit-node';

interface ExitNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ExitNodeEditor = ({ node, updateNodeData }: ExitNodeEditorProps) => {
  // Force actionType to be 'exit'
  if (node.data.actionType !== 'exit') {
    updateNodeData(node.id, { 
      ...node.data, 
      actionType: 'exit',
      _lastUpdated: Date.now()
    });
  }
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { 
      ...node.data, 
      label: e.target.value,
      _lastUpdated: Date.now()
    });
  };

  // Get the appropriate info message
  const getActionInfoTooltip = () => {
    return "Exit nodes close existing positions. Use these after entry nodes to define when to exit the market based on signals.";
  };

  // Ensure we always pass a string to nodeLabel by using explicit type check
  const nodeLabel = typeof node.data?.label === 'string' ? node.data.label : '';

  return (
    <NodeDetailsPanel
      nodeLabel={nodeLabel}
      onLabelChange={handleLabelChange}
      infoTooltip={getActionInfoTooltip()}
      additionalContent={
        <ExitNodeForm node={node} updateNodeData={updateNodeData} />
      }
    />
  );
};

export default ExitNodeEditor;
