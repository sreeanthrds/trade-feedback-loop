
import React, { lazy, Suspense, useMemo, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useFlowState } from './hooks/useFlowState';
import { useFlowHandlers } from './hooks/useFlowHandlers';
import FlowLayout from './layout/FlowLayout';
import ReactFlowCanvas from './canvas/ReactFlowCanvas';
import { createNodeTypes } from './nodes/nodeTypes';
import { createEdgeTypes } from './edges/edgeTypes';
import '@xyflow/react/dist/style.css';
import './styles/menus.css';

// Lazy load the NodePanel component
const NodePanel = lazy(() => import('./NodePanel'));

const StrategyFlowContent = () => {
  const { theme } = useTheme();
  const stableHandlersRef = useRef({
    handleDeleteNode: null,
    handleAddNode: null,
    handleDeleteEdge: null,
    onNodeClick: null,
    resetStrategy: null,
    handleImportSuccess: null
  });
  
  const {
    nodes,
    edges,
    selectedNode,
    isPanelOpen,
    reactFlowWrapper,
    reactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setIsPanelOpen,
    setNodes,
    setEdges,
    strategyStore
  } = useFlowState();

  const {
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode,
    handleDeleteEdge,
    closePanel,
    resetStrategy,
    handleImportSuccess
  } = useFlowHandlers({
    nodes,
    edges,
    selectedNode,
    isPanelOpen,
    reactFlowWrapper,
    reactFlowInstance,
    setSelectedNode,
    setIsPanelOpen,
    setNodes,
    setEdges,
    strategyStore
  });

  // Update the stable handlers ref when the handlers change - put in useEffect to avoid render-time updates
  useEffect(() => {
    stableHandlersRef.current = {
      handleDeleteNode,
      handleAddNode,
      handleDeleteEdge,
      onNodeClick,
      resetStrategy,
      handleImportSuccess
    };
  }, [handleDeleteNode, handleAddNode, handleDeleteEdge, onNodeClick, resetStrategy, handleImportSuccess]);

  // Create stable handler callbacks using the ref
  const handleDeleteNodeStable = useCallback((id) => {
    stableHandlersRef.current.handleDeleteNode(id);
  }, []);
  
  const handleAddNodeStable = useCallback((type, parentId) => {
    stableHandlersRef.current.handleAddNode(type, parentId);
  }, []);
  
  const handleDeleteEdgeStable = useCallback((id) => {
    stableHandlersRef.current.handleDeleteEdge(id);
  }, []);
  
  const onNodeClickStable = useCallback((event, node) => {
    stableHandlersRef.current.onNodeClick(event, node);
  }, []);
  
  const resetStrategyStable = useCallback(() => {
    stableHandlersRef.current.resetStrategy();
  }, []);
  
  const handleImportSuccessStable = useCallback(() => {
    stableHandlersRef.current.handleImportSuccess();
  }, []);

  // Create node types and edge types once
  const nodeTypes = useMemo(() => createNodeTypes(handleDeleteNodeStable, handleAddNodeStable), [handleDeleteNodeStable, handleAddNodeStable]);
  const edgeTypes = useMemo(() => createEdgeTypes(handleDeleteEdgeStable), [handleDeleteEdgeStable]);

  // Create NodePanel component if needed
  const nodePanelComponent = useMemo(() => {
    if (isPanelOpen && selectedNode) {
      return (
        <Suspense fallback={<div className="p-4">Loading panel...</div>}>
          <NodePanel
            node={selectedNode}
            updateNodeData={updateNodeData}
            onClose={closePanel}
          />
        </Suspense>
      );
    }
    return null;
  }, [isPanelOpen, selectedNode, updateNodeData, closePanel]);

  // Memoize ReactFlowCanvas props to prevent unnecessary re-renders
  const flowCanvasProps = useMemo(() => ({
    flowRef: reactFlowWrapper,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick: onNodeClickStable,
    resetStrategy: resetStrategyStable,
    onImportSuccess: handleImportSuccessStable,
    onDeleteNode: handleDeleteNodeStable,
    onDeleteEdge: handleDeleteEdgeStable,
    onAddNode: handleAddNodeStable,
    nodeTypes,
    edgeTypes
  }), [
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClickStable,
    resetStrategyStable,
    handleImportSuccessStable,
    handleDeleteNodeStable,
    handleDeleteEdgeStable,
    handleAddNodeStable,
    nodeTypes,
    edgeTypes
  ]);

  return (
    <FlowLayout
      isPanelOpen={isPanelOpen}
      selectedNode={selectedNode}
      onClosePanel={closePanel}
      nodePanelComponent={nodePanelComponent}
    >
      <ReactFlowCanvas {...flowCanvasProps} />
    </FlowLayout>
  );
};

export default StrategyFlowContent;
