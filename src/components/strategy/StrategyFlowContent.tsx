
import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useFlowState } from './hooks/useFlowState';
import { useFlowHandlers } from './hooks/useFlowHandlers';
import FlowLayout from './layout/FlowLayout';
import ReactFlowCanvas from './ReactFlowCanvas';

// Lazy load the NodePanel component
const NodePanel = lazy(() => import('./NodePanel'));

const StrategyFlowContent = () => {
  const { theme, setTheme } = useTheme();
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Debug state management
  useEffect(() => {
    console.log('StrategyFlowContent - selectedNode:', selectedNode);
    console.log('StrategyFlowContent - isPanelOpen:', isPanelOpen);
  }, [selectedNode, isPanelOpen]);

  // Safe wrapper for updateNodeData that preserves existing data
  const safeUpdateNodeData = (id: string, newData: any) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      const updatedData = { ...node.data, ...newData };
      updateNodeData(id, updatedData);
    }
  };

  // Create a NodePanel component with fallback that uses Suspense
  // Only render when selectedNode is valid and panel is open
  const renderNodePanel = () => {
    if (!isPanelOpen || !selectedNode) {
      return null;
    }

    return (
      <Suspense fallback={<div className="p-4">Loading panel...</div>}>
        <NodePanel
          node={selectedNode}
          updateNodeData={safeUpdateNodeData}
          onClose={closePanel}
        />
      </Suspense>
    );
  };

  return (
    <FlowLayout
      isPanelOpen={isPanelOpen}
      selectedNode={selectedNode}
      onAddNode={handleAddNode}
      updateNodeData={safeUpdateNodeData}
      onClosePanel={closePanel}
      nodePanelComponent={renderNodePanel()}
    >
      <ReactFlowCanvas
        flowRef={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        toggleTheme={toggleTheme}
        resetStrategy={resetStrategy}
        onImportSuccess={handleImportSuccess}
        onDeleteNode={handleDeleteNode}
        onDeleteEdge={handleDeleteEdge}
        onAddNode={handleAddNode}
      />
    </FlowLayout>
  );
};

export default StrategyFlowContent;
