
import React from 'react';
import { useReactFlow, useStore, EdgeLabelRenderer } from '@xyflow/react';
import { Trash2 } from 'lucide-react';

interface EdgeControlsProps {
  edgeId: string;
  onDeleteEdge: (edgeId: string) => void;
}

const EdgeControls: React.FC<EdgeControlsProps> = ({ edgeId, onDeleteEdge }) => {
  const { screenToFlowPosition } = useReactFlow();
  
  // Get edge center position
  const edgeCenter = useStore((store) => {
    const edge = store.edges.find(e => e.id === edgeId);
    if (!edge) return null;
    
    // Calculate center point between source and target nodes
    const sourceNode = store.nodeLookup.get(edge.source);
    const targetNode = store.nodeLookup.get(edge.target);
    
    if (!sourceNode || !targetNode) return null;
    
    const sourcePos = sourceNode.position;
    const targetPos = targetNode.position;
    
    // Calculate middle point between source and target
    const centerX = (sourcePos.x + targetPos.x) / 2;
    const centerY = (sourcePos.y + targetPos.y) / 2;
    
    // Project to viewport coordinates
    const point = screenToFlowPosition({
      x: centerX,
      y: centerY
    });
    
    return point;
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
