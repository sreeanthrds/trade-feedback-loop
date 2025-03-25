
import React, { memo } from 'react';
import { NodeTypes } from '@xyflow/react';
import StartNode from './StartNode';
import SignalNode from './SignalNode';
import ActionNode from './ActionNode';
import EndNode from './EndNode';
import ForceEndNode from './ForceEndNode';
import NodeControls from '../NodeControls';
import NodeConnectControls from '../NodeConnectControls';

// Create node types once outside of any component
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  return {
    startNode: memo((nodeProps) => (
      <div className="group">
        <StartNode {...nodeProps} />
        <NodeConnectControls showOn="start" onAddNode={onAddNode} />
      </div>
    )),
    signalNode: memo((nodeProps) => (
      <div className="group">
        <SignalNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
        <NodeConnectControls showOn="signal" onAddNode={onAddNode} />
      </div>
    )),
    actionNode: memo((nodeProps) => (
      <div className="group">
        <ActionNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
        <NodeConnectControls showOn="action" onAddNode={onAddNode} />
      </div>
    )),
    endNode: memo((nodeProps) => (
      <div className="group">
        <EndNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
      </div>
    )),
    forceEndNode: memo((nodeProps) => (
      <div className="group">
        <ForceEndNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
      </div>
    ))
  };
};

export { createNodeTypes };
