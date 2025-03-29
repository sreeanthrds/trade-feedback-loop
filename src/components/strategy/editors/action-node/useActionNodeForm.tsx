
import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { NodeData, Position } from './types';
import { 
  useInitializeNodeData,
  useStartNodeData,
  useOptionSettings
} from './hooks';
import { toast } from "@/hooks/use-toast";
import { useStrategyStore } from '@/hooks/use-strategy-store';

interface UseActionNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useActionNodeForm = ({ node, updateNodeData }: UseActionNodeFormProps) => {
  // Convert node.data to NodeData type with positions array
  const nodeData = node.data as unknown as NodeData;
  
  // Ensure positions exist
  if (!nodeData.positions) {
    nodeData.positions = [];
  }
  
  // Get all nodes for VPI validation
  const nodes = useStrategyStore(state => state.nodes);
  
  // Initialize node data with default values
  useInitializeNodeData({
    nodeData,
    updateNodeData,
    nodeId: node.id
  });
  
  // Handle start node data and options trading
  const { startNodeSymbol, hasOptionTrading } = useStartNodeData({
    nodeId: node.id,
    updateNodeData,
    initialInstrument: nodeData?.instrument
  });
  
  // Generate a unique ID for positions
  const generateUniqueId = () => {
    const timestamp = Date.now().toString().slice(-6); // Use last 6 digits of timestamp
    return `pos-${timestamp}`;
  };

