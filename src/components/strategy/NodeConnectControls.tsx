import React, { useState, useCallback, memo } from 'react';
import { Play, Activity, SlidersHorizontal, StopCircle, AlertTriangle, Plus, ArrowUpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface NodeConnectControlsProps {
  showOn: 'start' | 'signal' | 'action' | 'entry' | 'exit' | 'alert';
  onAddNode: (type: string, parentNodeId: string) => void;
  parentNodeId: string;
}

// Define node types with icons and labels
const nodeTypeIcons = {
  startNode: { icon: Play, label: 'Start Node', color: 'text-emerald-500', group: null },
  signalNode: { icon: Activity, label: 'Signal Node', color: 'text-blue-600', group: null },
  entryNode: { icon: ArrowUpCircle, label: 'Entry Node', color: 'text-emerald-600', group: 'action' },
  exitNode: { icon: X, label: 'Exit Node', color: 'text-amber-600', group: 'action' },
  alertNode: { icon: AlertTriangle, label: 'Alert Node', color: 'text-amber-600', group: 'action' },
  endNode: { icon: StopCircle, label: 'End Node', color: 'text-rose-600', group: null },
  forceEndNode: { icon: AlertTriangle, label: 'Force End Node', color: 'text-purple-500', group: null }
};

const NodeConnectControls = memo(({ showOn, onAddNode, parentNodeId }: NodeConnectControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Different node type options based on the current node type
  const nodeOptions = React.useMemo(() => {
    const options = [
      { value: 'signalNode', label: 'Signal Node', group: null },
      { value: 'entryNode', label: 'Entry Node', group: 'action' },
      { value: 'exitNode', label: 'Exit Node', group: 'action' },
      { value: 'alertNode', label: 'Alert Node', group: 'action' },
      { value: 'endNode', label: 'End Node', group: null },
      { value: 'forceEndNode', label: 'Force End Node', group: null }
    ];
    
    if (showOn === 'start') {
      // Start nodes can connect to any other node
      return options;
    } else {
      // Other nodes can connect to any node except start nodes
      return options.filter(option => option.value !== 'startNode');
    }
  }, [showOn]);

  // Group options for display
  const groupedOptions = React.useMemo(() => {
    const defaultOptions = nodeOptions.filter(option => option.group === null);
    const actionOptions = nodeOptions.filter(option => option.group === 'action');
    
    return { defaultOptions, actionOptions };
  }, [nodeOptions]);

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
          className="min-w-[10rem] w-auto"
        >
          {/* Default node options */}
          <TooltipProvider delayDuration={200}>
            <DropdownMenuGroup>
              {groupedOptions.defaultOptions.map((option) => {
                const NodeIcon = nodeTypeIcons[option.value as keyof typeof nodeTypeIcons].icon;
                const iconColor = nodeTypeIcons[option.value as keyof typeof nodeTypeIcons].color;
                
                return (
                  <Tooltip key={option.value}>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem 
                        onClick={(e) => handleAddNode(option.value, e)}
                        className="cursor-pointer py-2 px-3"
                      >
                        <NodeIcon className={`h-4 w-4 ${iconColor} mr-2`} />
                        <span className="text-xs">{option.label}</span>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {option.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </DropdownMenuGroup>
            
            {/* Action node options grouped */}
            {groupedOptions.actionOptions.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground py-1">Action Nodes</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {groupedOptions.actionOptions.map((option) => {
                    const NodeIcon = nodeTypeIcons[option.value as keyof typeof nodeTypeIcons].icon;
                    const iconColor = nodeTypeIcons[option.value as keyof typeof nodeTypeIcons].color;
                    
                    return (
                      <Tooltip key={option.value}>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem 
                            onClick={(e) => handleAddNode(option.value, e)}
                            className="cursor-pointer py-2 px-3"
                          >
                            <NodeIcon className={`h-4 w-4 ${iconColor} mr-2`} />
                            <span className="text-xs">{option.label}</span>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {option.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </DropdownMenuGroup>
              </>
            )}
          </TooltipProvider>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

NodeConnectControls.displayName = 'NodeConnectControls';

export default NodeConnectControls;
