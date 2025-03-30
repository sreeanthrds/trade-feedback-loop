
import React, { useRef, useMemo, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { createNodeTypes } from './nodes/nodeTypes';
import { createEdgeTypes } from './edges/edgeTypes';
import { useFlowState } from './hooks/useFlowState';
import { useFlowHandlers } from './hooks/useFlowHandlers';
import NodePanel from './NodePanel';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import BottomToolbar from './toolbars/BottomToolbar';
import TopToolbar from './toolbars/TopToolbar';
import NodeSidebar from './NodeSidebar';
import ReactFlowCanvas from './canvas/ReactFlowCanvas';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StrategyFlowContent: React.FC = () => {
  // Get all flow state from a custom hook
  const flowState = useFlowState();
  const isMobile = useIsMobile();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
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
            flowRef={flowState.reactFlowWrapper}
            resetStrategy={resetStrategy}
            onImportSuccess={handleImportSuccess}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
            onAddNode={handleAddNode}
            updateNodeData={updateNodeData}
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

          {/* Node sidebar drawer for mobile */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 w-10 rounded-full shadow-md"
              onClick={toggleSidebar}
            >
              {sidebarVisible ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className={`absolute left-0 top-0 h-full bg-background border-r border-border transition-all duration-300 z-10 ${sidebarVisible ? 'w-[70px] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
            <NodeSidebar onAddNode={handleAddNode} />
          </div>
        </ReactFlowProvider>
      </div>
    );
  }
  
  // On desktop, use a collapsible layout
  return (
    <div className="h-full w-full relative">
      <ReactFlowProvider>
        <div className="flex flex-col h-full">
          <TopToolbar 
            onReset={resetStrategy} 
            onImportSuccess={handleImportSuccess} 
          />
          
          <div className="flex-grow relative flex">
            {/* Collapsible node sidebar */}
            <div className={`bg-background border-r border-border transition-all duration-300 ${sidebarVisible ? 'w-[70px]' : 'w-0 overflow-hidden'}`}>
              <NodeSidebar onAddNode={handleAddNode} />
            </div>
            
            {/* Main canvas area */}
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
                flowRef={flowState.reactFlowWrapper}
                resetStrategy={resetStrategy}
                onImportSuccess={handleImportSuccess}
                onDeleteNode={handleDeleteNode}
                onDeleteEdge={handleDeleteEdge}
                onAddNode={handleAddNode}
                updateNodeData={updateNodeData}
              />

              {/* Sidebar toggle button */}
              <div className="absolute left-4 top-4 z-10">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 rounded-full shadow-md"
                  onClick={toggleSidebar}
                >
                  {sidebarVisible ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {/* Node configuration panel */}
            <div className={`bg-background border-l border-border transition-all duration-300 ${flowState.isPanelOpen ? 'w-[420px]' : 'w-0 overflow-hidden'}`}>
              {flowState.isPanelOpen && flowState.selectedNode && (
                <NodePanel 
                  node={flowState.selectedNode} 
                  updateNodeData={updateNodeData} 
                  onClose={closePanel}
                />
              )}
            </div>
          </div>
          
          <BottomToolbar />
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default StrategyFlowContent;
