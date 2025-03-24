
import React, { useState } from 'react';
import { EdgeProps } from '@xyflow/react';
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
  animated,
  ...props 
}: EdgeProps & { id: string; onDelete: (id: string) => void }) => {
  const { onDelete } = props;
  const [open, setOpen] = useState(false);
  
  const handleDelete = () => {
    onDelete(id);
    setOpen(false);
  };
  
  return (
    <>
      {/* Draw a simple bezier edge */}
      <path
        id={id}
        className={`react-flow__edge-path ${animated ? 'animated' : ''}`}
        d={`M ${sourceX},${sourceY} C ${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`}
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
                <Trash2 className="h-3 w-3" />
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
                  variant="destructive"
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
