
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useForceEndNodeForm } from './force-end-node/useForceEndNodeForm';
import ForceEndNodeSettings from './force-end-node/ForceEndNodeSettings';

interface ForceEndNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ForceEndNodeEditor = ({ node, updateNodeData }: ForceEndNodeEditorProps) => {
  const { 
    formData, 
    handleLabelChange,
    handleMessageChange,
    handleCloseAllChange
  } = useForceEndNodeForm({ node, updateNodeData });

  const forceEndNodeInfo = "This node forces an immediate end to strategy execution. All open positions will be closed, and no further nodes will be processed.";

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      infoTooltip={forceEndNodeInfo}
      additionalContent={
        <ForceEndNodeSettings
          closeAll={formData.closeAll}
          message={formData.message}
          onCloseAllChange={handleCloseAllChange}
          onMessageChange={handleMessageChange}
        />
      }
    />
  );
};

export default ForceEndNodeEditor;
