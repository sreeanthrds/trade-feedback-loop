
import React, { useState, useCallback, memo } from 'react';
import { Play, Activity, SlidersHorizontal, StopCircle, AlertTriangle, Plus } from 'lucide-react';
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
  onAddNode: (type: string) => void;
}

// Define node types with icons and labels
const nodeTypeIcons = {
  startNode: { icon: Play, label: 'Start Node', color: 'text-emerald-500' },
  signalNode: { icon: Activity, label: 'Signal Node', color: 'text-blue-600' },
  actionNode: { icon: SlidersHorizontal, label: 'Action Node', color: 'text-amber-600' },
  endNode: { icon: StopCircle, label: 'End Node', color: 'text-rose-600' },
  forceEndNode: { icon: AlertTriangle, label: 'Force End Node', color: 'text-purple-500' }
};

const NodeConnectControls = ({ showOn, onAddNode }: NodeConnectControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Different node type options based on the current node type
  const nodeOptions = React.useMemo(() => {
    if (showOn === 'start') {
      return [
        { value: 'signalNode', label: 'Signal Node' },
        { value: 'actionNode', label: 'Action Node' },
        { value: 'endNode', label: 'End Node' },
        { value: 'forceEndNode', label: 'Force End Node' }
      ];
    } else {
      return [
        { value: 'signalNode', label: 'Signal Node' },
        { value: 'actionNode', label: 'Action Node' },
        { value: 'endNode', label: 'End Node' },
        { value: 'forceEndNode', label: 'Force End Node' }
      ];
    }
  }, [showOn]);

  const handleAddNode = useCallback((type: string) => {
    onAddNode(type);
    setIsOpen(false);
  }, [onAddNode]);

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
          >
            <Plus className="h-4 w-4 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          sideOffset={8}
          onMouseLeave={handleMouseLeave}
        >
          <TooltipProvider delayDuration={200}>
            {nodeOptions.map((option) => {
              const NodeIcon = nodeTypeIcons[option.value as keyof typeof nodeTypeIcons].icon;
              const iconColor = nodeTypeIcons[option.value as keyof typeof nodeTypeIcons].color;
              
              return (
                <Tooltip key={option.value}>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem 
                      onClick={() => handleAddNode(option.value)}
                      className="cursor-pointer py-2 flex justify-center"
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
};

export default memo(NodeConnectControls);
