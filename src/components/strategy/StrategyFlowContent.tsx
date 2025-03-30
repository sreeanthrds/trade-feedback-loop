
import React, { useRef, useMemo } from 'react';
import { ReactFlow, Background, BackgroundVariant, Controls } from '@xyflow/react';
import { ReactFlowProvider } from '@xyflow/react';
import { createNodeTypes } from './nodes/nodeTypes';
import { createEdgeTypes } from './edges/edgeTypes';
import { useFlowState } from './hooks/useFlowState';
import { useFlowHandlers } from './hooks/useFlowHandlers';
import NodePanel from './NodePanel';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { BottomToolbar } from './toolbars/BottomToolbar';
import { TopToolbar } from './toolbars/TopToolbar';
import { NodeSidebar } from './NodeSidebar';
import ReactFlowCanvas from './canvas/ReactFlowCanvas';

const StrategyFlowContent: React.FC = () => {
  // Get all flow state from a custom hook
  const flowState = useFlowState();
  const isMobile = useIsMobile();
  
  // Get all flow handlers from a custom hook
  const {
    onNodeClick,
    handleAddNode,
    updateNodeData,
    handleDeleteNode,
    handleDeleteEdge,
    closePanel,
    resetStrategy,
    handleImportSuccess
  } = useFlowHandlers(flowState);
  
  // Create memoized node and edge types
  const nodeTypes = useMemo(() => 
    createNodeTypes(handleDeleteNode, handleAddNode, updateNodeData),
    [handleDeleteNode, handleAddNode, updateNodeData]
  );
  
  const edgeTypes = useMemo(() => 
    createEdgeTypes(handleDeleteEdge),
    [handleDeleteEdge]
  );
  
  // On mobile, use a sheet for the panel
  if (isMobile) {
    return (
      <div className="h-full w-full relative">
        <ReactFlowProvider>
          <TopToolbar 
            onReset={resetStrategy} 
            onImportSuccess={handleImportSuccess} 
          />
          
          <ReactFlowCanvas
            nodes={flowState.nodes}
            edges={flowState.edges}
            onNodesChange={flowState.onNodesChange}
            onEdgesChange={flowState.onEdgesChange}
            onConnect={flowState.onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={onNodeClick}
            reactFlowWrapper={flowState.reactFlowWrapper}
          />
          
          <Sheet open={flowState.isPanelOpen} onOpenChange={flowState.setIsPanelOpen}>
            <SheetContent side="bottom" className="h-[85vh] py-0 px-0">
              {flowState.selectedNode && (
                <NodePanel 
                  node={flowState.selectedNode} 
                  updateNodeData={updateNodeData} 
                  onClose={closePanel} 
                />
              )}
            </SheetContent>
          </Sheet>
          
          <BottomToolbar />
        </ReactFlowProvider>
      </div>
    );
  }
  
  // On desktop, use a split layout
  return (
    <div className="h-full w-full grid grid-cols-[1fr_auto] gap-0">
      <ReactFlowProvider>
        <div className="relative flex flex-col h-full">
          <TopToolbar 
            onReset={resetStrategy} 
            onImportSuccess={handleImportSuccess} 
          />
          
          <div className="flex-grow relative">
            <ReactFlowCanvas
              nodes={flowState.nodes}
              edges={flowState.edges}
              onNodesChange={flowState.onNodesChange}
              onEdgesChange={flowState.onEdgesChange}
              onConnect={flowState.onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodeClick={onNodeClick}
              reactFlowWrapper={flowState.reactFlowWrapper}
            />
          </div>
          
          <BottomToolbar />
        </div>
        
        <div className={`bg-background border-l border-border transition-all duration-300 ${flowState.isPanelOpen ? 'w-[420px]' : 'w-0 overflow-hidden'}`}>
          {flowState.isPanelOpen && flowState.selectedNode && (
            <NodePanel 
              node={flowState.selectedNode} 
              updateNodeData={updateNodeData} 
              onClose={closePanel}
            />
          )}
        </div>
      </ReactFlowProvider>
      
      <NodeSidebar onAddNode={handleAddNode} />
    </div>
  );
};

export default StrategyFlowContent;
