
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { ReactFlow, Controls, Background, BackgroundVariant, Node, Edge } from '@xyflow/react';
import BottomToolbar from '../toolbars/BottomToolbar';
import TopToolbar from '../toolbars/TopToolbar';
import { useDragHandling } from './useDragHandling';
import { useViewportUtils } from './useViewportUtils';
import { NodeTypesObj } from '../nodes/nodeTypes';
import { EdgeTypesObj } from '../edges/edgeTypes';
import '../styles/index.css';
import { useSearchParams } from 'react-router-dom';

export interface ReactFlowCanvasProps {
  flowRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  resetStrategy: () => void;
  onImportSuccess: () => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddNode: (type: string, position: { x: number, y: number }) => void;
  updateNodeData: (nodeId: string, newData: any) => void;
  nodeTypes: NodeTypesObj;
  edgeTypes: EdgeTypesObj;
  toggleBacktest?: () => void;
}

const ReactFlowCanvas: React.FC<ReactFlowCanvasProps> = ({
  flowRef,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  resetStrategy,
  onImportSuccess,
  onDeleteNode,
  onDeleteEdge,
  onAddNode,
  updateNodeData,
  nodeTypes,
  edgeTypes,
  toggleBacktest
}) => {
  const {
    onDragOver,
    onDrop,
    handleNodesChange: internalHandleNodesChange
  } = useDragHandling(onAddNode);

  const {
    fitView
  } = useViewportUtils();

  const [searchParams] = useSearchParams();
  const currentStrategyId = searchParams.get('id') || '';
  const currentStrategyName = searchParams.get('name') || 'Untitled Strategy';
  const reactFlowInstanceRef = useRef(null);
  const nodesLengthRef = useRef(nodes.length);
  const edgesLengthRef = useRef(edges.length);
  const importInProgressRef = useRef(false);
  const lastImportRef = useRef(0);
  const currentStrategyIdRef = useRef(currentStrategyId);
  
  // Force remount of ReactFlow when strategy changes by using a unique key
  const [flowKey, setFlowKey] = useState(`flow-${currentStrategyId || Date.now()}`);

  // Log current state for debugging
  useEffect(() => {
    console.log(`Current state: ${nodes.length} nodes, ${edges.length} edges`);
    if (edges.length > 0) {
      console.log("Current edges:", JSON.stringify(edges));
    }
  }, [nodes.length, edges.length]);

  // Update flow key when strategy ID changes to force remount
  useEffect(() => {
    if (currentStrategyId !== currentStrategyIdRef.current) {
      console.log(`Strategy changed from ${currentStrategyIdRef.current} to ${currentStrategyId}, forcing remount`);
      setFlowKey(`flow-${currentStrategyId}-${Date.now()}`);
      currentStrategyIdRef.current = currentStrategyId;
      
      // Reset import flags when strategy changes
      importInProgressRef.current = false;
      lastImportRef.current = 0;
    }
  }, [currentStrategyId]);

  // Track node/edge changes to detect major updates
  useEffect(() => {
    nodesLengthRef.current = nodes.length;
    edgesLengthRef.current = edges.length;
  }, [nodes.length, edges.length]);

  // Listen for storage events to reload current strategy
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const strategyKey = `strategy_${currentStrategyId}`;
      if (e.key === strategyKey && e.newValue) {
        console.log(`Storage event detected for current strategy: ${strategyKey}`);
        console.log('Forcing ReactFlow remount to reload strategy');
        setFlowKey(`flow-${currentStrategyId}-${Date.now()}`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentStrategyId]);

  // Wrap onNodesChange to use our enhanced node change handler
  const wrappedNodesChange = useCallback((changes: any) => {
    internalHandleNodesChange(changes, onNodesChange);
  }, [internalHandleNodesChange, onNodesChange]);

  // Handle import success with improved viewport fitting
  const handleImportSuccess = useCallback(() => {
    // Prevent import handling if too recent (throttle)
    const now = Date.now();
    if (now - lastImportRef.current < 1000) {
      console.log("Import success handler called too soon, skipping");
      return;
    }
    
    // Update last import timestamp
    lastImportRef.current = now;
    
    // Prevent duplicate processing
    if (importInProgressRef.current) {
      console.log("Import already in progress, skipping additional callbacks");
      return;
    }
    
    importInProgressRef.current = true;
    console.log(`Import success handler called in ReactFlowCanvas for strategy: ${currentStrategyIdRef.current}`);
    console.log(`Current nodes: ${nodes.length}, edges: ${edges.length}`);
    
    // Force remount of ReactFlow to ensure clean state
    console.log('Forcing ReactFlow remount after import');
    setFlowKey(`flow-${currentStrategyId}-${Date.now()}`);
    
    // Set a timeout to ensure we have the latest nodes/edges
    setTimeout(() => {
      if (reactFlowInstanceRef.current) {
        console.log("Fitting view after import");
        try {
          fitView();
        } catch (e) {
          console.error("Error fitting view:", e);
        }
      }
      
      // Release import flag
      setTimeout(() => {
        importInProgressRef.current = false;
        
        // Call the parent's import success handler
        onImportSuccess();
        
        // Log the current state after import for debugging
        console.log(`After import: ${nodes.length} nodes, ${edges.length} edges`);
        if (edges.length > 0) {
          console.log("Edges after import:", JSON.stringify(edges));
        }
      }, 500);
    }, 500);
  }, [fitView, onImportSuccess, nodes.length, edges.length, currentStrategyId]);

  // Add logging for backtest panel toggle
  const handleToggleBacktest = useCallback(() => {
    console.log("Toggle backtest called from ReactFlowCanvas");
    if (toggleBacktest) {
      toggleBacktest();
    }
  }, [toggleBacktest]);
  
  // Update instance ref when initialized
  const handleInit = useCallback((instance) => {
    console.log(`ReactFlow initialized for strategy: ${currentStrategyIdRef.current} with key ${flowKey}`);
    reactFlowInstanceRef.current = instance;
    
    // Fit view on init
    setTimeout(() => {
      try {
        fitView();
      } catch (e) {
        console.error("Error in initial fit view:", e);
      }
    }, 300);
  }, [fitView, flowKey]);

  return (
    <div 
      className="strategy-flow-container" 
      ref={flowRef} 
      onDragOver={onDragOver} 
      onDrop={onDrop}
    >
      <ReactFlow
        key={flowKey}
        nodes={nodes}
        edges={edges}
        onNodesChange={wrappedNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={handleInit}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        snapToGrid
        snapGrid={[15, 15]}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        selectNodesOnDrag={false}
        className="strategy-flow"
      >
        <Background variant={BackgroundVariant.Dots} gap={15} size={1} color="#e2e8f0" />
        <Controls showInteractive={false} position="bottom-left" />
        <TopToolbar />
        <BottomToolbar 
          resetStrategy={resetStrategy} 
          onImportSuccess={handleImportSuccess} 
          toggleBacktest={handleToggleBacktest} 
        />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowCanvas;
