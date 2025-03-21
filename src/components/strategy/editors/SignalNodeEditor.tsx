
import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';

interface SignalNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const SignalNodeEditor = ({ node, updateNodeData }: SignalNodeEditorProps) => {
  const [newCondition, setNewCondition] = useState('');
  const conditions = node.data.conditions || [];

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      const updatedConditions = [...conditions, newCondition];
      updateNodeData(node.id, { conditions: updatedConditions });
      setNewCondition('');
    }
  };

  const removeCondition = (index: number) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    updateNodeData(node.id, { conditions: updatedConditions });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCondition();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-label">Node Label</Label>
        <Input
          id="node-label"
          value={node.data.label || 'Signal'}
          onChange={handleLabelChange}
          placeholder="Enter node label"
        />
      </div>
      
      <Separator />
      
      <div>
        <Label>Signal Conditions</Label>
        <p className="text-sm text-foreground/70 mb-2">
          Add conditions that will trigger this signal
        </p>
        
        <div className="space-y-2 mb-4">
          {conditions.length > 0 ? (
            conditions.map((condition: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="flex-grow bg-secondary/30 px-3 py-2 rounded-md text-sm">
                  {condition}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCondition(index)}
                  className="ml-2 h-9 w-9 p-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-sm text-foreground/50 italic">
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
          <Button onClick={addCondition}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      <div className="bg-secondary/30 rounded-md p-4">
        <p className="text-sm text-foreground/70">
          Signal nodes detect specific market conditions to trigger actions in your strategy.
        </p>
      </div>
    </div>
  );
};

export default SignalNodeEditor;
