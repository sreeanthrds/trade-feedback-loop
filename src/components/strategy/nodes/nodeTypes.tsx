
import React, { useMemo } from 'react';
import { NodeTypes, Node } from '@xyflow/react';
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

// Create wrapper components that are stable across renders
const StartNodeWrapper = React.memo(({ data, id, ...rest }: any) => {
  const { onAddNode } = rest;
  return (
    <div className="group">
      <MemoizedStartNode data={data} id={id} {...rest} />
      <MemoizedNodeConnectControls showOn="start" onAddNode={onAddNode} />
    </div>
  );
});

const SignalNodeWrapper = React.memo(({ data, id, position, ...rest }: any) => {
  const { onDelete, onAddNode } = rest;
  return (
    <div className="group">
      <MemoizedSignalNode data={data} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'signalNode', data, position }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="signal" onAddNode={onAddNode} />
    </div>
  );
});

const ActionNodeWrapper = React.memo(({ data, id, position, ...rest }: any) => {
  const { onDelete, onAddNode } = rest;
  return (
    <div className="group">
      <MemoizedActionNode data={data} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'actionNode', data, position }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode} />
    </div>
  );
});

const EndNodeWrapper = React.memo(({ data, id, position, ...rest }: any) => {
  const { onDelete } = rest;
  return (
    <div className="group">
      <MemoizedEndNode data={data} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'endNode', data, position }} onDelete={onDelete} />
    </div>
  );
});

const ForceEndNodeWrapper = React.memo(({ data, id, position, ...rest }: any) => {
  const { onDelete } = rest;
  return (
    <div className="group">
      <MemoizedForceEndNode data={data} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'forceEndNode', data, position }} onDelete={onDelete} />
    </div>
  );
});

// Factory function to create node types with the correct props
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  // Create a stable nodeTypes object
  return {
    startNode: (props) => <StartNodeWrapper {...props} onAddNode={onAddNode} />,
    signalNode: (props) => <SignalNodeWrapper {...props} onDelete={onDeleteNode} onAddNode={onAddNode} />,
    actionNode: (props) => <ActionNodeWrapper {...props} onDelete={onDeleteNode} onAddNode={onAddNode} />,
    endNode: (props) => <EndNodeWrapper {...props} onDelete={onDeleteNode} />,
    forceEndNode: (props) => <ForceEndNodeWrapper {...props} onDelete={onDeleteNode} />
  };
};

export { createNodeTypes };
