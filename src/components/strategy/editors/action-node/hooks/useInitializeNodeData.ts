
import { useEffect, useRef } from 'react';
import { NodeData, Position } from '../types';

interface UseInitializeNodeDataProps {
  nodeData: NodeData;
  updateNodeData: (id: string, data: any) => void;
  nodeId: string;
}

export const useInitializeNodeData = ({ 
  nodeData, 
  updateNodeData, 
  nodeId 
}: UseInitializeNodeDataProps) => {
  const initializedRef = useRef(false);
  
  // Set default values if not present - this runs only once
  useEffect(() => {
    if (!initializedRef.current) {
      // Check if initialization is needed
      const needsInitialization = 
        !nodeData?.actionType || 
        !nodeData?.positions || 
        nodeData.positions.length === 0;
      
      if (needsInitialization) {
        // Create a clean defaultValues object only with the needed properties
        const defaultValues: Partial<NodeData> = {};
        
        // Add defaults only for missing values
        if (!nodeData?.actionType) defaultValues.actionType = 'entry';
        
        // Initialize positions array if needed
        if (!nodeData?.positions || nodeData.positions.length === 0) {
          // Generate position ID
          const positionId = `pos-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          // Generate VPI using node ID
          const positionNumber = 1;
          const vpi = `${nodeId}-${positionNumber}`;
          
          // Create a default position
          const defaultPosition: Position = {
            id: positionId,
            vpi: vpi,
            vpt: '',
            priority: 1,
            positionType: 'buy',
            orderType: 'market',
            lots: 1,
            productType: 'intraday'
          };
          
          // Add default option details if needed for option instruments
          if (nodeData?.instrument && nodeData.instrument.includes('OPT')) {
            defaultPosition.optionDetails = {
              expiry: 'W0',
              strikeType: 'ATM',
              optionType: 'CE'
            };
          }
          
          defaultValues.positions = [defaultPosition];
        }
        
        // Only update if we have defaults to set
        if (Object.keys(defaultValues).length > 0) {
          updateNodeData(nodeId, defaultValues);
        }
      }
      
      // Mark as initialized to prevent future updates
      initializedRef.current = true;
    }
  }, [nodeId, nodeData, updateNodeData]); // Adding dependencies but using ref to prevent re-runs
};
