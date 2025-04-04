
import React from 'react';
import { Node } from '@xyflow/react';
import StartNodeEditor from './StartNodeEditor';
import SignalNodeEditor from './SignalNodeEditor';
import EntrySignalNodeEditor from './EntrySignalNodeEditor';
import ExitSignalNodeEditor from './ExitSignalNodeEditor';
import ActionNodeEditor from './ActionNodeEditor';
import EntryNodeEditor from './EntryNodeEditor';
import ExitNodeEditor from './ExitNodeEditor';
import ModifyNodeEditor from './ModifyNodeEditor';
import AlertNodeEditor from './AlertNodeEditor';
import EndNodeEditor from './EndNodeEditor';
import ForceEndNodeEditor from './ForceEndNodeEditor';
import RetryNodeEditor from './RetryNodeEditor';

interface NodePanelRouterProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
  closePanel: () => void;
}

const NodePanelRouter: React.FC<NodePanelRouterProps> = ({
  node,
  updateNodeData,
  closePanel
}) => {
  // Render the appropriate editor based on node type
  switch (node.type) {
    case 'startNode':
      return <StartNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'signalNode':
      return <SignalNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'entrySignalNode':
      return <EntrySignalNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'exitSignalNode':
      return <ExitSignalNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'actionNode':
      return <ActionNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'entryNode':
      return <EntryNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'exitNode':
      return <ExitNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'modifyNode':
      return <ModifyNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'alertNode':
      return <AlertNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'endNode':
      return <EndNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'forceEndNode':
      return <ForceEndNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    case 'retryNode':
      return <RetryNodeEditor node={node} updateNodeData={updateNodeData} />;
      
    default:
      return (
        <div className="p-4">
          <h3 className="text-lg font-medium">Unknown Node Type</h3>
          <p className="text-sm text-muted-foreground">
            No editor available for node type: {node.type}
          </p>
        </div>
      );
  }
};

export default NodePanelRouter;
