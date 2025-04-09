
import React, { useCallback, useRef, useEffect } from 'react';
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
  const canvasKeyRef = useRef(`flow-${currentStrategyId || Date.now()}`);

  // CRITICAL: Track strategy ID changes and update key to force remount
  useEffect(() => {
    if (currentStrategyId !== currentStrategyIdRef.current) {
      // Strategy has changed - update the key to force remount
      canvasKeyRef.current = `flow-${currentStrategyId || Date.now()}-${Date.now()}`;
      currentStrategyIdRef.current = currentStrategyId;
      console.log(`ReactFlowCanvas: Strategy changed - updating key to ${canvasKeyRef.current}`);
      
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
    
    // Set a timeout to ensure we have the latest nodes/edges
    setTimeout(() => {
      if (reactFlowInstanceRef.current) {
        console.log("Fitting view after import with multiple attempts");
        
        // First attempt
        try {
          fitView();
        } catch (e) {
          console.error("Error in first fit view attempt:", e);
        }
        
        // Second attempt after a delay
        setTimeout(() => {
          try {
            fitView();
            
            // Force a zoom adjustment to ensure we see the whole strategy
            if (reactFlowInstanceRef.current) {
              const { zoom } = reactFlowInstanceRef.current.getViewport();
              reactFlowInstanceRef.current.setViewport({
                x: reactFlowInstanceRef.current.getViewport().x,
                y: reactFlowInstanceRef.current.getViewport().y,
                zoom: zoom * 0.9 // Zoom out slightly
              }, { duration: 300 });
            }
          } catch (e) {
            console.error("Error in second fit view attempt:", e);
          }
          
          // Third attempt after another delay
          setTimeout(() => {
            try {
              fitView();
            } catch (e) {
              console.error("Error in third fit view attempt:", e);
            }
            
            // Release import flag
            importInProgressRef.current = false;
            
            // Call the parent's import success handler
            onImportSuccess();
          }, 600);
        }, 600);
      } else {
        importInProgressRef.current = false;
        onImportSuccess();
      }
    }, 300);
  }, [fitView, onImportSuccess, nodes.length, edges.length]);

  // Add logging for backtest panel toggle
  const handleToggleBacktest = useCallback(() => {
    console.log("Toggle backtest called from ReactFlowCanvas");
    if (toggleBacktest) {
      toggleBacktest();
    }
  }, [toggleBacktest]);
  
  // Update instance ref when initialized
  const handleInit = useCallback((instance) => {
    console.log(`ReactFlow initialized for strategy: ${currentStrategyIdRef.current} with key ${canvasKeyRef.current}`);
    reactFlowInstanceRef.current = instance;
    
    // Fit view on init
    setTimeout(() => {
      try {
        fitView();
      } catch (e) {
        console.error("Error in initial fit view:", e);
      }
    }, 300);
  }, [fitView]);

  return (
    <div 
      className="strategy-flow-container" 
      ref={flowRef} 
      onDragOver={onDragOver} 
      onDrop={onDrop}
    >
      <ReactFlow
        key={canvasKeyRef.current} // Use dynamic key to force remount on strategy changes
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
