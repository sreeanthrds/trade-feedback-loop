
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
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

const NodeConnectControls: React.FC<NodeConnectControlsProps> = ({ showOn, onAddNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Different node type options based on the current node type
  const getNodeOptions = () => {
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
  };

  const handleAddNode = (type: string) => {
    onAddNode(type);
    setIsOpen(false);
  };

  return (
    <div className="absolute right-0 top-1/2 -mr-5 -mt-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full shadow-md bg-background border-primary"
            title="Add connected node"
          >
            <Plus className="h-5 w-5 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-popover shadow-lg z-[9999]"
          sideOffset={10}
          forceMount
        >
          {getNodeOptions().map((option) => (
            <DropdownMenuItem 
              key={option.value}
              onClick={() => handleAddNode(option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NodeConnectControls;
