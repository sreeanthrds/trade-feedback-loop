
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface NodeControlsProps {
  node: any; // Using any to avoid TypeScript errors with position property
  onDelete: (nodeId: string) => void;
}

const NodeControls: React.FC<NodeControlsProps> = ({ node, onDelete }) => {
  const [open, setOpen] = useState(false);
  
  // Don't allow deletion of the start node
  if (node.type === 'startNode') {
    return null;
  }

  const handleDelete = () => {
    onDelete(node.id);
    setOpen(false);
  };

  const getNodeTypeName = () => {
    switch (node.type) {
      case 'signalNode': return 'Signal';
      case 'actionNode': return 'Action';
      case 'endNode': return 'End';
      case 'forceEndNode': return 'Force End';
      default: return 'Node';
    }
  };

  return (
    <div className="absolute right-0 top-0 -mt-6 -mr-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="h-6 w-6 rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
            }}
            title="Delete node"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {getNodeTypeName()} Node</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {getNodeTypeName().toLowerCase()} node? 
              This action cannot be undone and will remove any connections to and from this node.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NodeControls;
