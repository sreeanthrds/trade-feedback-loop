
import React, { useCallback, lazy, Suspense } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { useTheme } from '@/hooks/use-theme';
import { initialNodes } from './utils/flowUtils';
import { useFlowState } from './hooks/useFlowState';
import { 
  createNodeClickHandler, 
  createAddNodeHandler, 
  createUpdateNodeDataHandler, 
  createResetStrategyHandler,
  createImportSuccessHandler,
  createDeleteNodeHandler,
  createDeleteEdgeHandler
} from './utils/eventHandlers';
import FlowLayout from './layout/FlowLayout';
import ReactFlowCanvas from './ReactFlowCanvas';
import '@xyflow/react/dist/style.css';
import './StrategyFlow.css';

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

  const onNodeClick = useCallback(
    createNodeClickHandler(setSelectedNode, setIsPanelOpen),
    []
  );

  const handleAddNode = createAddNodeHandler(
    reactFlowInstance,
    reactFlowWrapper,
    nodes,
    setNodes,
    strategyStore
  );

  const updateNodeData = createUpdateNodeDataHandler(
    nodes,
    setNodes,
    strategyStore
  );
  
  const handleDeleteNode = createDeleteNodeHandler(
    nodes,
    edges,
    setNodes,
    setEdges,
    strategyStore
  );
  
  const handleDeleteEdge = createDeleteEdgeHandler(
    edges,
    setEdges,
    strategyStore,
    nodes
  );

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedNode(null);
  };

  const resetStrategy = createResetStrategyHandler(
    setNodes,
    setEdges,
    strategyStore,
    initialNodes,
    closePanel
  );

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleImportSuccess = createImportSuccessHandler(reactFlowInstance);

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

const StrategyFlow = () => {
  return (
    <ReactFlowProvider>
      <StrategyFlowContent />
    </ReactFlowProvider>
  );
};

export default StrategyFlow;
