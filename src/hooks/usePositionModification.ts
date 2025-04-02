
import { useState } from 'react';
import { Position } from '@/hooks/useModifyPositions';
import { Node } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';

export function usePositionModification(
  node: Node,
  updateNodeData: (id: string, data: any) => void
) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);

  const openModificationDialog = (position: Position) => {
    setCurrentPosition(position);
    setIsDialogOpen(true);
  };

  const closeModificationDialog = () => {
    setIsDialogOpen(false);
    setCurrentPosition(null);
  };

  const handlePositionChange = (updates: Partial<Position>) => {
    if (!currentPosition) return;
    
    // Create updated position object
    const updatedPosition = {
      ...currentPosition,
      ...updates,
      _lastUpdated: Date.now()
    };
    
    setCurrentPosition(updatedPosition);
  };

  const saveModifiedPosition = () => {
    if (!currentPosition || !node.data.targetNodeId) return;
    
    // Prepare modifications object to be saved in the modify node
    const modifications = {
      ...node.data.modifications || {},
      [currentPosition.id]: {
        ...currentPosition
      }
    };

    // Update the node with modifications data
    updateNodeData(node.id, {
      modifications,
      _lastUpdated: Date.now()
    });

    toast({
      title: "Position Modified",
      description: `Modified position ${currentPosition.vpi}`
    });
    
    closeModificationDialog();
  };

  return {
    isDialogOpen,
    currentPosition,
    openModificationDialog,
    closeModificationDialog,
    handlePositionChange,
    saveModifiedPosition
  };
}
