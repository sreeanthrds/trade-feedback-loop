
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
      id: currentPosition.id,
      vpi: currentPosition.vpi,
      vpt: currentPosition.vpt,
      priority: currentPosition.priority,
      positionType: currentPosition.positionType,
      orderType: currentPosition.orderType,
      limitPrice: currentPosition.limitPrice,
      lots: currentPosition.lots,
      productType: currentPosition.productType,
      sourceNodeId: currentPosition.sourceNodeId,
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
      // Create a new optionDetails object without using spread operator
      updatedPosition.optionDetails = {
        expiry: currentPosition.optionDetails.expiry,
        strikeType: currentPosition.optionDetails.strikeType,
        strikeValue: currentPosition.optionDetails.strikeValue,
        optionType: currentPosition.optionDetails.optionType
      };
      
      // Copy each property individually from updates
      if (updates.optionDetails) {
        Object.keys(updates.optionDetails).forEach(key => {
          if (updatedPosition.optionDetails) {
            (updatedPosition.optionDetails as any)[key] = (updates.optionDetails as any)[key];
          }
        });
      }
    }
    
    setCurrentPosition(updatedPosition);
  };

  const saveModifiedPosition = () => {
    if (!currentPosition || !node.data.targetNodeId) return;
    
    // Prepare modifications object to be saved in the modify node
    const modifications: Record<string, any> = {};
    
    // Create a new object for the modifications map
    if (node.data.modifications) {
      Object.keys(node.data.modifications).forEach(key => {
        modifications[key] = node.data.modifications[key];
      });
    }
    
    // Add or update the current position modification
    modifications[currentPosition.id] = {
      id: currentPosition.id,
      vpi: currentPosition.vpi,
      vpt: currentPosition.vpt,
      priority: currentPosition.priority,
      positionType: currentPosition.positionType,
      orderType: currentPosition.orderType,
      limitPrice: currentPosition.limitPrice,
      lots: currentPosition.lots,
      productType: currentPosition.productType,
      optionDetails: currentPosition.optionDetails,
      sourceNodeId: currentPosition.sourceNodeId,
      _lastUpdated: currentPosition._lastUpdated
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
