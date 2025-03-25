
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { 
  ResizablePanelGroup, 
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import './FlowLayout.css';

interface FlowLayoutProps {
  children: React.ReactNode;
  isPanelOpen: boolean;
  selectedNode: Node | null;
  onClosePanel: () => void;
  nodePanelComponent?: React.ReactNode;
}

const FlowLayout: React.FC<FlowLayoutProps> = ({
  children,
  isPanelOpen,
  selectedNode,
  onClosePanel,
  nodePanelComponent
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState(70);

  // Sync drawer open state with panel open state
  useEffect(() => {
    if (isMobile) {
      setOpen(isPanelOpen);
    }
  }, [isPanelOpen, isMobile]);

  // Handle drawer close
  const handleDrawerClose = () => {
    setOpen(false);
    onClosePanel();
  };

  // Get node title text based on node type
  const getNodeTitle = (type: string | undefined) => {
    switch (type) {
      case 'startNode': return 'Start Node';
      case 'signalNode': return 'Signal Node';
      case 'actionNode': return 'Action Node';
      case 'endNode': return 'End Node';
      case 'forceEndNode': return 'Force End Node';
      default: return 'Node Settings';
    }
  };

  // Render mobile layout with drawer
  if (isMobile) {
    return (
      <div className="strategy-flow-container h-full">
        <div className="flow-main-content h-full">
          {children}
        </div>
        
        {selectedNode && (
          <Drawer 
            open={open} 
            onOpenChange={setOpen} 
            onClose={onClosePanel} 
            shouldScaleBackground={false}
          >
            <DrawerContent 
              className={`h-[${drawerHeight}vh] max-h-[95vh] drawer-no-dismiss`}
              // Make sure drawer doesn't close when dragging
              onPointerDown={(e) => {
                if (e.target instanceof HTMLElement && 
                    e.target.closest('.drawer-drag-handle')) {
                  // Allow dragging only for the dedicated handle
                  e.stopPropagation();
                }
              }}
            >
              <div className="drawer-drag-handle mt-1 mb-3" />
              <DrawerHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <DrawerTitle className="text-lg">
                  {getNodeTitle(selectedNode.type)}
                </DrawerTitle>
                <Button variant="ghost" size="sm" onClick={handleDrawerClose} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerHeader>
              <div className="p-4 overflow-y-auto">
                {nodePanelComponent}
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    );
  }

  // Render desktop layout with resizable panels
  return (
    <div className="strategy-flow-container h-full">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {isPanelOpen && selectedNode ? (
          <>
            <ResizablePanel defaultSize={70} minSize={60}>
              {children}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="border-l border-border">
              {nodePanelComponent}
            </ResizablePanel>
          </>
        ) : (
          <ResizablePanel defaultSize={100} className="flow-main-content">
            {children}
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default FlowLayout;
