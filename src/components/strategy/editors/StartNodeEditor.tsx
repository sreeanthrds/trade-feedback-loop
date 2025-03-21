
import React from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StartNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const StartNodeEditor = ({ node, updateNodeData }: StartNodeEditorProps) => {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-label">Node Label</Label>
        <Input
          id="node-label"
          value={node.data?.label || 'Start'}
          onChange={handleLabelChange}
          placeholder="Enter node label"
        />
      </div>
      
      <div className="bg-secondary/30 rounded-md p-4">
        <p className="text-sm text-foreground/70 mb-2">
          The Start Node is the entry point of your strategy. The strategy execution begins here.
        </p>
        <p className="text-sm text-foreground/70">
          Connect this node to Signal or Action nodes to define your strategy flow.
        </p>
      </div>
    </div>
  );
};

export default StartNodeEditor;
