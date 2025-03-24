
import React, { lazy, Suspense } from 'react';
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

  // Create a NodePanel component that uses Suspense
  const LazyNodePanel = isPanelOpen && selectedNode ? (
    <Suspense fallback={<div className="p-4">Loading panel...</div>}>
      <NodePanel
        node={selectedNode}
        updateNodeData={updateNodeData}
        onClose={closePanel}
      />
    </Suspense>
  ) : null;

  return (
    <FlowLayout
      isPanelOpen={isPanelOpen}
      selectedNode={selectedNode}
      onAddNode={handleAddNode}
      updateNodeData={updateNodeData}
      onClosePanel={closePanel}
      nodePanelComponent={LazyNodePanel}
    >
      <ReactFlowCanvas
        flowRef={reactFlowWrapper}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
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
