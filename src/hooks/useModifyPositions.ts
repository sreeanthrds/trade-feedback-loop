
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { toast } from '@/hooks/use-toast';
import { Position as ActionNodePosition } from '@/components/strategy/nodes/action-node/types';

// Position interface aligned with action-node/types.ts
export interface Position {
  id: string;
  vpi: string;
  vpt: string;
  priority: number;
  positionType: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  limitPrice?: number;
  lots?: number;
  productType: 'intraday' | 'carryForward';
  optionDetails?: {
    expiry: string;
    strikeType: string;
    strikeValue?: number;
    optionType: string;
  };
  sourceNodeId?: string;
  _lastUpdated?: number;
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
        n.data.positions.forEach((position: ActionNodePosition) => {
          // Convert ActionNodePosition to Position while adding source node information
          const convertedPosition: Position = {
            ...position,
            // Ensure required fields have values
            positionType: position.positionType || 'buy',
            orderType: position.orderType || 'market',
            productType: (position.productType as 'intraday' | 'carryForward') || 'intraday',
            sourceNodeId: n.id,
            // Ensure optionDetails match the expected structure if present
            optionDetails: position.optionDetails ? {
              expiry: position.optionDetails.expiry || '',
              strikeType: position.optionDetails.strikeType || '',
              strikeValue: position.optionDetails.strikeValue,
              optionType: position.optionDetails.optionType || ''
            } : undefined
          };
          allPositions.push(convertedPosition);
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
