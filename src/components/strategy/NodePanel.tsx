
import React, { memo, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
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

const NodePanel = memo(({ node, updateNodeData, onClose }: NodePanelProps) => {
  const isMobile = useIsMobile();

  // Create stable update function to prevent re-renders
  const stableUpdateNodeData = useCallback((id: string, data: any) => {
    // Add timestamp only if it doesn't already have one
    if (!data._lastUpdated) {
      data = {
        ...data,
        _lastUpdated: Date.now()
      };
    }
    updateNodeData(id, data);
  }, [updateNodeData]);

  const renderEditor = () => {
    switch (node.type) {
      case 'startNode':
        return <StartNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'signalNode':
        return <SignalNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'actionNode':
        return <ActionNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'endNode':
        return <EndNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'forceEndNode':
        return <ForceEndNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  // For mobile devices in the drawer, we'll just return the editor directly
  if (isMobile) {
    return renderEditor();
  }

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
        <CardContent className="pt-4 px-4 sm:px-6 overflow-y-auto">
          {renderEditor()}
        </CardContent>
      </Card>
    </div>
  );
});

NodePanel.displayName = 'NodePanel';

export default NodePanel;
