
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
  
  // Store handlers in a ref to prevent render-time updates
  const handlersRef = useRef(null);
  
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

  // Create handlers but don't cause renders when they're updated
  // Make sure we pass all required props correctly
  const handlers = useFlowHandlers({
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
  
  // Update the ref without causing renders
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Create stable callback versions of the handlers using the ref
  const onNodeClick = useCallback((event, node) => {
    if (handlersRef.current) {
      handlersRef.current.onNodeClick(event, node);
    }
  }, []);
  
  const handleAddNode = useCallback((type, parentId) => {
    if (handlersRef.current) {
      handlersRef.current.handleAddNode(type, parentId);
    }
  }, []);
  
  const handleDeleteNode = useCallback((id) => {
    if (handlersRef.current) {
      handlersRef.current.handleDeleteNode(id);
    }
  }, []);
  
  const handleDeleteEdge = useCallback((id) => {
    if (handlersRef.current) {
      handlersRef.current.handleDeleteEdge(id);
    }
  }, []);
  
  const updateNodeData = useCallback((id, data) => {
    if (handlersRef.current) {
      handlersRef.current.updateNodeData(id, data);
    }
  }, []);

  const closePanel = useCallback(() => {
    if (handlersRef.current) {
      handlersRef.current.closePanel();
    }
  }, []);
  
  const resetStrategy = useCallback(() => {
    if (handlersRef.current) {
      handlersRef.current.resetStrategy();
    }
  }, []);
  
  const handleImportSuccess = useCallback(() => {
    if (handlersRef.current) {
      handlersRef.current.handleImportSuccess();
    }
  }, []);

  // Create node types and edge types once
  const nodeTypes = useMemo(() => 
    createNodeTypes(handleDeleteNode, handleAddNode, updateNodeData), 
    [handleDeleteNode, handleAddNode, updateNodeData]
  );
  
  const edgeTypes = useMemo(() => 
    createEdgeTypes(handleDeleteEdge), 
    [handleDeleteEdge]
  );

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
    onNodeClick,
    resetStrategy,
    onImportSuccess: handleImportSuccess,
    onDeleteNode: handleDeleteNode,
    onDeleteEdge: handleDeleteEdge,
    onAddNode: handleAddNode,
    updateNodeData,
    nodeTypes,
    edgeTypes
  }), [
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    resetStrategy,
    handleImportSuccess,
    handleDeleteNode,
    handleDeleteEdge,
    handleAddNode,
    updateNodeData,
    nodeTypes,
    edgeTypes,
    reactFlowWrapper
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
