
import React from 'react';
import { NodeTypes, Position } from '@xyflow/react';
import StartNode from './StartNode';
import SignalNode from './SignalNode';
import ActionNode from './ActionNode';
import EntryNode from './EntryNode';
import ExitNode from './ExitNode';
import AlertNode from './AlertNode';
import ModifyNode from './ModifyNode';
import EndNode from './EndNode';
import ForceEndNode from './ForceEndNode';
import NodeControls from '../NodeControls';
import NodeConnectControls from '../NodeConnectControls';

// Define memoized base components
const MemoizedStartNode = React.memo(StartNode);
const MemoizedSignalNode = React.memo(SignalNode);
const MemoizedActionNode = React.memo(ActionNode);
const MemoizedEntryNode = React.memo(EntryNode);
const MemoizedExitNode = React.memo(ExitNode);
const MemoizedAlertNode = React.memo(AlertNode);
const MemoizedModifyNode = React.memo(ModifyNode);
const MemoizedEndNode = React.memo(EndNode);
const MemoizedForceEndNode = React.memo(ForceEndNode);
const MemoizedNodeControls = React.memo(NodeControls);
const MemoizedNodeConnectControls = React.memo(NodeConnectControls);

// Node wrapper props types
interface NodeWrapperProps {
  id: string;
  data: any;
  type: string;
  selected: boolean;
  dragging: boolean;
  zIndex: number;
  selectable: boolean;
  deletable: boolean;
  draggable: boolean;
  isConnectable: boolean;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  onDelete?: (id: string) => void;
  onAddNode?: (type: string, parentNodeId: string) => void;
  [key: string]: any;
}

// Create stable wrapper components
const StartNodeWrapper = React.memo(({ data, id, onAddNode, ...rest }: NodeWrapperProps) => {
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedStartNode data={data} id={id} {...rest} />
      <MemoizedNodeConnectControls showOn="start" onAddNode={onAddNode} parentNodeId={id} />
    </div>
  );
});
StartNodeWrapper.displayName = 'StartNodeWrapper';

const SignalNodeWrapper = React.memo(({ data, id, onDelete, onAddNode, ...rest }: NodeWrapperProps) => {
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedSignalNode data={data} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'signalNode', data }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="signal" onAddNode={onAddNode} parentNodeId={id} />
    </div>
  );
});
SignalNodeWrapper.displayName = 'SignalNodeWrapper';

const ActionNodeWrapper = React.memo(({ data, id, onDelete, onAddNode, updateNodeData, ...rest }: NodeWrapperProps & { updateNodeData?: (id: string, data: any) => void }) => {
  // Enhance data with updateNodeData function and ensure positions is always defined
  const enhancedData = React.useMemo(() => ({
    ...data,
    updateNodeData,
    positions: Array.isArray(data.positions) ? data.positions : [] // Ensure positions is always defined as an array
  }), [data, updateNodeData]);
  
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedActionNode data={enhancedData} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'actionNode', data }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode} parentNodeId={id} />
    </div>
  );
});
ActionNodeWrapper.displayName = 'ActionNodeWrapper';

const EntryNodeWrapper = React.memo(({ data, id, onDelete, onAddNode, updateNodeData, ...rest }: NodeWrapperProps & { updateNodeData?: (id: string, data: any) => void }) => {
  // Enhance data with updateNodeData function and ensure positions is always defined
  const enhancedData = React.useMemo(() => ({
    ...data,
    updateNodeData,
    positions: Array.isArray(data.positions) ? data.positions : [], // Ensure positions is always defined as an array
    actionType: 'entry' // Force action type to be 'entry'
  }), [data, updateNodeData]);
  
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedEntryNode data={enhancedData} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'entryNode', data }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode} parentNodeId={id} />
    </div>
  );
});
EntryNodeWrapper.displayName = 'EntryNodeWrapper';

