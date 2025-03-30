
import React, { lazy, Suspense, useMemo, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useFlowState } from './hooks/useFlowState';
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
    strategyStore,
    handleAddNode,
    handleDeleteNode,
    handleDeleteEdge,
    updateNodeData,
    closePanel,
    resetStrategy,
    handleImportSuccess
  } = useFlowState();

  // Create node types and edge types only once
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
    onNodeClick: (event, node) => {
      setSelectedNode(node);
      setIsPanelOpen(true);
    },
    resetStrategy,
    onImportSuccess: handleImportSuccess,
    onDeleteNode: handleDeleteNode,
    onDeleteEdge: handleDeleteEdge,
    onAddNode: handleAddNode,
    updateNodeData,
    nodeTypes,
    edgeTypes
  }), [
    reactFlowWrapper,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setIsPanelOpen,
    resetStrategy,
    handleImportSuccess,
    handleDeleteNode,
    handleDeleteEdge,
    handleAddNode,
    updateNodeData,
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
