
import React from 'react';
import { NodeTypes } from '@xyflow/react';
import StartNode from './StartNode';
import SignalNode from './SignalNode';
import ActionNode from './ActionNode';
import EndNode from './EndNode';
import ForceEndNode from './ForceEndNode';
import NodeControls from '../NodeControls';
import NodeConnectControls from '../NodeConnectControls';

// Define base node components outside to ensure consistent memoization
const MemoizedStartNode = React.memo(StartNode);
const MemoizedSignalNode = React.memo(SignalNode);
const MemoizedActionNode = React.memo(ActionNode);
const MemoizedEndNode = React.memo(EndNode);
const MemoizedForceEndNode = React.memo(ForceEndNode);
const MemoizedNodeControls = React.memo(NodeControls);
const MemoizedNodeConnectControls = React.memo(NodeConnectControls);

// Pre-memoize all wrapper components to avoid recreating them
const StartNodeWrapper = React.memo((props: any) => {
  const { onAddNode, ...rest } = props;
  return (
    <div className="group">
      <MemoizedStartNode {...rest} />
      <MemoizedNodeConnectControls showOn="start" onAddNode={onAddNode} />
    </div>
  );
});

const SignalNodeWrapper = React.memo((props: any) => {
  const { onDelete, onAddNode, ...rest } = props;
  return (
    <div className="group">
      <MemoizedSignalNode {...rest} />
      <MemoizedNodeControls node={props} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="signal" onAddNode={onAddNode} />
    </div>
  );
});

const ActionNodeWrapper = React.memo((props: any) => {
  const { onDelete, onAddNode, ...rest } = props;
  return (
    <div className="group">
      <MemoizedActionNode {...rest} />
      <MemoizedNodeControls node={props} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode} />
    </div>
  );
});

const EndNodeWrapper = React.memo((props: any) => {
  const { onDelete, ...rest } = props;
  return (
    <div className="group">
      <MemoizedEndNode {...rest} />
      <MemoizedNodeControls node={props} onDelete={onDelete} />
    </div>
  );
});

const ForceEndNodeWrapper = React.memo((props: any) => {
  const { onDelete, ...rest } = props;
  return (
    <div className="group">
      <MemoizedForceEndNode {...rest} />
      <MemoizedNodeControls node={props} onDelete={onDelete} />
    </div>
  );
});

// Create a factory function to create node types with the correct props
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  // Create a stable nodeTypes object
  return {
    startNode: StartNodeWrapper,
    signalNode: SignalNodeWrapper,
    actionNode: ActionNodeWrapper,
    endNode: EndNodeWrapper,
    forceEndNode: ForceEndNodeWrapper
  };
};

export { createNodeTypes };
