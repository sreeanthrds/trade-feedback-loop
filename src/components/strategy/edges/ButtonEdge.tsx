
import React, { useState } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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

// Custom edge with delete button
const ButtonEdge = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  source, 
  target,
  style,
  selected,
  sourcePosition,
  targetPosition,
  ...props 
}: EdgeProps & { id: string; onDelete: (id: string) => void }) => {
  const { onDelete } = props;
  const [open, setOpen] = useState(false);
  
  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(id);
      setOpen(false);
    } else {
      console.error('Edge onDelete is not a function', onDelete);
    }
  };
  
  // Use getBezierPath for the edge path
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  
  return (
    <>
      {/* Draw a bezier edge without animation */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={style}
        strokeWidth={selected ? 3 : 2}
      />
      
      {/* Add a delete button with hover state */}
      <foreignObject
        width={20}
        height={20}
        x={(sourceX + targetX) / 2 - 10}
        y={(sourceY + targetY) / 2 - 10}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        className="edge-controls opacity-0 hover:opacity-100 transition-opacity duration-200"
      >
        <div className="flex items-center justify-center h-full">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-5 w-5 rounded-full"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                title="Delete connection"
              >
                <X className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Connection</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this connection between nodes? 
                  This action cannot be undone.
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
      </foreignObject>
    </>
  );
};

export default ButtonEdge;
