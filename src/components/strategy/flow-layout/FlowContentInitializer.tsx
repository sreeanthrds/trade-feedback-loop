
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { createNodeTypes } from '../nodes/nodeTypes';
import { createEdgeTypes } from '../edges/edgeTypes';
import { Node } from '@xyflow/react';

interface FlowContentInitializerProps {
  flowState: any;
  flowHandlers: any;
  children: (props: {
    canvasProps: any;
    sidebarVisible: boolean;
    toggleSidebar: () => void;
  }) => React.ReactNode;
  onReady?: () => void;
}

const FlowContentInitializer: React.FC<FlowContentInitializerProps> = ({
  flowState,
  flowHandlers,
  children,
  onReady
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const readyFiredRef = useRef(false);
  
  // Notify parent when React Flow is ready
  useEffect(() => {
    if (flowState.isReactFlowReady && !readyFiredRef.current && onReady) {
      readyFiredRef.current = true;
      onReady();
    }
  }, [flowState.isReactFlowReady, onReady]);
  
  // If React Flow is not ready, do not render anything visible
  if (!flowState.isReactFlowReady) {
    return null;
  }
  
  // Destructure handlers for easier access
  const {
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode,
    handleDeleteEdge,
    closePanel,
    resetStrategy,
    handleImportSuccess
  } = flowHandlers;
  
  // Create memoized node and edge types - ensure they're stable
  const nodeTypes = useMemo(() => 
    createNodeTypes(handleDeleteNode, handleAddNode, updateNodeData),
    [handleDeleteNode, handleAddNode, updateNodeData]
  );
  
  const edgeTypes = useMemo(() => 
    createEdgeTypes(handleDeleteEdge),
    [handleDeleteEdge]
  );

  // Memoize the toggle function to prevent recreating it on each render
  const toggleSidebar = useCallback(() => {
    setSidebarVisible(prev => !prev);
  }, []);
  
  // Memoize the ReactFlowCanvas props to prevent extra renders
  const canvasProps = useMemo(() => ({
    nodes: flowState.nodes,
    edges: flowState.edges,
    onNodesChange: flowState.onNodesChange,
    onEdgesChange: flowState.onEdgesChange,
    onConnect: flowState.onConnect,
    nodeTypes,
    edgeTypes,
    onNodeClick,
    flowRef: flowState.reactFlowWrapper,
    resetStrategy,
    onImportSuccess: handleImportSuccess,
    onDeleteNode: handleDeleteNode,
    onDeleteEdge: handleDeleteEdge,
    onAddNode: handleAddNode,
    updateNodeData
  }), [
    flowState.nodes,
    flowState.edges,
    flowState.onNodesChange,
    flowState.onEdgesChange,
    flowState.onConnect,
    flowState.reactFlowWrapper,
    nodeTypes,
    edgeTypes,
    onNodeClick,
    resetStrategy,
    handleImportSuccess,
    handleDeleteNode,
    handleDeleteEdge,
    handleAddNode,
    updateNodeData
  ]);
  
  return (
    <>
      {children({
        canvasProps,
        sidebarVisible,
        toggleSidebar
      })}
    </>
  );
};

export default FlowContentInitializer;
