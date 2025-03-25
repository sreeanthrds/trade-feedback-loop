
import React, { useMemo } from 'react';
import { NodeTypes, Node, Position } from '@xyflow/react';
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

// Node wrapper props types
interface NodeWrapperProps {
  id: string;
  data: any;
  position: { x: number; y: number };
  selected?: boolean;
  onDelete?: (id: string) => void;
  onAddNode?: (type: string) => void;
  [key: string]: any;
}

// Create wrapper components that are stable across renders
const StartNodeWrapper = React.memo(({ data, position, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedStartNode data={data} />
    <MemoizedNodeConnectControls showOn="start" onAddNode={onAddNode!} />
  </div>
));

const SignalNodeWrapper = React.memo(({ data, id, position, onDelete, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedSignalNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'signalNode', data, position }} onDelete={onDelete!} />
    <MemoizedNodeConnectControls showOn="signal" onAddNode={onAddNode!} />
  </div>
));

const ActionNodeWrapper = React.memo(({ data, id, position, onDelete, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedActionNode data={data} id={id} />
    <MemoizedNodeControls node={{ id, type: 'actionNode', data, position }} onDelete={onDelete!} />
    <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode!} />
  </div>
));

const EndNodeWrapper = React.memo(({ data, id, position, onDelete }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedEndNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'endNode', data, position }} onDelete={onDelete!} />
  </div>
));

const ForceEndNodeWrapper = React.memo(({ data, id, position, onDelete }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedForceEndNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'forceEndNode', data, position }} onDelete={onDelete!} />
  </div>
));

// Create a memoized node types object outside of any component
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  return {
    startNode: (props) => (
      <StartNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        position={{ x: props.xPos, y: props.yPos }}
        onAddNode={onAddNode} 
      />
    ),
    signalNode: (props) => (
      <SignalNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        position={{ x: props.xPos, y: props.yPos }}
        onDelete={onDeleteNode}
        onAddNode={onAddNode}
      />
    ),
    actionNode: (props) => (
      <ActionNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        position={{ x: props.xPos, y: props.yPos }}
        onDelete={onDeleteNode}
        onAddNode={onAddNode}
      />
    ),
    endNode: (props) => (
      <EndNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        position={{ x: props.xPos, y: props.yPos }}
        onDelete={onDeleteNode}
      />
    ),
    forceEndNode: (props) => (
      <ForceEndNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        position={{ x: props.xPos, y: props.yPos }}
        onDelete={onDeleteNode}
      />
    )
  };
};

export { createNodeTypes };