const ExitNodeWrapper = React.memo(({ data, id, onDelete, onAddNode, updateNodeData, ...rest }: NodeWrapperProps & { updateNodeData?: (id: string, data: any) => void }) => {
  // Enhance data with updateNodeData function and ensure positions is always defined
  const enhancedData = React.useMemo(() => ({
    ...data,
    updateNodeData,
    positions: Array.isArray(data.positions) ? data.positions : [], // Ensure positions is always defined as an array
    actionType: 'exit' // Force action type to be 'exit'
  }), [data, updateNodeData]);
  
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedExitNode data={enhancedData} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'exitNode', data }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode} parentNodeId={id} />
    </div>
  );
});
ExitNodeWrapper.displayName = 'ExitNodeWrapper';

const ModifyNodeWrapper = React.memo(({ data, id, onDelete, onAddNode, updateNodeData, ...rest }: NodeWrapperProps & { updateNodeData?: (id: string, data: any) => void }) => {
  // Enhance data with updateNodeData function
  const enhancedData = React.useMemo(() => ({
    ...data,
    updateNodeData,
    actionType: 'modify' // Force action type to be 'modify'
  }), [data, updateNodeData]);
  
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedModifyNode data={enhancedData} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'modifyNode', data }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode} parentNodeId={id} />
    </div>
  );
});
ModifyNodeWrapper.displayName = 'ModifyNodeWrapper';

const AlertNodeWrapper = React.memo(({ data, id, onDelete, onAddNode, updateNodeData, ...rest }: NodeWrapperProps & { updateNodeData?: (id: string, data: any) => void }) => {
  // Enhance data with updateNodeData function and ensure positions is always defined
  const enhancedData = React.useMemo(() => ({
    ...data,
    updateNodeData,
    positions: Array.isArray(data.positions) ? data.positions : [], // Ensure positions is always defined as an array
    actionType: 'alert' // Force action type to be 'alert'
  }), [data, updateNodeData]);
  
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedAlertNode data={enhancedData} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'alertNode', data }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn="action" onAddNode={onAddNode} parentNodeId={id} />
    </div>
  );
});
AlertNodeWrapper.displayName = 'AlertNodeWrapper';

const EndNodeWrapper = React.memo(({ data, id, onDelete, ...rest }: NodeWrapperProps) => {
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedEndNode data={data} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'endNode', data }} onDelete={onDelete} />
    </div>
  );
});
EndNodeWrapper.displayName = 'EndNodeWrapper';

const ForceEndNodeWrapper = React.memo(({ data, id, onDelete, ...rest }: NodeWrapperProps) => {
  return (
    <div className={`group ${rest.dragging ? 'dragging' : ''} ${rest.selected ? 'selected' : ''}`}>
      <MemoizedForceEndNode data={data} id={id} {...rest} />
      <MemoizedNodeControls node={{ id, type: 'forceEndNode', data }} onDelete={onDelete} />
    </div>
  );
});
ForceEndNodeWrapper.displayName = 'ForceEndNodeWrapper';

// Create a function to generate nodeTypes with stable renderer functions
const createNodeTypes = (
  onDeleteNode: (id: string) => void, 
  onAddNode: (type: string, parentNodeId: string) => void,
  updateNodeData?: (id: string, data: any) => void
): NodeTypes => {
  return {
    startNode: (props) => <StartNodeWrapper {...props} draggable={true} onAddNode={onAddNode} />,
    signalNode: (props) => <SignalNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} onAddNode={onAddNode} />,
    actionNode: (props) => <ActionNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} onAddNode={onAddNode} updateNodeData={updateNodeData} />,
    entryNode: (props) => <EntryNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} onAddNode={onAddNode} updateNodeData={updateNodeData} />,
    exitNode: (props) => <ExitNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} onAddNode={onAddNode} updateNodeData={updateNodeData} />,
    modifyNode: (props) => <ModifyNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} onAddNode={onAddNode} updateNodeData={updateNodeData} />,
    alertNode: (props) => <AlertNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} onAddNode={onAddNode} updateNodeData={updateNodeData} />,
    endNode: (props) => <EndNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} />,
    forceEndNode: (props) => <ForceEndNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} />
  };
};

export { createNodeTypes };
