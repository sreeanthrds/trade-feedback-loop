
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Edge,
  Node,
  useReactFlow
} from '@xyflow/react';
import TopToolbar from '../toolbars/TopToolbar';
import BottomToolbar from '../toolbars/BottomToolbar';
import { createNodeTypes } from '../nodes/nodeTypes';
import { createEdgeTypes } from '../edges/edgeTypes';
import { Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReactFlowCanvasProps {
  flowRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  edges: any[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  resetStrategy: () => void;
  onImportSuccess: () => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onAddNode: (type: string) => void;
}

const ReactFlowCanvas = React.memo(({
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
  onAddNode
}: ReactFlowCanvasProps) => {
  const [minimapVisible, setMinimapVisible] = useState(false);
  const reactFlowInstance = useReactFlow();
  
  // Create node types with stable callbacks - memoized to prevent recreations
  const nodeTypes = useMemo(() => 
    createNodeTypes(onDeleteNode, onAddNode),
    [onDeleteNode, onAddNode]
  );
  
  // Create edge types with stable callbacks - memoized to prevent recreations
  const edgeTypes = useMemo(() => 
    createEdgeTypes(onDeleteEdge),
    [onDeleteEdge]
  );

  // Memoize the fit view function to prevent recreation
  const fitViewWithCustomZoom = useCallback(() => {
    if (!reactFlowInstance) return;
    
    reactFlowInstance.fitView({
      padding: 0.2,
      includeHiddenNodes: false,
      duration: 600, // Reduced from 800 for faster fit
      maxZoom: 1.0
    });
    
    // After fitting, zoom out by an additional 15%
    setTimeout(() => {
      const { zoom } = reactFlowInstance.getViewport();
      const newZoom = zoom * 0.85;
      
      reactFlowInstance.setViewport(
        { 
          x: reactFlowInstance.getViewport().x, 
          y: reactFlowInstance.getViewport().y, 
          zoom: newZoom 
        }, 
        { duration: 150 } // Reduced from 200 for faster animation
      );
    }, 650); // Reduced from 850 for faster transition
  }, [reactFlowInstance]);

  // Memoize default edge options to prevent regeneration
  const defaultEdgeOptions = useMemo(() => ({
    animated: true,
    style: { strokeWidth: 1.5 }
  }), []);

  // Memoize fitViewOptions to prevent regeneration
  const fitViewOptions = useMemo(() => ({
    padding: 0.3,
    includeHiddenNodes: false,
    duration: 500, // Reduced from 600 for faster fit
    maxZoom: 0.85
  }), []);

  // Fit view whenever nodes or edges change
  useEffect(() => {
    // Only fit view if we have nodes and a valid flow instance
    if (nodes.length > 0 && reactFlowInstance) {
      // Use requestAnimationFrame for more efficient timing
      const timeoutId = window.setTimeout(() => {
        fitViewWithCustomZoom();
      }, 50); // Reduced from 100 for faster response
      
      return () => window.clearTimeout(timeoutId);
    }
  }, [nodes, edges, reactFlowInstance, fitViewWithCustomZoom]);

  const toggleMinimap = useCallback(() => {
    setMinimapVisible(prev => !prev);
  }, []);

  // Memoize minimap node color function
  const getNodeColor = useCallback((node: any) => {
    switch (node.type) {
      case 'startNode': return '#4CAF50';
      case 'signalNode': return '#2196F3';
      case 'actionNode': return '#FF9800';
      case 'endNode': return '#F44336';
      case 'forceEndNode': return '#9C27B0';
      default: return '#eee';
    }
  }, []);

  return (
    <div className="h-full w-full" ref={flowRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
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
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
        fitViewOptions={fitViewOptions}
      >
        <Background />
        <Controls />
        
        <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7 bg-background/80 backdrop-blur-sm" 
            onClick={toggleMinimap}
            type="button"
          >
            {minimapVisible ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
          
          {minimapVisible && (
            <MiniMap 
              className="rounded-md overflow-hidden border border-border"
              nodeStrokeWidth={1}
              nodeColor={getNodeColor}
            />
          )}
        </div>
        
        <TopToolbar />
        <BottomToolbar 
          resetStrategy={resetStrategy} 
          onImportSuccess={onImportSuccess}
        />
      </ReactFlow>
    </div>
  );
});

ReactFlowCanvas.displayName = 'ReactFlowCanvas';

export default ReactFlowCanvas;
