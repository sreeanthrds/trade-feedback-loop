
import React, { useCallback, useRef, useEffect } from 'react';
import { ReactFlow, Controls, Background, BackgroundVariant, Node, Edge } from '@xyflow/react';
import BottomToolbar from '../toolbars/BottomToolbar';
import TopToolbar from '../toolbars/TopToolbar';
import { useDragHandling } from './useDragHandling';
import { useViewportUtils } from './useViewportUtils';
import { NodeTypesObj } from '../nodes/nodeTypes';
import { EdgeTypesObj } from '../edges/edgeTypes';
import '../styles/index.css';

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

  const reactFlowInstanceRef = useRef(null);

  // Wrap onNodesChange to use our enhanced node change handler
  const wrappedNodesChange = useCallback((changes: any) => {
    internalHandleNodesChange(changes, onNodesChange);
  }, [internalHandleNodesChange, onNodesChange]);

  // Important: Add logging to help troubleshoot the backtest panel toggle
  const handleToggleBacktest = useCallback(() => {
    console.log("Toggle backtest called from ReactFlowCanvas");
    if (toggleBacktest) {
      toggleBacktest();
    }
  }, [toggleBacktest]);

  // When nodes change (particularly on import), trigger a fit view
  useEffect(() => {
    if (nodes.length > 0 && reactFlowInstanceRef.current) {
      // Only do this when we detect a major change in nodes (like after an import)
      if (nodes.length >= 1 && edges.length === 0) {
        console.log("Major change in nodes detected, fitting view");
        setTimeout(() => {
          fitView();
        }, 200);
      }
    }
  }, [nodes, edges, fitView]);

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
        <BottomToolbar resetStrategy={resetStrategy} onImportSuccess={onImportSuccess} toggleBacktest={handleToggleBacktest} />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowCanvas;
