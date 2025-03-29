import { useState, useEffect, useCallback } from 'react';
import { Position, NodeData } from '../types';
import { toast } from "@/hooks/use-toast";

interface UsePositionManagementProps {
  nodeData: NodeData;
  nodeId: string;
  updateNodeData: (id: string, data: any) => void;
}

export const usePositionManagement = ({
  nodeData,
  nodeId,
  updateNodeData
}: UsePositionManagementProps) => {
  // Generate a unique ID for positions
  const generateUniqueId = () => {
    const timestamp = Date.now().toString().slice(-6); // Use last 6 digits of timestamp
    return `pos-${timestamp}`;
  };

  // Generate a simplified VPI with node ID prefix + position number
  const generateVPI = () => {
    const nodePrefix = nodeId; // Already has the format we need
    const positionCount = (nodeData?.positions?.length || 0) + 1;
    return `${nodePrefix}-pos${positionCount}`;
  };

  // Create a default position
  const createDefaultPosition = (): Position => {
    // Get next available priority
    const nextPriority = (nodeData?.positions?.length || 0) + 1;
    
    return {
      id: generateUniqueId(),
      vpi: generateVPI(), 
      vpt: '',
      priority: nextPriority,
      positionType: 'buy',
      orderType: 'market',
      lots: 1,
      productType: 'intraday',
      optionDetails: {
        expiry: 'W0',
        strikeType: 'ATM',
        optionType: 'CE'
      }
    };
  };
  
  // State for selected position
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    nodeData?.positions?.length > 0 ? nodeData.positions[0] : null
  );

  // Update selected position when positions change
  useEffect(() => {
    if (nodeData?.positions?.length > 0) {
      const currentSelected = selectedPosition ? 
        nodeData.positions.find(p => p.id === selectedPosition.id) : null;
        
      // If current selected position still exists, update it with latest data
      if (currentSelected) {
        setSelectedPosition(currentSelected);
      } else {
        // Otherwise select the first position
        setSelectedPosition(nodeData.positions[0]);
      }
    } else {
      setSelectedPosition(null);
    }
  }, [nodeData.positions, selectedPosition]);

  // Handler for position changes
  const handlePositionChange = useCallback((positionId: string, updates: Partial<Position>) => {
    if (!nodeData.positions) return;
    
    // Create a deep copy of the positions array to ensure React detects the changes
    const updatedPositions = nodeData.positions.map(pos => 
      pos.id === positionId ? { ...pos, ...updates } : pos
    );
    
    updateNodeData(nodeId, { 
      positions: updatedPositions,
      _lastUpdated: Date.now() // Force React to detect changes
    });
    
    console.log('Updated positions:', updatedPositions);
  }, [nodeId, nodeData.positions, updateNodeData]);

  // Handler for adding a new position
  const handleAddPosition = useCallback(() => {
    const newPosition = createDefaultPosition();
    
    // Create a fresh array with all existing positions plus the new one
    const updatedPositions = [...(nodeData.positions || []), newPosition];
    
    updateNodeData(nodeId, { 
      positions: updatedPositions,
      _lastUpdated: Date.now() // Force update
    });
    
    // Log for debugging
    console.log('Added new position:', newPosition);
    console.log('Updated positions:', updatedPositions);
    
    return newPosition;
  }, [nodeId, nodeData.positions, updateNodeData]);

  // Handler for deleting a position
  const handleDeletePosition = useCallback((positionId: string) => {
    if (!nodeData.positions) return;
    
    const updatedPositions = nodeData.positions.filter(pos => pos.id !== positionId);
    
    // If we're deleting the last position and this is an entry/exit node, create a default one
    if (updatedPositions.length === 0 && nodeData.actionType !== 'alert') {
      const newPosition = createDefaultPosition();
      updateNodeData(nodeId, { 
        positions: [newPosition],
        _lastUpdated: Date.now()
      });
      toast({
        title: "Position deleted",
        description: "Added a default position since at least one is required."
      });
    } else {
      // Reindex the priorities if needed
      const reindexedPositions = updatedPositions.map((pos, index) => ({
        ...pos,
        priority: index + 1
      }));
      
      updateNodeData(nodeId, { 
        positions: reindexedPositions,
        _lastUpdated: Date.now()
      });
      toast({
        title: "Position deleted",
        description: "Position has been removed from this action node."
      });
    }
  }, [nodeId, nodeData.positions, nodeData.actionType, updateNodeData]);

  return {
    selectedPosition,
    setSelectedPosition,
    handlePositionChange,
    handleAddPosition,
    handleDeletePosition,
    createDefaultPosition
  };
};
