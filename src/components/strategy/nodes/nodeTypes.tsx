
import React, { useMemo } from 'react';
import { NodeTypes, Node, Position } from '@xyflow/react';
import StartNode from './StartNode';
import SignalNode from './SignalNode';
import ActionNode from './ActionNode';
import EndNode from './EndNode';
import ForceEndNode from './ForceEndNode';
import NodeControls from '../NodeControls';
import NodeConnectControls from '../NodeConnectControls';

// Define base node components with proper memoization
const MemoizedStartNode = React.memo(StartNode);
const MemoizedSignalNode = React.memo(SignalNode);
const MemoizedActionNode = React.memo(ActionNode);
const MemoizedEndNode = React.memo(EndNode);
const MemoizedForceEndNode = React.memo(ForceEndNode);
const MemoizedNodeControls = React.memo(NodeControls);
const MemoizedNodeConnectControls = React.memo(NodeConnectControls);

// Node wrapper props types - modified to not expect position
interface NodeWrapperProps {
  id: string;
  data: any;
  selected?: boolean;
  onDelete?: (id: string) => void;
  onAddNode?: (type: string) => void;
  [key: string]: any;
}

// Pre-define all wrapper components to avoid conditional hook usage
const StartNodeWrapper = React.memo(({ data, id, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedStartNode data={data} />
    <MemoizedNodeConnectControls showOn="start" onAddNode={onAddNode!} />
  </div>
));

const SignalNodeWrapper = React.memo(({ data, id, onDelete, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedSignalNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'signalNode', data }} onDelete={onDelete!} />
    <MemoizedNodeConnectControls showOn="signal" onAddNode={onAddNode!} />
  </div>
));

const ActionNodeWrapper = React.memo(({ data, id, onDelete, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedActionNode data={data} id={id} />
    <MemoizedNodeControls node={{ id, type: 'actionNode', data }} onDelete={onDelete!} />
    <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode!} />
  </div>
));

const EndNodeWrapper = React.memo(({ data, id, onDelete }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedEndNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'endNode', data }} onDelete={onDelete!} />
  </div>
));

const ForceEndNodeWrapper = React.memo(({ data, id, onDelete }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedForceEndNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'forceEndNode', data }} onDelete={onDelete!} />
  </div>
));

// Create a function to generate nodeTypes with the handlers
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  // Return a stable object of component references
  return {
    startNode: (props) => <StartNodeWrapper {...props} onAddNode={onAddNode} />,
    signalNode: (props) => <SignalNodeWrapper {...props} onDelete={onDeleteNode} onAddNode={onAddNode} />,
    actionNode: (props) => <ActionNodeWrapper {...props} onDelete={onDeleteNode} onAddNode={onAddNode} />,
    endNode: (props) => <EndNodeWrapper {...props} onDelete={onDeleteNode} />,
    forceEndNode: (props) => <ForceEndNodeWrapper {...props} onDelete={onDeleteNode} />
  };
};

export { createNodeTypes };
