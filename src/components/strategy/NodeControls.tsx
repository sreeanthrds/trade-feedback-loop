
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
    if (typeof onDelete === 'function') {
      onDelete(node.id);
      setOpen(false);
    } else {
      console.error('onDelete is not a function', onDelete);
    }
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
    <div className="absolute right-0 top-0 -mt-5 -mr-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="h-5 w-5 rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation();
            }}
            title="Delete node"
          >
            <Trash2 className="h-2.5 w-2.5" />
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
