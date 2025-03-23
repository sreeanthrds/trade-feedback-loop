
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConditionBuilder from './condition-builder/ConditionBuilder';
import { GroupCondition } from '../utils/conditionTypes';

interface SignalNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface NodeData {
  label?: string;
  conditions?: GroupCondition[];
}

const SignalNodeEditor = ({ node, updateNodeData }: SignalNodeEditorProps) => {
  const nodeData = node.data as NodeData | undefined || {};

  // Initialize complex conditions data structure if it doesn't exist
  const [conditions, setConditions] = useState<GroupCondition[]>(
    nodeData?.conditions || [
      {
        id: 'root',
        groupLogic: 'AND',
        conditions: []
      }
    ]
  );

  // Update node data when conditions change (with delay to prevent loops)
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeData(node.id, { 
        ...nodeData,
        conditions: conditions
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [conditions, node.id, updateNodeData, nodeData]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { 
      ...nodeData,
      label: e.target.value 
    });
  };

  // Advanced condition handlers
  const updateConditions = (newConditions: GroupCondition[]) => {
    setConditions(newConditions);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-label">Node Label</Label>
        <Input
          id="node-label"
          value={nodeData?.label || 'Signal'}
          onChange={handleLabelChange}
          placeholder="Enter node label"
        />
      </div>
      
      <Separator />
      
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-medium">Condition Builder</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Build complex conditions with nested groups, indicators, and operators.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <ConditionBuilder 
          rootCondition={conditions[0]} 
          updateConditions={(updatedRoot) => {
            updateConditions([updatedRoot]);
          }}
        />
      </div>
      
      <div className="bg-muted/40 rounded-md p-4">
        <p className="text-sm text-muted-foreground">
          Signal nodes detect specific market conditions to trigger actions in your strategy.
          Use groups for complex conditions with AND/OR logic.
        </p>
      </div>
    </div>
  );
};

export default SignalNodeEditor;
