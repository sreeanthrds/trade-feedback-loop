
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { useTheme } from '@/hooks/use-theme';
import { 
  initialNodes, 
  addNodeFromConnection, 
  cleanupOrphanedEdges, 
  ensureStartNode 
} from './utils/flowUtils';
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
import { toast } from 'sonner';

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

  // State for node label editing
  const [nodeEditMode, setNodeEditMode] = useState<{ id: string; label: string } | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Ensure there's always a start node
  useEffect(() => {
    if (nodes.length === 0) {
      const newNodes = ensureStartNode([]);
      setNodes(newNodes);
      strategyStore.setNodes(newNodes);
    }
  }, [nodes, setNodes, strategyStore]);

  // When edges change, clean up orphaned edges
  useEffect(() => {
    const cleanedEdges = cleanupOrphanedEdges(nodes, edges);
    if (cleanedEdges.length !== edges.length) {
      setEdges(cleanedEdges);
      strategyStore.setEdges(cleanedEdges);
    }
  }, [nodes, edges, setEdges, strategyStore]);

  // Handle node clicks
  const onNodeClick = useCallback(
    createNodeClickHandler(setSelectedNode, setIsPanelOpen),
    [setSelectedNode, setIsPanelOpen]
  );

  // Handle node double clicks for label editing
  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: any) => {
    event.stopPropagation();
    setNodeEditMode({ id: node.id, label: node.data.label || '' });
    
    // Focus the input on the next tick after rendering
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 50);
  }, []);

  // Add a new node from the NodeControls
  const addNodeOnConnection = useCallback((sourceNodeId: string, nodeType: string) => {
    if (!reactFlowInstance) return;
    
    try {
      const { newNode, newEdge } = addNodeFromConnection(
        sourceNodeId,
        nodeType,
        reactFlowInstance,
        nodes,
        edges
      );
      
      const newNodes = [...nodes, newNode];
      const newEdges = [...edges, newEdge];
      
      setNodes(newNodes);
      setEdges(newEdges);
      strategyStore.setNodes(newNodes);
      strategyStore.setEdges(newEdges);
      strategyStore.addHistoryItem(newNodes, newEdges);
      
      toast.success(`Added ${nodeType.replace('Node', '')} node`);
    } catch (error) {
      console.error('Error adding node:', error);
      toast.error('Failed to add node');
    }
  }, [reactFlowInstance, nodes, edges, setNodes, setEdges, strategyStore]);

  // Delete a node
  const onDeleteNode = useCallback((nodeId: string) => {
    const nodeToDelete = nodes.find(n => n.id === nodeId);
    
    if (!nodeToDelete) return;
    
    // Check if it's the last start node
    const isStartNode = nodeToDelete.type === 'startNode';
    const startNodeCount = nodes.filter(n => n.type === 'startNode').length;
    
    if (isStartNode && startNodeCount <= 1 && nodes.length > 1) {
      toast.error("Cannot delete the only start node");
      return;
    }
    
    // Remove the node
    const newNodes = nodes.filter(n => n.id !== nodeId);
    
    // Cleanup orphaned edges
    const newEdges = edges.filter(e => 
      e.source !== nodeId && e.target !== nodeId
    );
    
    setNodes(newNodes);
    setEdges(newEdges);
    strategyStore.setNodes(newNodes);
    strategyStore.setEdges(newEdges);
    strategyStore.addHistoryItem(newNodes, newEdges);
    
    // If we deleted the selected node, close the panel
    if (selectedNode && selectedNode.id === nodeId) {
      setIsPanelOpen(false);
      setSelectedNode(null);
    }
    
    toast.success('Node deleted');
  }, [nodes, edges, setNodes, setEdges, strategyStore, selectedNode, setIsPanelOpen, setSelectedNode]);

  // Delete an edge
  const onDeleteEdge = useCallback((edgeId: string) => {
    const newEdges = edges.filter(e => e.id !== edgeId);
    
    setEdges(newEdges);
    strategyStore.setEdges(newEdges);
    strategyStore.addHistoryItem(nodes, newEdges);
    
    toast.success('Connection deleted');
  }, [edges, nodes, setEdges, strategyStore]);

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

  // Handle node label input change
  const handleLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!nodeEditMode) return;
    
    setNodeEditMode({
      ...nodeEditMode,
      label: e.target.value
    });
  };

  // Handle node label input blur - save changes
  const handleLabelInputBlur = () => {
    if (!nodeEditMode) return;
    
    // Update the node label
    const updatedNodes = nodes.map(node => {
      if (node.id === nodeEditMode.id) {
        return {
          ...node,
          data: {
            ...node.data,
            label: nodeEditMode.label
          }
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
    strategyStore.setNodes(updatedNodes);
    strategyStore.addHistoryItem(updatedNodes, edges);
    
    // Reset edit mode
    setNodeEditMode(null);
  };

  // Handle node label input key press
  const handleLabelInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLabelInputBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setNodeEditMode(null);
    }
  };

  return (
    <FlowLayout
      isPanelOpen={isPanelOpen}
      selectedNode={selectedNode}
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
        onNodeDoubleClick={onNodeDoubleClick}
        addNodeOnConnection={addNodeOnConnection}
        onDeleteNode={onDeleteNode}
        onDeleteEdge={onDeleteEdge}
        toggleTheme={toggleTheme}
        resetStrategy={resetStrategy}
        onImportSuccess={handleImportSuccess}
      />
      
      {/* Overlay for editing node label */}
      {nodeEditMode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/50"
          onClick={() => handleLabelInputBlur()}
        >
          <div 
            className="p-4 rounded-md shadow-md bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={editInputRef}
              type="text"
              value={nodeEditMode.label}
              onChange={handleLabelInputChange}
              onBlur={handleLabelInputBlur}
              onKeyDown={handleLabelInputKeyDown}
              className="px-2 py-1 border rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Node Label"
              autoFocus
            />
          </div>
        </div>
      )}
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
