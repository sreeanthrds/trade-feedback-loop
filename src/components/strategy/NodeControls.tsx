
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface NodeControlsProps {
  node: any; // Using any to avoid TypeScript errors with position property
  onDelete: (nodeId: string) => void;
}

const NodeControls: React.FC<NodeControlsProps> = ({ node, onDelete }) => {
  // Don't allow deletion of the start node
  if (node.type === 'startNode') {
    return null;
  }

  return (
    <div className="absolute right-0 top-0 -mt-6 -mr-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="destructive"
        size="icon"
        className="h-6 w-6 rounded-full shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node.id);
        }}
        title="Delete node"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default NodeControls;
