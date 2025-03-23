
import React from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StartNodeEditor from './editors/StartNodeEditor';
import SignalNodeEditor from './editors/SignalNodeEditor';
import ActionNodeEditor from './editors/ActionNodeEditor';
import EndNodeEditor from './editors/EndNodeEditor';
import ForceEndNodeEditor from './editors/ForceEndNodeEditor';

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
      case 'forceEndNode':
        return <ForceEndNodeEditor node={node} updateNodeData={updateNodeData} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

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
          {renderEditor()}
        </CardContent>
      </Card>
    </div>
  );
};

export default NodePanel;
