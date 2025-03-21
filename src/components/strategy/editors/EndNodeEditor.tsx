
import React from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EndNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const EndNodeEditor = ({ node, updateNodeData }: EndNodeEditorProps) => {
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-label">Node Label</Label>
        <Input
          id="node-label"
          value={node.data?.label || 'End'}
          onChange={handleLabelChange}
          placeholder="Enter node label"
        />
      </div>
      
      <div className="bg-secondary/30 rounded-md p-4">
        <p className="text-sm text-foreground/70 mb-2">
          The End Node represents the final state of your strategy. Any path that reaches this node will terminate.
        </p>
        <p className="text-sm text-foreground/70">
          Use multiple End nodes to represent different outcomes or exit conditions.
        </p>
      </div>
    </div>
  );
};

export default EndNodeEditor;
