
import React from 'react';
import { NodeTypes } from '@xyflow/react';
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
const StartNodeWrapper = React.memo(({ data, id, type, onAddNode, ...rest }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedStartNode data={data} id={id} />
    <MemoizedNodeConnectControls showOn="start" onAddNode={onAddNode} parentNodeId={id} />
  </div>
));
StartNodeWrapper.displayName = 'StartNodeWrapper';

const SignalNodeWrapper = React.memo(({ data, id, type, onDelete, onAddNode, ...rest }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedSignalNode data={data} id={id} />
    <MemoizedNodeControls node={{ id, type, data }} onDelete={onDelete} />
    <MemoizedNodeConnectControls showOn="signal" onAddNode={onAddNode} parentNodeId={id} />
  </div>
));
SignalNodeWrapper.displayName = 'SignalNodeWrapper';

// Create a shared action node wrapper to handle all action node types
const ActionNodeWrapper = React.memo(({ data, id, type, onDelete, onAddNode, updateNodeData, ...rest }: NodeWrapperProps & { updateNodeData?: (id: string, data: any) => void }) => {
  // Determine action type from node type
  const actionType = type === 'entryNode' ? 'entry' : 
                     type === 'exitNode' ? 'exit' : 
                     type === 'alertNode' ? 'alert' : 'entry';
  
  // Enhance data with actionType and updateNodeData
  const enhancedData = React.useMemo(() => ({
    ...data,
    updateNodeData,
    actionType,
    positions: data.positions || []
  }), [data, updateNodeData, actionType]);
  
  return (
    <div className="group">
      <MemoizedActionNode data={enhancedData} id={id} type={type} {...rest} />
      <MemoizedNodeControls node={{ id, type, data }} onDelete={onDelete} />
      <MemoizedNodeConnectControls showOn={actionType} onAddNode={onAddNode} parentNodeId={id} />
    </div>
  );
});
ActionNodeWrapper.displayName = 'ActionNodeWrapper';

const EndNodeWrapper = React.memo(({ data, id, type, onDelete, ...rest }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedEndNode data={data} id={id} />
    <MemoizedNodeControls node={{ id, type, data }} onDelete={onDelete} />
  </div>
));
EndNodeWrapper.displayName = 'EndNodeWrapper';

const ForceEndNodeWrapper = React.memo(({ data, id, type, onDelete, ...rest }: NodeWrapperProps) => (
  <div className="group">
    <MemoizedForceEndNode data={data} id={id} />
    <MemoizedNodeControls node={{ id, type, data }} onDelete={onDelete} />
  </div>
));
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
    entryNode: (props) => (
      <ActionNodeWrapper 
        {...props} 
        draggable={true} 
        onDelete={onDeleteNode} 
        onAddNode={onAddNode} 
        updateNodeData={updateNodeData} 
      />
    ),
    exitNode: (props) => (
      <ActionNodeWrapper 
        {...props} 
        draggable={true} 
        onDelete={onDeleteNode} 
        onAddNode={onAddNode} 
        updateNodeData={updateNodeData} 
      />
    ),
    alertNode: (props) => (
      <ActionNodeWrapper 
        {...props} 
        draggable={true} 
        onDelete={onDeleteNode} 
        onAddNode={onAddNode} 
        updateNodeData={updateNodeData} 
      />
    ),
    endNode: (props) => <EndNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} />,
    forceEndNode: (props) => <ForceEndNodeWrapper {...props} draggable={true} onDelete={onDeleteNode} />
  };
};

export { createNodeTypes };
