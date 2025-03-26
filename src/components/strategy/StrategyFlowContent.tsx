
import React, { lazy, Suspense, useMemo } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { useFlowState } from './hooks/useFlowState';
import { useFlowHandlers } from './hooks/useFlowHandlers';
import FlowLayout from './layout/FlowLayout';
import ReactFlowCanvas from './canvas/ReactFlowCanvas';
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

  // Memoize ReactFlowCanvas props
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
    onAddNode: handleAddNode
  }), [
    nodes,
    edges,
    reactFlowWrapper,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    resetStrategy,
    handleImportSuccess,
    handleDeleteNode,
    handleDeleteEdge,
    handleAddNode
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
