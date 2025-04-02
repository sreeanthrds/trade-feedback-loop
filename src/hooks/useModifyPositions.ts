
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { toast } from '@/hooks/use-toast';

// Position interface copied from ModifyNodeEditor
export interface Position {
  id: string;
  vpi: string;
  vpt: string;
  positionType: 'buy' | 'sell';
  lots?: number;
  orderType: 'market' | 'limit';
  productType: string;
  priority: number;
  limitPrice?: number;
  optionDetails?: {
    expiry: string;
    strikeType: string;
    strikeValue?: number;
    optionType: string;
  };
  sourceNodeId?: string;
}

/**
 * Custom hook to manage the positions available for modification
 */
export function useModifyPositions(node: Node) {
  const nodes = useStrategyStore(state => state.nodes);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(
    node.data.targetPositionId as string | null
  );
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Collect all positions from entry nodes
  useEffect(() => {
    const allPositions: Position[] = [];
    
    nodes.forEach(n => {
      if (n.type === 'entryNode' && Array.isArray(n.data.positions)) {
        n.data.positions.forEach((position: Position) => {
          // Add source node information to each position
          allPositions.push({
            ...position,
            sourceNodeId: n.id
          });
        });
      }
    });
    
    setPositions(allPositions);
    
    // If we have a previously selected position, find and select it again
    if (node.data.targetPositionId) {
      const position = allPositions.find(p => p.id === node.data.targetPositionId);
      if (position) {
        setSelectedPosition(position);
      } else {
        // If the selected position no longer exists, reset the selection
        setSelectedPosition(null);
      }
    }
  }, [nodes, node.data.targetPositionId]);

  return {
    positions,
    selectedPosition,
    selectedPositionId,
    setSelectedPositionId,
    setSelectedPosition
  };
}

/**
 * Custom hook to handle position selection logic
 */
export function usePositionSelection(
  node: Node, 
  updateNodeData: (id: string, data: any) => void,
  positions: Position[],
  setSelectedPositionId: (id: string | null) => void,
  setSelectedPosition: (position: Position | null) => void
) {
  const handlePositionSelect = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    
    if (position) {
      setSelectedPositionId(positionId);
      setSelectedPosition(position);
      
      // Update the node data with the selected position and source node
      updateNodeData(node.id, {
        targetPositionId: positionId,
        targetNodeId: position.sourceNodeId,
      });
      
      toast({
        title: "Position selected",
        description: `Selected position ${position.vpi} for modification`
      });
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  return {
    handlePositionSelect,
    handleLabelChange
  };
}
