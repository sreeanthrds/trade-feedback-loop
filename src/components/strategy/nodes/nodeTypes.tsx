
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

// Pre-memoize the node wrapper components
const StartNodeWrapper = React.memo((nodeProps: any) => (
  <div className="group">
    <MemoizedStartNode {...nodeProps} />
    <NodeConnectControls showOn="start" onAddNode={nodeProps.onAddNode} />
  </div>
));

const SignalNodeWrapper = React.memo((nodeProps: any) => (
  <div className="group">
    <MemoizedSignalNode {...nodeProps} />
    <NodeControls node={nodeProps} onDelete={nodeProps.onDelete} />
    <NodeConnectControls showOn="signal" onAddNode={nodeProps.onAddNode} />
  </div>
));

const ActionNodeWrapper = React.memo((nodeProps: any) => (
  <div className="group">
    <MemoizedActionNode {...nodeProps} />
    <NodeControls node={nodeProps} onDelete={nodeProps.onDelete} />
    <NodeConnectControls showOn="action" onAddNode={nodeProps.onAddNode} />
  </div>
));

const EndNodeWrapper = React.memo((nodeProps: any) => (
  <div className="group">
    <MemoizedEndNode {...nodeProps} />
    <NodeControls node={nodeProps} onDelete={nodeProps.onDelete} />
  </div>
));

const ForceEndNodeWrapper = React.memo((nodeProps: any) => (
  <div className="group">
    <MemoizedForceEndNode {...nodeProps} />
    <NodeControls node={nodeProps} onDelete={nodeProps.onDelete} />
  </div>
));

// Create a factory function to create node types with the correct props
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  // Use inline functions to pass the handlers to the pre-memoized components
  return {
    startNode: React.memo((props) => (
      <StartNodeWrapper {...props} onAddNode={onAddNode} />
    )),
    signalNode: React.memo((props) => (
      <SignalNodeWrapper {...props} onDelete={onDeleteNode} onAddNode={onAddNode} />
    )),
    actionNode: React.memo((props) => (
      <ActionNodeWrapper {...props} onDelete={onDeleteNode} onAddNode={onAddNode} />
    )),
    endNode: React.memo((props) => (
      <EndNodeWrapper {...props} onDelete={onDeleteNode} />
    )),
    forceEndNode: React.memo((props) => (
      <ForceEndNodeWrapper {...props} onDelete={onDeleteNode} />
    ))
  };
};

export { createNodeTypes };
