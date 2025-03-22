
import React, { useCallback } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { useTheme } from '@/hooks/use-theme';
import { initialNodes } from './utils/flowUtils';
import { useFlowState } from './hooks/useFlowState';
import { 
  createNodeClickHandler, 
  createAddNodeHandler, 
  createUpdateNodeDataHandler, 
  createResetStrategyHandler,
  createImportSuccessHandler
} from './utils/eventHandlers';
import FlowLayout from './layout/FlowLayout';
import ReactFlowCanvas from './ReactFlowCanvas';
import '@xyflow/react/dist/style.css';
import './StrategyFlow.css';

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

  return (
    <FlowLayout
      isPanelOpen={isPanelOpen}
      selectedNode={selectedNode}
      onAddNode={handleAddNode}
      updateNodeData={updateNodeData}
      onClosePanel={closePanel}
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
