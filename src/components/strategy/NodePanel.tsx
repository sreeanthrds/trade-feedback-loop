
import React from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StartNodeEditor from './editors/StartNodeEditor';
import SignalNodeEditor from './editors/SignalNodeEditor';
import ActionNodeEditor from './editors/ActionNodeEditor';
import EndNodeEditor from './editors/EndNodeEditor';

interface NodePanelProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  onClose: () => void;
}

const NodePanel = ({ node, updateNodeData, onClose }: NodePanelProps) => {
  const renderEditor = () => {
    switch (node.type) {
      case 'startNode':
        return <StartNodeEditor node={node} updateNodeData={updateNodeData} />;
      case 'signalNode':
        return <SignalNodeEditor node={node} updateNodeData={updateNodeData} />;
      case 'actionNode':
        return <ActionNodeEditor node={node} updateNodeData={updateNodeData} />;
      case 'endNode':
        return <EndNodeEditor node={node} updateNodeData={updateNodeData} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background/95 backdrop-blur-sm border-l border-border shadow-lg z-10 overflow-y-auto">
      <Card className="border-0 rounded-none h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            {node.type === 'startNode' ? 'Start Node' : 
             node.type === 'signalNode' ? 'Signal Node' : 
             node.type === 'actionNode' ? 'Action Node' : 'End Node'} Settings
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {renderEditor()}
        </CardContent>
      </Card>
    </div>
  );
};

export default NodePanel;
