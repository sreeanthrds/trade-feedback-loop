
import React from 'react';
import { useReactFlow, useStore, EdgeLabelRenderer } from '@xyflow/react';
import { Trash2 } from 'lucide-react';

interface EdgeControlsProps {
  edgeId: string;
  onDeleteEdge: (edgeId: string) => void;
}

const EdgeControls: React.FC<EdgeControlsProps> = ({ edgeId, onDeleteEdge }) => {
  // Get edge center position
  const edgeCenter = useStore((store) => {
    const edge = store.edges.find(e => e.id === edgeId);
    if (!edge) return null;
    
    // Calculate center point between source and target nodes
    const sourceNode = store.nodeLookup.get(edge.source);
    const targetNode = store.nodeLookup.get(edge.target);
    
    if (!sourceNode || !targetNode) return null;
    
    // Account for node width and height
    const sourceWidth = sourceNode.width || 150;
    const sourceHeight = sourceNode.height || 50;
    const targetWidth = targetNode.width || 150;
    const targetHeight = targetNode.height || 50;
    
    // Use center points of nodes
    const sourceX = sourceNode.position.x + sourceWidth / 2;
    const sourceY = sourceNode.position.y + sourceHeight / 2;
    const targetX = targetNode.position.x + targetWidth / 2;
    const targetY = targetNode.position.y + targetHeight / 2;
    
    // Calculate middle point between source and target
    return {
      x: (sourceX + targetX) / 2,
      y: (sourceY + targetY) / 2
    };
  });
  
  if (!edgeCenter) return null;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteEdge(edgeId);
  };

  return (
    <EdgeLabelRenderer>
      <div
        className="absolute pointer-events-auto"
        style={{
          transform: `translate(-50%, -50%) translate(${edgeCenter.x}px, ${edgeCenter.y}px)`,
          zIndex: 10
        }}
      >
        <button
          className="flex items-center justify-center h-8 w-8 rounded-full bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 transition-colors"
          onClick={handleDelete}
          title="Delete Connection"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </EdgeLabelRenderer>
  );
};

export default EdgeControls;
