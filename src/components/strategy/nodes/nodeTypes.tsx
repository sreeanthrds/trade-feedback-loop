
import React from 'react';
import { NodeTypes, Position } from '@xyflow/react';
import StartNode from './StartNode';
import SignalNode from './SignalNode';
import ActionNode from './ActionNode';
import EndNode from './EndNode';
import ForceEndNode from './ForceEndNode';
import NodeControls from '../NodeControls';
import NodeConnectControls from '../NodeConnectControls';

// Define memoized base components
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
  selected?: boolean;
  onDelete?: (id: string) => void;
  onAddNode?: (type: string) => void;
  [key: string]: any;
}

// Create stable wrapper components
const StartNodeWrapper = React.memo(({ data, id, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedStartNode data={data} />
    <MemoizedNodeConnectControls showOn="start" onAddNode={onAddNode} />
  </div>
));
StartNodeWrapper.displayName = 'StartNodeWrapper';

const SignalNodeWrapper = React.memo(({ data, id, onDelete, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedSignalNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'signalNode', data }} onDelete={onDelete} />
    <MemoizedNodeConnectControls showOn="signal" onAddNode={onAddNode} />
  </div>
));
SignalNodeWrapper.displayName = 'SignalNodeWrapper';

const ActionNodeWrapper = React.memo(({ data, id, onDelete, onAddNode }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedActionNode data={data} id={id} />
    <MemoizedNodeControls node={{ id, type: 'actionNode', data }} onDelete={onDelete} />
    <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode} />
  </div>
));
ActionNodeWrapper.displayName = 'ActionNodeWrapper';

const EndNodeWrapper = React.memo(({ data, id, onDelete }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedEndNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'endNode', data }} onDelete={onDelete} />
  </div>
));
EndNodeWrapper.displayName = 'EndNodeWrapper';

const ForceEndNodeWrapper = React.memo(({ data, id, onDelete }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedForceEndNode data={data} />
    <MemoizedNodeControls node={{ id, type: 'forceEndNode', data }} onDelete={onDelete} />
  </div>
));
ForceEndNodeWrapper.displayName = 'ForceEndNodeWrapper';

// Create a function to generate nodeTypes with stable renderer functions
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  return {
    startNode: (props) => <StartNodeWrapper {...props} onAddNode={onAddNode} />,
    signalNode: (props) => <SignalNodeWrapper {...props} onDelete={onDeleteNode} onAddNode={onAddNode} />,
    actionNode: (props) => <ActionNodeWrapper {...props} onDelete={onDeleteNode} onAddNode={onAddNode} />,
    endNode: (props) => <EndNodeWrapper {...props} onDelete={onDeleteNode} />,
    forceEndNode: (props) => <ForceEndNodeWrapper {...props} onDelete={onDeleteNode} />
  };
};

export { createNodeTypes };
