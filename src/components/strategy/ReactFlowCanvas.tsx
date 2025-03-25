
import React, { useState, useRef, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Edge,
  Node
} from '@xyflow/react';
import TopToolbar from './toolbars/TopToolbar';
import BottomToolbar from './toolbars/BottomToolbar';
import { createNodeTypes } from './nodes/nodeTypes';
import { createEdgeTypes } from './edges/edgeTypes';
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
  
  // Create node types with stable callbacks
  const nodeTypes = useMemo(() => 
    createNodeTypes(onDeleteNode, onAddNode),
    [onDeleteNode, onAddNode]
  );
  
  // Create edge types with stable callbacks
  const edgeTypes = useMemo(() => 
    createEdgeTypes(onDeleteEdge),
    [onDeleteEdge]
  );

  const toggleMinimap = () => {
    setMinimapVisible(prev => !prev);
  };

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
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
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
              nodeColor={(node) => {
                switch (node.type) {
                  case 'startNode':
                    return '#4CAF50';
                  case 'signalNode':
                    return '#2196F3';
                  case 'actionNode':
                    return '#FF9800';
                  case 'endNode':
                    return '#F44336';
                  case 'forceEndNode':
                    return '#9C27B0';
                  default:
                    return '#eee';
                }
              }}
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
