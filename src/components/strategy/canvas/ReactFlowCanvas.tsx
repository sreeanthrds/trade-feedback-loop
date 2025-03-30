
import React, { useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { ReactFlow, useReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import { useDragHandling } from './useDragHandling';
import { useViewportUtils } from './useViewportUtils';
import CanvasControls from './CanvasControls';

interface ReactFlowCanvasProps {
  nodes: any[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  flowRef: React.RefObject<HTMLDivElement>;
  resetStrategy: () => void;
  onImportSuccess: () => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onAddNode: (type: string, parentNodeId?: string) => void;
  updateNodeData?: (id: string, data: any) => void;
  nodeTypes: any;
  edgeTypes: any;
}

const ReactFlowCanvas = memo(({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  flowRef,
  nodeTypes,
  edgeTypes
}: ReactFlowCanvasProps) => {
  // Get the ReactFlow instance safely
  let reactFlowInstance;
  try {
    reactFlowInstance = useReactFlow();
  } catch (error) {
    console.warn('ReactFlow not initialized yet');
    return <div className="h-full w-full flex items-center justify-center">Loading canvas...</div>;
  }
  
  const initialLoadRef = useRef(true);
  const renderCountRef = useRef(0);
  const { fitViewWithCustomZoom } = useViewportUtils();
  const { isNodeDraggingRef, handleNodesChange } = useDragHandling();
  
  // Increment render count for debugging
  renderCountRef.current += 1;
  console.log(`Canvas render #${renderCountRef.current}`);
  
  // Memoize default edge options to prevent unnecessary rerenders
  const defaultEdgeOptions = useMemo(() => ({
    animated: true,
    style: { strokeWidth: 1.5 }
  }), []);
  
  // Memoize fit view options to prevent unnecessary rerenders
  const fitViewOptions = useMemo(() => ({
    padding: 0.3,
    includeHiddenNodes: false,
    duration: 300,
    maxZoom: 0.85
  }), []);
  
  // Properly defined snapGrid with explicit typing
  const snapGrid: [number, number] = useMemo(() => [15, 15], []);
  
  // Custom nodes change handler with drag detection
  const customNodesChangeHandler = useCallback((changes) => {
    handleNodesChange(changes, onNodesChange);
  }, [handleNodesChange, onNodesChange]);

  // Only fit view on initial load or when explicitly requested (import)
  useEffect(() => {
    if (!initialLoadRef.current || !nodes.length || !reactFlowInstance) {
      return;
    }
    
    // Initial load fit view - use a debounce approach
    const timeoutId = setTimeout(() => {
      fitViewWithCustomZoom();
      initialLoadRef.current = false;
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [nodes.length, reactFlowInstance, fitViewWithCustomZoom]);

  // Simple function to determine node class name for minimap
  const nodeClassName = useCallback((node) => node.type, []);

  // Prevent unnecessary renders by memoizing props
  const memoizedProps = useMemo(() => ({
    nodes,
    edges,
    onNodesChange: customNodesChangeHandler,
    onEdgesChange,
    onConnect,
    onNodeClick,
    nodeTypes,
    edgeTypes,
    minZoom: 0.4,
    maxZoom: 2,
    defaultViewport: { x: 0, y: 0, zoom: 0.6 },
    snapToGrid: true,
    snapGrid,
    defaultEdgeOptions,
    zoomOnScroll: false,
    zoomOnPinch: true,
    panOnScroll: true,
    nodesDraggable: true,
    elementsSelectable: true,
    proOptions: { hideAttribution: true },
    fitViewOptions
  }), [
    nodes, 
    edges, 
    customNodesChangeHandler, 
    onEdgesChange, 
    onConnect, 
    onNodeClick, 
    nodeTypes, 
    edgeTypes,
    snapGrid,
    defaultEdgeOptions,
    fitViewOptions
  ]);

  return (
    <div className="h-full w-full" ref={flowRef}>
      <ReactFlow {...memoizedProps}>
        <CanvasControls nodeClassName={nodeClassName} />
        <Background
          color="#aaa"
          gap={16}
          size={1}
          variant={BackgroundVariant.Dots}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
});

ReactFlowCanvas.displayName = 'ReactFlowCanvas';

export default ReactFlowCanvas;
