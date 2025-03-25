
import React, { useState, useCallback, memo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface NodeConnectControlsProps {
  showOn: 'start' | 'signal' | 'action';
  onAddNode: (type: string) => void;
}

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

  return (
    <div className="absolute right-0 top-1/2 -mr-4 -mt-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
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
        >
          {nodeOptions.map((option) => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleAddNode(option.value)}
              className="cursor-pointer text-xs py-1.5"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default memo(NodeConnectControls);
