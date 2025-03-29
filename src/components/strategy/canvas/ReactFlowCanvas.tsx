
import React, { useEffect, useRef, useCallback, memo } from 'react';
import { ReactFlow, useReactFlow, Node, Edge } from '@xyflow/react';
import TopToolbar from '../toolbars/TopToolbar';
import BottomToolbar from '../toolbars/BottomToolbar';
import CanvasControls from './CanvasControls';
import { useViewportUtils } from './useViewportUtils';
import { useDragHandling } from './useDragHandling';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
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

const MemoizedTopToolbar = memo(TopToolbar);
const MemoizedBottomToolbar = memo(BottomToolbar);

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

  const customNodesChangeHandler = useCallback((changes) => {
    handleNodesChange(changes, onNodesChange);
  }, [handleNodesChange, onNodesChange]);

  useEffect(() => {
    if (initialLoadRef.current && nodes.length > 0 && reactFlowInstance) {
      const timeoutId = setTimeout(() => {
        fitViewWithCustomZoom();
        initialLoadRef.current = false;
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, reactFlowInstance, fitViewWithCustomZoom]);

  const nodeClassName = useCallback((node) => node.type, []);

  return (
    <div className="h-full w-full" ref={flowRef}>
      <DropdownMenu>
        <DropdownMenuTrigger className="fixed top-4 left-4 z-10 px-4 py-2 bg-background border rounded-md hover:bg-accent">
          Add Node
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => onAddNode('startNode')} className="flex items-center">
            <Play className="h-4 w-4 mr-2 text-emerald-500" />
            <span>Add Start Node</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onAddNode('signalNode')} className="flex items-center">
            <Activity className="h-4 w-4 mr-2 text-blue-600" />
            <span>Add Signal Node</span>
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-amber-600" />
              <span>Add Action Node</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onAddNode('actionNode', undefined, { actionType: 'entry' })}>
                <div className="flex items-center">
                  <ArrowUpCircle className="h-4 w-4 mr-2 text-emerald-500" />
                  <span>Entry Order</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNode('actionNode', undefined, { actionType: 'exit' })}>
                <div className="flex items-center">
                  <X className="h-4 w-4 mr-2 text-amber-600" />
                  <span>Exit Order</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNode('actionNode', undefined, { actionType: 'alert' })}>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                  <span>Alert Only</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuItem onClick={() => onAddNode('endNode')} className="flex items-center">
            <StopCircle className="h-4 w-4 mr-2 text-rose-600" />
            <span>Add End Node</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onAddNode('forceEndNode')} className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-purple-500" />
            <span>Add Force End Node</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
};

ReactFlowCanvas.displayName = 'ReactFlowCanvas';

export default ReactFlowCanvas;
