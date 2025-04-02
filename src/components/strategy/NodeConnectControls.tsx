
import React, { useState, useCallback, memo } from 'react';
import { Play, Activity, SlidersHorizontal, StopCircle, AlertTriangle, Plus, ShoppingCart, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface NodeConnectControlsProps {
  showOn: 'start' | 'signal' | 'action';
  onAddNode: (type: string, parentNodeId: string) => void;
  parentNodeId: string;
}

// Define node types with icons and labels
const nodeTypeIcons = {
  startNode: { icon: Play, label: 'Start Node', color: 'text-emerald-500' },
  signalNode: { icon: Activity, label: 'Signal Node', color: 'text-blue-600' },
  actionNode: { icon: SlidersHorizontal, label: 'Action Node', color: 'text-amber-600' },
  entryNode: { icon: ShoppingCart, label: 'Entry Node', color: 'text-green-500' },
  exitNode: { icon: LogOut, label: 'Exit Node', color: 'text-amber-500' },
  alertNode: { icon: Bell, label: 'Alert Node', color: 'text-purple-500' },
  endNode: { icon: StopCircle, label: 'End Node', color: 'text-rose-600' },
  forceEndNode: { icon: AlertTriangle, label: 'Force End Node', color: 'text-purple-500' }
};

const NodeConnectControls = memo(({ showOn, onAddNode, parentNodeId }: NodeConnectControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Different node type options based on the current node type
  const nodeOptions = React.useMemo(() => {
    if (showOn === 'start') {
      return [
        { value: 'signalNode', label: 'Signal Node' },
        { value: 'entryNode', label: 'Entry Node' },
        { value: 'exitNode', label: 'Exit Node' },
        // Temporarily hiding the Modify Node option
        // { value: 'modifyNode', label: 'Modify Node' },
        { value: 'alertNode', label: 'Alert Node' },
        { value: 'endNode', label: 'End Node' },
        { value: 'forceEndNode', label: 'Force End Node' }
      ];
    } else {
      return [
        { value: 'signalNode', label: 'Signal Node' },
        { value: 'entryNode', label: 'Entry Node' },
        { value: 'exitNode', label: 'Exit Node' },
        // Temporarily hiding the Modify Node option
        // { value: 'modifyNode', label: 'Modify Node' },
        { value: 'alertNode', label: 'Alert Node' },
        { value: 'endNode', label: 'End Node' },
        { value: 'forceEndNode', label: 'Force End Node' }
      ];
    }
  }, [showOn]);

  const handleAddNode = useCallback((type: string, e: React.MouseEvent) => {
    // Prevent event bubbling up to parent elements
    e.preventDefault();
    e.stopPropagation();
    
    // Call the onAddNode function with parent node ID
    onAddNode(type, parentNodeId);
    
    // Close the dropdown
    setIsOpen(false);
  }, [onAddNode, parentNodeId]);

  // Auto-close the dropdown when the mouse leaves
  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="absolute right-0 top-1/2 -mr-4 -mt-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild onMouseEnter={() => setIsOpen(true)}>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full shadow-md bg-background border-primary"
            title="Add connected node"
            type="button"
            onClick={(e) => e.stopPropagation()}
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          sideOffset={8}
          onMouseLeave={handleMouseLeave}
          className="p-1 min-w-[3rem] w-auto"
        >
          <TooltipProvider delayDuration={200}>
            {nodeOptions.map((option) => {
              const NodeIcon = nodeTypeIcons[option.value as keyof typeof nodeTypeIcons].icon;
              const iconColor = nodeTypeIcons[option.value as keyof typeof nodeTypeIcons].color;
              
              return (
                <Tooltip key={option.value}>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem 
                      onClick={(e) => handleAddNode(option.value, e)}
                      className="cursor-pointer py-2 px-2 flex justify-center"
                    >
                      <NodeIcon className={`h-5 w-5 ${iconColor}`} />
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {option.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

NodeConnectControls.displayName = 'NodeConnectControls';

export default NodeConnectControls;
