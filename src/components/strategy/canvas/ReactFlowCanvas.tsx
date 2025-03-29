
import React, { useEffect, useRef, useCallback, memo, useState } from 'react';
import { ReactFlow, useReactFlow, Node, Edge } from '@xyflow/react';
import TopToolbar from '../toolbars/TopToolbar';
import BottomToolbar from '../toolbars/BottomToolbar';
import CanvasControls from './CanvasControls';
import { useViewportUtils } from './useViewportUtils';
import { useDragHandling } from './useDragHandling';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui/context-menu';
import { Play, Activity, SlidersHorizontal, StopCircle, AlertTriangle, ArrowUpCircle, X } from 'lucide-react';

interface ReactFlowCanvasProps {
  flowRef: React.RefObject<HTMLDivElement>;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  resetStrategy: () => void;
  onImportSuccess: () => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onAddNode: (type: string, parentNodeId?: string, initialNodeData?: Record<string, any>) => void;
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
  
  // Custom nodes change handler with drag detection
  const customNodesChangeHandler = useCallback((changes) => {
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

  const handleAddStartNode = () => {
    onAddNode('startNode');
  };

  const handleAddSignalNode = () => {
    onAddNode('signalNode');
  };

  const handleAddActionNodeWithType = (actionType: 'entry' | 'exit' | 'alert') => {
    onAddNode('actionNode', undefined, { actionType });
  };

  const handleAddEndNode = () => {
    onAddNode('endNode');
  };

  const handleAddForceEndNode = () => {
    onAddNode('forceEndNode');
  };

  return (
    <div className="h-full w-full" ref={flowRef}>
      <ContextMenu>
        <ContextMenuTrigger>
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
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem
            onClick={handleAddStartNode}
            className="flex items-center cursor-pointer"
          >
            <Play className="h-4 w-4 mr-2 text-emerald-500" />
            <span>Add Start Node</span>
          </ContextMenuItem>
          <ContextMenuItem
            onClick={handleAddSignalNode}
            className="flex items-center cursor-pointer"
          >
            <Activity className="h-4 w-4 mr-2 text-blue-600" />
            <span>Add Signal Node</span>
          </ContextMenuItem>
          
          <ContextMenuSub>
            <ContextMenuSubTrigger className="flex items-center cursor-pointer">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-amber-600" />
              <span>Add Action Node</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem 
                onClick={() => handleAddActionNodeWithType('entry')}
                className="flex items-center"
              >
                <ArrowUpCircle className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Entry Order</span>
              </ContextMenuItem>
              <ContextMenuItem 
                onClick={() => handleAddActionNodeWithType('exit')}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-2 text-amber-600" />
                <span>Exit Order</span>
              </ContextMenuItem>
              <ContextMenuItem 
                onClick={() => handleAddActionNodeWithType('alert')}
                className="flex items-center"
              >
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                <span>Alert Only</span>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          
          <ContextMenuItem
            onClick={handleAddEndNode}
            className="flex items-center cursor-pointer"
          >
            <StopCircle className="h-4 w-4 mr-2 text-rose-600" />
            <span>Add End Node</span>
          </ContextMenuItem>
          <ContextMenuItem
            onClick={handleAddForceEndNode}
            className="flex items-center cursor-pointer"
          >
            <AlertTriangle className="h-4 w-4 mr-2 text-purple-500" />
            <span>Add Force End Node</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
});

ReactFlowCanvas.displayName = 'ReactFlowCanvas';

export default ReactFlowCanvas;
