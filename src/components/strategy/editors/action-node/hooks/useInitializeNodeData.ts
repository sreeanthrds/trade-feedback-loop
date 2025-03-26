
import { useEffect, useRef } from 'react';
import { NodeData } from '../types';

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
        !nodeData?.positionType || 
        !nodeData?.orderType || 
        !nodeData?.lots || 
        !nodeData?.productType ||
        (nodeData?.instrument?.includes('OPT') && !nodeData?.optionDetails) ||
        (nodeData?.optionDetails && (!nodeData.optionDetails.expiry || !nodeData.optionDetails.strikeType || !nodeData.optionDetails.optionType));
      
      if (needsInitialization) {
        // Create a clean defaultValues object only with the needed properties
        const defaultValues: Partial<NodeData> = {};
        
        // Add defaults only for missing values
        if (!nodeData?.actionType) defaultValues.actionType = 'entry';
        if (!nodeData?.positionType) defaultValues.positionType = 'buy';
        if (!nodeData?.orderType) defaultValues.orderType = 'market';
        if (!nodeData?.lots) defaultValues.lots = 1;
        if (!nodeData?.productType) defaultValues.productType = 'intraday';
        
        // Handle option details in a more optimized way
        if (nodeData?.optionDetails) {
          const optDefaults: any = {};
          let needsOptionUpdate = false;
          
          if (!nodeData.optionDetails.expiry) {
            optDefaults.expiry = 'W0';
            needsOptionUpdate = true;
          }
          if (!nodeData.optionDetails.strikeType) {
            optDefaults.strikeType = 'ATM';
            needsOptionUpdate = true;
          }
          if (!nodeData.optionDetails.optionType) {
            optDefaults.optionType = 'CE';
            needsOptionUpdate = true;
          }
          
          if (needsOptionUpdate) {
            defaultValues.optionDetails = { ...nodeData.optionDetails, ...optDefaults };
          }
        } else if (nodeData?.instrument && nodeData?.instrument.includes('OPT')) {
          // Initialize options data if it's an options instrument
          defaultValues.optionDetails = {
            expiry: 'W0',
            strikeType: 'ATM',
            optionType: 'CE'
          };
        }
        
        // Only update if we have defaults to set
        if (Object.keys(defaultValues).length > 0) {
          updateNodeData(nodeId, defaultValues);
        }
      }
      
      // Mark as initialized to prevent future updates
      initializedRef.current = true;
    }
  }, [nodeId]);  // Remove other dependencies to prevent re-running
};
