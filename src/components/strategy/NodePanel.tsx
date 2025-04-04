
import React, { memo, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import StartNodeEditor from './editors/StartNodeEditor';
import SignalNodeEditor from './editors/SignalNodeEditor';
import ActionNodeEditor from './editors/ActionNodeEditor';
import EntryNodeEditor from './editors/EntryNodeEditor';
import ExitNodeEditor from './editors/ExitNodeEditor';
import AlertNodeEditor from './editors/AlertNodeEditor';
import ModifyNodeEditor from './editors/ModifyNodeEditor';
import EndNodeEditor from './editors/EndNodeEditor';
import ForceEndNodeEditor from './editors/ForceEndNodeEditor';
import RetryNodeEditor from './editors/RetryNodeEditor';

interface NodePanelProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  onClose: () => void;
}

// Create memoized editor components
const MemoizedStartNodeEditor = memo(StartNodeEditor);
const MemoizedSignalNodeEditor = memo(SignalNodeEditor);
const MemoizedActionNodeEditor = memo(ActionNodeEditor);
const MemoizedEntryNodeEditor = memo(EntryNodeEditor);
const MemoizedExitNodeEditor = memo(ExitNodeEditor);
const MemoizedAlertNodeEditor = memo(AlertNodeEditor);
const MemoizedModifyNodeEditor = memo(ModifyNodeEditor);
const MemoizedEndNodeEditor = memo(EndNodeEditor);
const MemoizedForceEndNodeEditor = memo(ForceEndNodeEditor);
const MemoizedRetryNodeEditor = memo(RetryNodeEditor);

const NodePanel = memo(({ node, updateNodeData, onClose }: NodePanelProps) => {
  const isMobile = useIsMobile();

  // Create stable update function to prevent re-renders
  const stableUpdateNodeData = useCallback((id: string, data: any) => {
    // Add timestamp only if it doesn't already have one
    const newData = {
      ...data,
      _lastUpdated: data._lastUpdated || Date.now()
    };
    updateNodeData(id, newData);
  }, [updateNodeData]);

  const renderEditor = () => {
    switch (node.type) {
      case 'startNode':
        return <MemoizedStartNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'signalNode':
        return <MemoizedSignalNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'actionNode':
        return <MemoizedActionNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'entryNode':
        return <MemoizedEntryNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'exitNode':
        return <MemoizedExitNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'alertNode':
        return <MemoizedAlertNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'modifyNode':
        return <MemoizedModifyNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'retryNode':
        return <MemoizedRetryNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'endNode':
        return <MemoizedEndNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      case 'forceEndNode':
        return <MemoizedForceEndNodeEditor node={node} updateNodeData={stableUpdateNodeData} />;
      default:
        return <div>Unknown node type</div>;
    }
  };

  // Use a memoized title function
  const getNodeTitle = useCallback(() => {
    switch (node.type) {
      case 'startNode': return 'Start Node';
      case 'signalNode': return 'Signal Node';
      case 'actionNode': return 'Action Node';
      case 'entryNode': return 'Entry Node';
      case 'exitNode': return 'Exit Node';
      case 'alertNode': return 'Alert Node';
      case 'modifyNode': return 'Modify Position Node';
      case 'retryNode': return 'Retry Node';
      case 'endNode': return 'End Node';
      case 'forceEndNode': return 'Force End Node';
      default: return 'Node Settings';
    }
  }, [node.type]);

  // For mobile devices in the drawer, we'll just return the editor directly
  if (isMobile) {
    return renderEditor();
  }

  const title = getNodeTitle();

  return (
    <div className="h-full overflow-y-auto">
      <Card className="border-0 rounded-none h-full">
        <CardHeader className="flex flex-row items-center justify-between py-2 px-4 sticky top-0 bg-background z-10 border-b">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-3 px-4 overflow-y-auto">
          {renderEditor()}
        </CardContent>
      </Card>
    </div>
  );
});

NodePanel.displayName = 'NodePanel';

export default NodePanel;
