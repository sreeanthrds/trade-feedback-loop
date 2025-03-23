
import React from 'react';
import { EdgeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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
          <Button
            variant="destructive"
            size="icon"
            className="h-5 w-5 rounded-full"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(id);
            }}
            title="Delete connection"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </foreignObject>
    </>
  );
};

export default ButtonEdge;
