
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ConditionBuilder from './condition-builder/ConditionBuilder';
import { Condition, GroupCondition } from '../utils/conditionTypes';

interface SignalNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface NodeData {
  label?: string;
  conditions?: GroupCondition[];
  simpleConditions?: string[];
}

const SignalNodeEditor = ({ node, updateNodeData }: SignalNodeEditorProps) => {
  const [newCondition, setNewCondition] = useState('');
  const nodeData = node.data as NodeData | undefined;
  const simpleConditions = Array.isArray(nodeData?.simpleConditions) ? nodeData.simpleConditions : [];
  const [activeTab, setActiveTab] = useState('simple');

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
  }, [conditions]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  // Simple condition handlers (legacy support)
  const addSimpleCondition = () => {
    if (newCondition.trim()) {
      const updatedConditions = [...simpleConditions, newCondition];
      updateNodeData(node.id, { simpleConditions: updatedConditions });
      setNewCondition('');
    }
  };

  const removeSimpleCondition = (index: number) => {
    const updatedConditions = [...simpleConditions];
    updatedConditions.splice(index, 1);
    updateNodeData(node.id, { simpleConditions: updatedConditions });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSimpleCondition();
    }
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simple Conditions</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Conditions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simple" className="space-y-4 pt-4">
          <div className="space-y-2 mb-4">
            {simpleConditions.length > 0 ? (
              simpleConditions.map((condition: string, index: number) => (
                <div key={index} className="flex items-center">
                  <div className="flex-grow bg-muted px-3 py-2 rounded-md text-sm">
                    {condition}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSimpleCondition(index)}
                    className="ml-2 h-9 w-9 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground italic">
                No conditions added yet
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., RSI > 70"
              className="flex-grow"
            />
            <Button onClick={addSimpleCondition}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium">Advanced Condition Builder</h3>
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
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted/40 rounded-md p-4">
        <p className="text-sm text-muted-foreground">
          Signal nodes detect specific market conditions to trigger actions in your strategy.
          Use the advanced builder for complex conditions with AND/OR logic.
        </p>
      </div>
    </div>
  );
};

export default SignalNodeEditor;