  // Generate a readable VPI using node ID and position number
  const generateVPI = () => {
    const nodePrefix = node.id.replace(/[^a-zA-Z0-9-]/g, '');
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

  // Ensure positions array exists in data
  useEffect(() => {
    if (!nodeData.positions || nodeData.positions.length === 0) {
      updateNodeData(node.id, { 
        positions: [createDefaultPosition()]
      });
    }
  }, [node.id, nodeData.positions, updateNodeData]);

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

  // Handler for label changes
  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  }, [node.id, updateNodeData]);

  // Handler for action type changes
  const handleActionTypeChange = useCallback((value: string) => {
    updateNodeData(node.id, { 
      actionType: value,
      // Reset positions if changing to alert
      ...(value === 'alert' && { positions: [] })
    });
  }, [node.id, updateNodeData]);

  // Handler for position changes
  const handlePositionChange = useCallback((positionId: string, updates: Partial<Position>) => {
    if (!nodeData.positions) return;
    
    // Create a deep copy of the positions array to ensure React detects the changes
    const updatedPositions = nodeData.positions.map(pos => 
      pos.id === positionId ? { ...pos, ...updates } : pos
    );
    
    updateNodeData(node.id, { 
      positions: updatedPositions,
      _lastUpdated: Date.now() // Force React to detect changes
    });
    
    console.log('Updated positions:', updatedPositions);
  }, [node.id, nodeData.positions, updateNodeData]);

  // Handler for adding a new position
  const handleAddPosition = useCallback(() => {
    const newPosition = createDefaultPosition();
    
    // Create a fresh array with all existing positions plus the new one
    const updatedPositions = [...(nodeData.positions || []), newPosition];
    
    updateNodeData(node.id, { 
      positions: updatedPositions,
      _lastUpdated: Date.now() // Force update
    });
    
    // Log for debugging
    console.log('Added new position:', newPosition);
    console.log('Updated positions:', updatedPositions);
    
    return newPosition;
  }, [node.id, nodeData.positions, updateNodeData]);

  // Handler for deleting a position
  const handleDeletePosition = useCallback((positionId: string) => {
    if (!nodeData.positions) return;
    
    const updatedPositions = nodeData.positions.filter(pos => pos.id !== positionId);
    
    // If we're deleting the last position and this is an entry/exit node, create a default one
    if (updatedPositions.length === 0 && nodeData.actionType !== 'alert') {
      const newPosition = createDefaultPosition();
      updateNodeData(node.id, { 
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
      
      updateNodeData(node.id, { 
        positions: reindexedPositions,
        _lastUpdated: Date.now()
      });
      toast({
        title: "Position deleted",
        description: "Position has been removed from this action node."
      });
    }
  }, [node.id, nodeData.positions, nodeData.actionType, updateNodeData]);

  // Validate that a VPI is unique across the entire strategy
  const validateVpiUniqueness = useCallback((vpi: string, currentPositionId: string) => {
    // Empty VPI is always valid
    if (!vpi.trim()) return true;
    
    // Check all nodes in the strategy
    for (const checkNode of nodes) {
      // Skip non-action nodes
      if (checkNode.type !== 'actionNode') continue;
      
      // Check all positions in this node
      const actionNodeData = checkNode.data as any;
      if (actionNodeData.positions) {
        for (const position of actionNodeData.positions) {
          // Skip the current position
          if (position.id === currentPositionId) continue;
          
          // If we find a matching VPI, it's not unique
          if (position.vpi === vpi) {
            return false;
          }
        }
      }
    }
    
    return true;
  }, [nodes]);

  // Force update when action type changes
  useEffect(() => {
    if (nodeData?.actionType === 'alert' && nodeData?.positions?.length > 0) {
      // Reset positions when switching to alert
      updateNodeData(node.id, { positions: [] });
    } else if ((nodeData?.actionType === 'entry' || nodeData?.actionType === 'exit') && 
               (!nodeData?.positions || nodeData.positions.length === 0)) {
      // Ensure at least one position for entry/exit nodes
      updateNodeData(node.id, { positions: [createDefaultPosition()] });
    }
  }, [nodeData?.actionType, nodeData?.positions, node.id, updateNodeData]);

  // Handlers for the selected position
  const handleSelectedPositionChange = useCallback((updates: Partial<Position>) => {
    if (!selectedPosition) return;
    
    handlePositionChange(selectedPosition.id, updates);
  }, [selectedPosition, handlePositionChange]);

  // Generate position-specific handlers
  const positionHandlers = selectedPosition ? {
    handlePositionTypeChange: (value: string) => 
      handleSelectedPositionChange({ positionType: value as 'buy' | 'sell' }),
    
    handleOrderTypeChange: (value: string) => 
      handleSelectedPositionChange({ 
        orderType: value as 'market' | 'limit',
        ...(value === 'market' && { limitPrice: undefined })
      }),
    
    handleLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
      if (value === undefined || !isNaN(value)) {
        handleSelectedPositionChange({ limitPrice: value });
      }
    },
    
    handleLotsChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value > 0) {
        handleSelectedPositionChange({ lots: value });
      }
    },
    
    handleProductTypeChange: (value: string) => 
      handleSelectedPositionChange({ productType: value as 'intraday' | 'carryForward' }),
    
    handleExpiryChange: (value: string) => 
      handleSelectedPositionChange({ 
        optionDetails: {
          ...selectedPosition.optionDetails,
          expiry: value
        }
      }),
    
    handleStrikeTypeChange: (value: string) => {
      // Make sure we validate the value to match the expected type
      const validatedValue = value as Position['optionDetails']['strikeType'];
      
      const updatedDetails = {
        ...selectedPosition.optionDetails,
        strikeType: validatedValue
      };
      
      // If changing to premium type and no strike value is set, set a default
      if (value === 'premium' && !selectedPosition.optionDetails?.strikeValue) {
        updatedDetails.strikeValue = 100;
      }
      
      handleSelectedPositionChange({ optionDetails: updatedDetails });
    },
    
    handleStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        handleSelectedPositionChange({ 
          optionDetails: {
            ...selectedPosition.optionDetails,
            strikeValue: value
          }
        });
      }
    },
    
    handleOptionTypeChange: (value: string) => {
      // Make sure we validate the value to match the expected type
      const validatedValue = value as 'CE' | 'PE';
      
      handleSelectedPositionChange({ 
        optionDetails: {
          ...selectedPosition.optionDetails,
          optionType: validatedValue
        }
      });
    }
  } : {
    handlePositionTypeChange: () => {},
    handleOrderTypeChange: () => {},
    handleLimitPriceChange: () => {},
    handleLotsChange: () => {},
    handleProductTypeChange: () => {},
    handleExpiryChange: () => {},
    handleStrikeTypeChange: () => {},
    handleStrikeValueChange: () => {},
    handleOptionTypeChange: () => {}
  };

  return {
    nodeData,
    hasOptionTrading,
    startNodeSymbol,
    selectedPosition,
    setSelectedPosition,
    handleLabelChange,
    handleActionTypeChange,
    handlePositionChange,
    handleAddPosition,
    handleDeletePosition,
    validateVpiUniqueness,
    ...positionHandlers
  };
};
