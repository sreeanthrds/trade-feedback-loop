
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

  // Render mobile layout with drawer
  if (isMobile) {
    return (
      <div className="strategy-flow-container h-full">
        <div className="flow-main-content h-full">
          {children}
        </div>
        
        {selectedNode && (
          <Drawer open={open} onOpenChange={setOpen} onClose={onClosePanel}>
            <DrawerContent className="h-[70vh] max-h-[70vh]">
              <DrawerHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <DrawerTitle className="text-lg">
                  {selectedNode.type === 'startNode' ? 'Start Node' : 
                   selectedNode.type === 'signalNode' ? 'Signal Node' :
                   selectedNode.type === 'actionNode' ? 'Action Node' :
                   selectedNode.type === 'endNode' ? 'End Node' :
                   selectedNode.type === 'forceEndNode' ? 'Force End Node' : 
                   'Node Settings'}
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
