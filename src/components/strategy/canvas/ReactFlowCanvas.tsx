
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
  const reactFlowInstanceRef = useRef(null);
  const nodesLengthRef = useRef(nodes.length);
  const edgesLengthRef = useRef(edges.length);

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
    console.log(`Import success handler called in ReactFlowCanvas for strategy: ${currentStrategyId}`);
    console.log(`Current nodes: ${nodes.length}, edges: ${edges.length}`);
    
    if (reactFlowInstanceRef.current) {
      // Schedule multiple fit view attempts to ensure it works
      // This helps with async state updates that might not be fully processed
      const scheduleMultipleFitViewAttempts = () => {
        // First attempt
        setTimeout(() => {
          try {
            console.log("First fit view attempt after import");
            fitView();
          } catch (e) {
            console.error("Error in first fit view attempt:", e);
          }
          
          // Second attempt with longer delay
          setTimeout(() => {
            try {
              console.log("Second fit view attempt after import");
              fitView();
            } catch (e) {
              console.error("Error in second fit view attempt:", e);
            }
            
            // Final attempt with even longer delay
            setTimeout(() => {
              try {
                console.log("Final fit view attempt after import");
                fitView();
              } catch (e) {
                console.error("Error in final fit view attempt:", e);
              }
            }, 1000);
          }, 500);
        }, 200);
      };
      
      scheduleMultipleFitViewAttempts();
    }
    
    // Call the parent's import success handler
    onImportSuccess();
  }, [fitView, onImportSuccess, nodes.length, edges.length, currentStrategyId]);

  // When nodes change significantly (particularly on import), trigger a fit view
  useEffect(() => {
    const nodeCountChanged = nodes.length !== nodesLengthRef.current;
    const edgeCountChanged = edges.length !== edgesLengthRef.current;
    
    if ((nodeCountChanged || edgeCountChanged) && nodes.length > 0 && reactFlowInstanceRef.current) {
      console.log(`Major change detected - nodes: ${nodes.length} (was ${nodesLengthRef.current}), edges: ${edges.length} (was ${edgesLengthRef.current})`);
      
      // Update refs immediately to prevent multiple triggers
      nodesLengthRef.current = nodes.length;
      edgesLengthRef.current = edges.length;
      
      // Fit view with delay to allow rendering
      setTimeout(() => {
        try {
          console.log("Fitting view after major change in nodes/edges");
          fitView();
        } catch (e) {
          console.error("Error fitting view after major change:", e);
        }
      }, 300);
    }
  }, [nodes.length, edges.length, fitView]);

  // Important: Add logging to help troubleshoot the backtest panel toggle
  const handleToggleBacktest = useCallback(() => {
    console.log("Toggle backtest called from ReactFlowCanvas");
    if (toggleBacktest) {
      toggleBacktest();
    }
  }, [toggleBacktest]);

  return (
    <div 
      className="strategy-flow-container" 
      ref={flowRef} 
      onDragOver={onDragOver} 
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={wrappedNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onInit={(instance) => {
          console.log("ReactFlow initialized");
          reactFlowInstanceRef.current = instance;
        }}
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
