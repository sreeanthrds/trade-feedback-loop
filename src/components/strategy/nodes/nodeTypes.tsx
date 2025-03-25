
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

// Create node types once outside of any component
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  return {
    startNode: React.memo((nodeProps) => (
      <div className="group">
        <MemoizedStartNode {...nodeProps} />
        <NodeConnectControls showOn="start" onAddNode={onAddNode} />
      </div>
    )),
    signalNode: React.memo((nodeProps) => (
      <div className="group">
        <MemoizedSignalNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
        <NodeConnectControls showOn="signal" onAddNode={onAddNode} />
      </div>
    )),
    actionNode: React.memo((nodeProps) => (
      <div className="group">
        <MemoizedActionNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
        <NodeConnectControls showOn="action" onAddNode={onAddNode} />
      </div>
    )),
    endNode: React.memo((nodeProps) => (
      <div className="group">
        <MemoizedEndNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
      </div>
    )),
    forceEndNode: React.memo((nodeProps) => (
      <div className="group">
        <MemoizedForceEndNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
      </div>
    ))
  };
};

export { createNodeTypes };
