
import { useState } from 'react';
import { Position } from '@/components/strategy/types/position-types';
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
    
    // First, create a basic updated position with the current values
    const updatedPosition: Position = {
      ...currentPosition,
      _lastUpdated: Date.now()
    };

    // Then apply each property from updates individually to avoid spread operator issues
    if (updates) {
      Object.keys(updates).forEach(key => {
        // Skip optionDetails as we handle it separately
        if (key !== 'optionDetails') {
          (updatedPosition as any)[key] = (updates as any)[key];
        }
      });
    }
    
    // Handle optionDetails separately - this avoids spreading potentially undefined values
    if (updates.optionDetails && currentPosition.optionDetails) {
      updatedPosition.optionDetails = {
        ...currentPosition.optionDetails,
        ...updates.optionDetails
      };
    }
    
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
