
import React, { useEffect, useRef, useCallback, memo } from 'react';
import { ReactFlow, useReactFlow } from '@xyflow/react';
import TopToolbar from '../toolbars/TopToolbar';
import BottomToolbar from '../toolbars/BottomToolbar';
import CanvasControls from './CanvasControls';
import { useViewportUtils } from './useViewportUtils';
import { useDragHandling } from './useDragHandling';

interface ReactFlowCanvasProps {
  flowRef: React.RefObject<HTMLDivElement>;
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  resetStrategy: () => void;
  onImportSuccess: () => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onAddNode: (type: string, parentNodeId?: string) => void;
  updateNodeData?: (id: string, data: any) => void;
  nodeTypes: any;
  edgeTypes: any;
}

// Memoize the toolbars to prevent unnecessary renders
const MemoizedTopToolbar = memo(TopToolbar);
const MemoizedBottomToolbar = memo(BottomToolbar);

const ReactFlowCanvas = memo(({
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
  edgeTypes
}: ReactFlowCanvasProps) => {
  const reactFlowInstance = useReactFlow();
  const initialLoadRef = useRef(true);
  const { fitViewWithCustomZoom } = useViewportUtils();
  const { isNodeDraggingRef, handleNodesChange } = useDragHandling();
  
  // Log nodes for debugging
  useEffect(() => {
    console.log("Current nodes in ReactFlowCanvas:", nodes);
  }, [nodes]);
  
  // Custom nodes change handler with drag detection
  const customNodesChangeHandler = useCallback((changes) => {
    console.log("Node changes:", changes);
    handleNodesChange(changes, onNodesChange);
  }, [handleNodesChange, onNodesChange]);

  // Only fit view on initial load or when explicitly requested (import)
  useEffect(() => {
    if (initialLoadRef.current && nodes.length > 0 && reactFlowInstance) {
      // Initial load fit view - use a debounce approach
      const timeoutId = setTimeout(() => {
        fitViewWithCustomZoom();
        initialLoadRef.current = false;
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, reactFlowInstance, fitViewWithCustomZoom]);

  // Simple function to determine node class name for minimap
  const nodeClassName = useCallback((node) => node.type, []);

  // Prepare toolbar props
  const bottomToolbarProps = useCallback(() => ({
    resetStrategy,
    onImportSuccess
  }), [resetStrategy, onImportSuccess]);

  return (
    <div className="h-full w-full" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={customNodesChangeHandler}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.4}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 1.5 }
        }}
        zoomOnScroll={false}
        zoomOnPinch={true}
        panOnScroll={true}
        nodesDraggable={true}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
        fitViewOptions={{
          padding: 0.3,
          includeHiddenNodes: false,
          duration: 300,
          maxZoom: 0.85
        }}
      >
        <CanvasControls nodeClassName={nodeClassName} />
        
        <MemoizedTopToolbar />
        <MemoizedBottomToolbar 
          resetStrategy={resetStrategy} 
          onImportSuccess={onImportSuccess}
        />
      </ReactFlow>
    </div>
  );
});

ReactFlowCanvas.displayName = 'ReactFlowCanvas';

export default ReactFlowCanvas;
