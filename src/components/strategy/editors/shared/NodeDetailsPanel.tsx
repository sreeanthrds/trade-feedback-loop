
import React from 'react';
import { Separator } from '@/components/ui/separator';
import InputField from './InputField';

interface NodeDetailsPanelProps {
  nodeLabel: string;
  onLabelChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  additionalContent?: React.ReactNode;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  nodeLabel,
  onLabelChange,
  additionalContent,
}) => {
  return (
    <div className="space-y-4">
      <InputField
        label="Node Label"
        id="node-label"
        value={nodeLabel || ''}
        onChange={onLabelChange}
        placeholder="Enter node label"
        orientation="horizontal"
      />
      
      {additionalContent && (
        <>
          <Separator />
          {additionalContent}
        </>
      )}
    </div>
  );
};

export default NodeDetailsPanel;
