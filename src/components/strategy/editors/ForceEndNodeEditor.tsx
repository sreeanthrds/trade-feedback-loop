
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel, SwitchField, InputField, InfoBox } from './shared';

interface ForceEndNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface NodeData {
  label?: string;
  closeAll?: boolean;
  message?: string;
}

const ForceEndNodeEditor = ({ node, updateNodeData }: ForceEndNodeEditorProps) => {
  const nodeData = node.data as NodeData | undefined;
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { message: e.target.value });
  };

  const handleCloseAllChange = (checked: boolean) => {
    updateNodeData(node.id, { closeAll: checked });
  };

  return (
    <NodeDetailsPanel
      nodeLabel={nodeData?.label || 'Force End'}
      onLabelChange={handleLabelChange}
      additionalContent={
        <div className="space-y-4">
          <SwitchField 
            label="Close all open positions"
            id="close-all" 
            checked={nodeData?.closeAll !== false}
            onCheckedChange={handleCloseAllChange}
          />
          
          <InputField
            label="End Message"
            id="end-message"
            value={nodeData?.message || ''}
            onChange={handleMessageChange}
            placeholder="Message to display when strategy ends"
          />
          
          <InfoBox type="warning" title="Force End Node">
            <p>
              This node forces an immediate end to strategy execution. 
              All open positions will be closed, and no further nodes will be processed.
            </p>
          </InfoBox>
        </div>
      }
    />
  );
};

export default ForceEndNodeEditor;
