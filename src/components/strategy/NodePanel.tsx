
import React, { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { getNodeEditor } from './utils/nodeEditorUtils';

interface NodePanelProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  onClose: () => void;
}

const NodePanel = ({ node, updateNodeData, onClose }: NodePanelProps) => {
  // Ensure node is valid before attempting to render
  if (!node) {
    return null;
  }

  // Ensure node.data exists
  const nodeData = node.data || {};

  // Add effect to log node data for debugging
  useEffect(() => {
    console.log('NodePanel rendering with node:', node);
    console.log('Node data:', nodeData);
  }, [node, nodeData]);

  const EditorComponent = getNodeEditor(node.type);
  
  const getNodeTitle = () => {
    switch (node.type) {
      case 'startNode': return 'Start Node';
      case 'signalNode': return 'Signal Node';
      case 'actionNode': return 'Action Node';
      case 'endNode': return 'End Node';
      case 'forceEndNode': return 'Force End Node';
      default: return 'Node Settings';
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <Card className="border-0 rounded-none h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 sticky top-0 bg-background z-10 border-b">
          <CardTitle className="text-lg">{getNodeTitle()}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4 px-4 sm:px-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {EditorComponent ? (
            <EditorComponent node={node} updateNodeData={updateNodeData} />
          ) : (
            <Alert variant="destructive">
              <AlertDescription>
                Unknown node type: {node.type}. Editor not available.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NodePanel;
