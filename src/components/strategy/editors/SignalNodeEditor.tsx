
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useSignalNodeForm } from './signal-node/useSignalNodeForm';
import SignalNodeContent from './signal-node/SignalNodeContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SignalNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const SignalNodeEditor = ({ node, updateNodeData }: SignalNodeEditorProps) => {
  const { 
    formData, 
    conditions, 
    handleLabelChange, 
    updateConditions 
  } = useSignalNodeForm({ node, updateNodeData });

  const signalNodeInfo = "Signal nodes detect specific market conditions to trigger actions in your strategy. Use groups for complex conditions with AND/OR logic.";

  return (
    <NodeDetailsPanel
      nodeLabel={formData.label}
      onLabelChange={handleLabelChange}
      infoTooltip={signalNodeInfo}
      additionalContent={
        <Tabs defaultValue="conditions" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conditions">
            <SignalNodeContent
              conditions={conditions}
              updateConditions={updateConditions}
            />
          </TabsContent>
          
          <TabsContent value="actions">
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium">Action Configuration</h3>
              <p className="text-xs text-muted-foreground">
                Connect this signal node to action nodes to execute entry, exit, or alert actions when conditions are met.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      }
    />
  );
};

export default SignalNodeEditor;
