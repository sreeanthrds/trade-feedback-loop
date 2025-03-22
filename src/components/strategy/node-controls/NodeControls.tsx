
import React, { useState } from 'react';
import { useReactFlow, Node, useStore, Position } from '@xyflow/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { 
  Plus, 
  Trash2, 
  Activity, 
  SlidersHorizontal, 
  StopCircle, 
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

interface NodeControlsProps {
  nodeId: string;
  nodes: Node[];
  addNodeOnConnection: (sourceNodeId: string, nodeType: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

const NodeControls: React.FC<NodeControlsProps> = ({ 
  nodeId, 
  nodes, 
  addNodeOnConnection, 
  onDeleteNode 
}) => {
  const [showNodeOptions, setShowNodeOptions] = useState(false);
  const targetNode = nodes.find(node => node.id === nodeId);
  
  // Find the node's position in the viewport
  const nodePosition = useStore((store) => {
    const node = store.nodeLookup.get(nodeId);
    if (!node) return null;
    
    const width = node.width || 150;
    
    // Return the right edge position of the node
    return {
      x: node.position.x + width + 5, // 5px to the right of node edge
      y: node.position.y + 10 // align with node top section
    };
  });

  if (!targetNode || !nodePosition) return null;

  const isStartNode = targetNode.type === 'startNode';
  const isEndOrForceEndNode = targetNode.type === 'endNode' || targetNode.type === 'forceEndNode';
  const isLastNode = nodes.length === 1;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isStartNode && isLastNode) {
      toast.error("Cannot delete the only start node");
      return;
    }
    
    onDeleteNode(nodeId);
  };

  const handleAddNode = (nodeType: string) => {
    addNodeOnConnection(nodeId, nodeType);
    setShowNodeOptions(false);
  };
  
  return (
    <div 
      className="absolute pointer-events-auto"
      style={{
        left: nodePosition.x,
        top: nodePosition.y,
        zIndex: 10
      }}
    >
      <div className="flex flex-col space-y-2">
        {!isEndOrForceEndNode && (
          <HoverCard open={showNodeOptions} onOpenChange={setShowNodeOptions}>
            <HoverCardTrigger asChild>
              <button
                className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNodeOptions(true);
                }}
              >
                <Plus size={16} />
              </button>
            </HoverCardTrigger>
            <HoverCardContent align="center" className="p-2 w-auto">
              <div className="flex space-x-2">
                <button
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-secondary text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode('signalNode');
                  }}
                  title="Add Signal Node"
                >
                  <Activity size={18} />
                  <span className="text-xs mt-1">Signal</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-secondary text-warning"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode('actionNode');
                  }}
                  title="Add Action Node"
                >
                  <SlidersHorizontal size={18} />
                  <span className="text-xs mt-1">Action</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-secondary text-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode('endNode');
                  }}
                  title="Add End Node"
                >
                  <StopCircle size={18} />
                  <span className="text-xs mt-1">End</span>
                </button>
                <button
                  className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-secondary text-[#9C27B0]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddNode('forceEndNode');
                  }}
                  title="Add Force End Node"
                >
                  <AlertTriangle size={18} />
                  <span className="text-xs mt-1">Force End</span>
                </button>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
        
        <button
          className="flex items-center justify-center h-8 w-8 rounded-full bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 transition-colors"
          onClick={handleDelete}
          title="Delete Node"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default NodeControls;
