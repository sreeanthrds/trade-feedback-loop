
import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useFlowState } from './hooks/useFlowState';
import FlowLayout from './layout/FlowLayout';
import ReactFlowCanvas from './canvas/ReactFlowCanvas';
import { createNodeTypes } from './nodes/nodeTypes';
import { createEdgeTypes } from './edges/edgeTypes';
import NodePanel from './NodePanel';
import BacktestConfigPanel from './backtesting/BacktestConfigPanel';
import BacktestingToggle from './backtesting/BacktestingToggle';
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
  const [isBacktestOpen, setIsBacktestOpen] = useState(false);
  
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

  const toggleBacktest = useCallback(() => {
    setIsBacktestOpen(prev => !prev);
  }, []);

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
    onAddNode: handleAddNode,
    updateNodeData,
    nodeTypes,
    edgeTypes,
    toggleBacktest
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
    handleAddNode,
    updateNodeData,
    nodeTypes,
    edgeTypes,
    toggleBacktest
  ]);

  return (
    <FlowLayout
      isPanelOpen={isPanelOpen}
      selectedNode={selectedNode}
      onClosePanel={closePanel}
      nodePanelComponent={nodePanelComponent}
      toolbarComponent={<BacktestingToggle onToggle={toggleBacktest} isOpen={isBacktestOpen} />}
    >
      <ReactFlowCanvas {...flowCanvasProps} />
      {isBacktestOpen && <BacktestConfigPanel />}
    </FlowLayout>
  );
};

export default StrategyFlowContent;
