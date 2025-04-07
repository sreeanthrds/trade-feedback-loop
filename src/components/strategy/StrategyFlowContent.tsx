
import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useFlowState } from './hooks/useFlowState';
import FlowLayout from './layout/FlowLayout';
import ReactFlowCanvas from './canvas/ReactFlowCanvas';
import { createNodeTypes } from './nodes/nodeTypes';
import { createEdgeTypes } from './edges/edgeTypes';
import NodePanel from './NodePanel';
import BacktestingToggle from './backtesting/BacktestingToggle';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './styles/menus.css';

const NodePanelLoading = () => (
  <div className="p-4 animate-pulse">
    <div className="h-6 w-3/4 bg-muted rounded mb-4"></div>
    <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
    <div className="h-4 w-2/3 bg-muted rounded mb-2"></div>
    <div className="h-4 w-1/3 bg-muted rounded"></div>
  </div>
);

// Create node types and edge types outside the component to prevent re-creation on each render
const nodeTypesFactory = (handleDeleteNode, handleAddNode, updateNodeData) => 
  createNodeTypes(handleDeleteNode, handleAddNode, updateNodeData);

const edgeTypesFactory = (handleDeleteEdge) => 
  createEdgeTypes(handleDeleteEdge);

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
    handleImportSuccess,
    onNodeClick
  } = useFlowState();

  // Create node types and edge types with stable reference using useCallback
  const nodeTypes = useMemo(() => 
    nodeTypesFactory(handleDeleteNode, handleAddNode, updateNodeData), 
    [handleDeleteNode, handleAddNode, updateNodeData]
  );
  
  const edgeTypes = useMemo(() => 
    edgeTypesFactory(handleDeleteEdge), 
    [handleDeleteEdge]
  );

  // Create NodePanel component if needed - memoize with key dependencies only
  const nodePanelComponent = useMemo(() => {
    if (isPanelOpen && selectedNode) {
      return (
        <NodePanel
          node={selectedNode}
          updateNodeData={updateNodeData}
          onClose={closePanel}
        />
      );
    }
    return null;
  }, [isPanelOpen, selectedNode, updateNodeData, closePanel]);

  // Create an adapter for handleAddNode to match the ReactFlowCanvas prop signature
  const adaptedHandleAddNode = useCallback(
    (type: string, position: { x: number; y: number }) => {
      handleAddNode(type, position);
    },
    [handleAddNode]
  );

  // Memoize flow canvas props to prevent recreation on every render
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
    onAddNode: adaptedHandleAddNode,
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
    onNodeClick,
    resetStrategy,
    handleImportSuccess,
    handleDeleteNode,
    handleDeleteEdge,
    adaptedHandleAddNode,
    updateNodeData,
    nodeTypes,
    edgeTypes
  ]);

  // Add a backtest button component to link to the backtest page
  const BacktestButton = () => (
    <Link to="/backtesting">
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <BarChart className="h-4 w-4" />
        <span className="hidden sm:inline">Backtest</span>
      </Button>
    </Link>
  );

  return (
    <FlowLayout
      isPanelOpen={isPanelOpen}
      selectedNode={selectedNode}
      onClosePanel={closePanel}
      nodePanelComponent={nodePanelComponent}
      toolbarComponent={<BacktestButton />}
    >
      <ReactFlowCanvas {...flowCanvasProps} />
    </FlowLayout>
  );
};

export default StrategyFlowContent;
