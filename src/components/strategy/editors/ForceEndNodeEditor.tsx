
import React from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';

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
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-label">Node Label</Label>
        <Input
          id="node-label"
          value={nodeData?.label || 'Force End'}
          onChange={handleLabelChange}
          placeholder="Enter node label"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="close-all" 
            checked={nodeData?.closeAll !== false}
            onCheckedChange={handleCloseAllChange}
          />
          <Label htmlFor="close-all">Close all open positions</Label>
        </div>
      </div>
      
      <div>
        <Label htmlFor="end-message">End Message</Label>
        <Input
          id="end-message"
          value={nodeData?.message || ''}
          onChange={handleMessageChange}
          placeholder="Message to display when strategy ends"
        />
      </div>
      
      <div className="bg-[#9C27B0]/10 border border-[#9C27B0]/30 text-foreground rounded-md p-4 flex items-start">
        <AlertTriangle className="h-5 w-5 text-[#9C27B0] mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium mb-1">Force End Node</p>
          <p className="text-foreground/70">
            This node forces an immediate end to strategy execution. 
            All open positions will be closed, and no further nodes will be processed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForceEndNodeEditor;
