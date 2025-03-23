
import React from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface NodeData {
  label?: string;
  action?: string;
  instrument?: string;
}

const ActionNodeEditor = ({ node, updateNodeData }: ActionNodeEditorProps) => {
  const nodeData = node.data as NodeData | undefined;
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { 
      ...nodeData,
      label: e.target.value 
    });
  };

  const handleActionChange = (value: string) => {
    updateNodeData(node.id, { 
      ...nodeData,
      action: value 
    });
  };

  const handleInstrumentChange = (value: string) => {
    updateNodeData(node.id, { 
      ...nodeData,
      instrument: value 
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-label">Node Label</Label>
        <Input
          id="node-label"
          value={nodeData?.label || 'Action'}
          onChange={handleLabelChange}
          placeholder="Enter node label"
        />
      </div>
      
      <Separator />
      
      <div>
        <Label htmlFor="action-type">Action Type</Label>
        <Select
          value={nodeData?.action || ''}
          onValueChange={handleActionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="sell">Sell</SelectItem>
            <SelectItem value="exit">Exit Position</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="instrument">Instrument</Label>
        <Select
          value={nodeData?.instrument || ''}
          onValueChange={handleInstrumentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select instrument" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NIFTY50">NIFTY 50</SelectItem>
            <SelectItem value="BANKNIFTY">BANK NIFTY</SelectItem>
            <SelectItem value="RELIANCE">Reliance Industries</SelectItem>
            <SelectItem value="HDFCBANK">HDFC Bank</SelectItem>
            <SelectItem value="TCS">TCS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
        <p className="text-sm text-foreground/70">
          Action nodes execute trades based on signals. Configure the action type and instrument to trade.
        </p>
      </div>
    </div>
  );
};

export default ActionNodeEditor;
