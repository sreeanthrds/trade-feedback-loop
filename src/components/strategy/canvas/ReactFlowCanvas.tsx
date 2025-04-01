
import React, { useEffect, useRef, useCallback, memo, useState, useMemo } from 'react';
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
const MemoizedCanvasControls = memo(CanvasControls);

const ReactFlowCanvas = ({
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
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Custom nodes change handler with drag detection
  const customNodesChangeHandler = useCallback((changes) => {
    console.log('ReactFlowCanvas: Node changes detected', changes);
    handleNodesChange(changes, onNodesChange);
  }, [handleNodesChange, onNodesChange]);

  // Only fit view on initial load or when explicitly requested (import)
  useEffect(() => {
    // Only run this if we have nodes, a reactFlowInstance, and it's the initial load
    if (initialLoadRef.current && nodes.length > 0 && reactFlowInstance) {
      // Shorter initial delay to improve perceived performance
      const timeoutId = setTimeout(() => {
        fitViewWithCustomZoom();
        initialLoadRef.current = false;
        // Now that the view is fitted, mark the canvas as ready for full functionality
        setCanvasReady(true);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [nodes.length, reactFlowInstance, fitViewWithCustomZoom]);

  // Simple function to determine node class name for minimap
  const nodeClassName = useCallback((node) => {
    const classNames = [node.type];
    if (node.dragging) classNames.push('dragging');
    if (node.selected) classNames.push('selected');
    return classNames.join(' ');
  }, []);
  
  // Memoize default edge options
  const defaultEdgeOptions = useMemo(() => ({
    type: 'bezier',
    style: { strokeWidth: 1.5 }
  }), []);
  
  // Memoize fit view options
  const fitViewOptions = useMemo(() => ({
    padding: 0.3,
    includeHiddenNodes: false,
    duration: 200, // Shorter duration for faster fitting
    maxZoom: 0.85
  }), []);

  // Log nodes on mount for debugging
  useEffect(() => {
    console.log('Nodes in ReactFlowCanvas:', nodes);
  }, [nodes]);

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
        defaultEdgeOptions={defaultEdgeOptions}
        zoomOnScroll={false}
        zoomOnPinch={true}
        panOnScroll={true}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
        fitViewOptions={fitViewOptions}
        className="strategy-flow"
      >
        <MemoizedCanvasControls nodeClassName={nodeClassName} />
        
        <MemoizedTopToolbar />
        <MemoizedBottomToolbar 
          resetStrategy={resetStrategy} 
          onImportSuccess={onImportSuccess}
        />
      </ReactFlow>
    </div>
  );
};

// Wrap in memo to prevent unnecessary re-renders
ReactFlowCanvas.displayName = 'ReactFlowCanvas';

export default memo(ReactFlowCanvas);
