
import React from 'react';
import { NodeTypes } from '@xyflow/react';
import StartNode from './StartNode';
import SignalNode from './SignalNode';
import ActionNode from './ActionNode';
import EndNode from './EndNode';
import ForceEndNode from './ForceEndNode';
import NodeControls from '../NodeControls';
import NodeConnectControls from '../NodeConnectControls';

// Create node types with delete functionality
export const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string) => void
): NodeTypes => {
  return {
    startNode: (nodeProps) => (
      <div className="group relative">
        <StartNode {...nodeProps} />
        <NodeConnectControls showOn="start" onAddNode={(type) => onAddNode(type)} />
      </div>
    ),
    signalNode: (nodeProps) => (
      <div className="group relative">
        <SignalNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
        <NodeConnectControls showOn="signal" onAddNode={(type) => onAddNode(type)} />
      </div>
    ),
    actionNode: (nodeProps) => (
      <div className="group relative">
        <ActionNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
        <NodeConnectControls showOn="action" onAddNode={(type) => onAddNode(type)} />
      </div>
    ),
    endNode: (nodeProps) => (
      <div className="group relative">
        <EndNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
      </div>
    ),
    forceEndNode: (nodeProps) => (
      <div className="group relative">
        <ForceEndNode {...nodeProps} />
        <NodeControls node={nodeProps} onDelete={onDeleteNode} />
      </div>
    )
  };
};
