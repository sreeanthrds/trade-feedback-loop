
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

// Node wrapper props types - modified to not expect position
interface NodeWrapperProps {
  id: string;
  data: any;
  selected?: boolean;
  onDelete?: (id: string) => void;
  onAddNode?: (type: string) => void;
  [key: string]: any;
}

// Create wrapper components that are stable across renders
const StartNodeWrapper = React.memo(({ data, id, onAddNode }: NodeWrapperProps) => {
  // Important: Use a wrapper function to ensure correct parameter passing
  const handleAddNode = React.useCallback((type: string) => {
    console.log('StartNodeWrapper: Adding node', type);
    if (onAddNode) onAddNode(type);
  }, [onAddNode]);

  return (
    <div className="group">
      <MemoizedStartNode data={data} />
      <MemoizedNodeConnectControls showOn="start" onAddNode={handleAddNode} />
    </div>
  );
});

const SignalNodeWrapper = React.memo(({ data, id, onDelete, onAddNode }: NodeWrapperProps) => {
  // Important: Use a wrapper function to ensure correct parameter passing
  const handleAddNode = React.useCallback((type: string) => {
    console.log('SignalNodeWrapper: Adding node', type);
    if (onAddNode) onAddNode(type);
  }, [onAddNode]);

  return (
    <div className="group">
      <MemoizedSignalNode data={data} />
      <MemoizedNodeControls node={{ id, type: 'signalNode', data }} onDelete={onDelete!} />
      <MemoizedNodeConnectControls showOn="signal" onAddNode={handleAddNode} />
    </div>
  );
});

const ActionNodeWrapper = React.memo(({ data, id, onDelete, onAddNode }: NodeWrapperProps) => {
  // Important: Use a wrapper function to ensure correct parameter passing
  const handleAddNode = React.useCallback((type: string) => {
    console.log('ActionNodeWrapper: Adding node', type);
    if (onAddNode) onAddNode(type);
  }, [onAddNode]);

  return (
    <div className="group">
      <MemoizedActionNode data={data} id={id} />
      <MemoizedNodeControls node={{ id, type: 'actionNode', data }} onDelete={onDelete!} />
      <MemoizedNodeConnectControls showOn="action" onAddNode={handleAddNode} />
    </div>
  );
});

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
  // Log when nodeTypes are being created to identify potential issues
  console.log('Creating nodeTypes with handlers');
  
  return {
    startNode: (props) => (
      <StartNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        onAddNode={onAddNode} 
      />
    ),
    signalNode: (props) => (
      <SignalNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        onDelete={onDeleteNode}
        onAddNode={onAddNode}
      />
    ),
    actionNode: (props) => (
      <ActionNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        onDelete={onDeleteNode}
        onAddNode={onAddNode}
      />
    ),
    endNode: (props) => (
      <EndNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        onDelete={onDeleteNode}
      />
    ),
    forceEndNode: (props) => (
      <ForceEndNodeWrapper
        {...props}
        id={props.id}
        data={props.data}
        onDelete={onDeleteNode}
      />
    )
  };
};

export { createNodeTypes };
