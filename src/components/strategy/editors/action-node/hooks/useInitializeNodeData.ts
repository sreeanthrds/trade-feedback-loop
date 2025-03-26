
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
      // Create a clean defaultValues object
      const defaultValues: Partial<NodeData> = {};
      
      // Add defaults only for missing values
      if (!nodeData?.actionType) defaultValues.actionType = 'entry';
      if (!nodeData?.positionType) defaultValues.positionType = 'buy';
      if (!nodeData?.orderType) defaultValues.orderType = 'market';
      if (!nodeData?.lots) defaultValues.lots = 1;
      if (!nodeData?.productType) defaultValues.productType = 'intraday';
      
      // Handle option details
      if (nodeData?.optionDetails) {
        defaultValues.optionDetails = { ...nodeData.optionDetails };
        if (!nodeData.optionDetails.expiry) defaultValues.optionDetails.expiry = 'W0';
        if (!nodeData.optionDetails.strikeType) defaultValues.optionDetails.strikeType = 'ATM';
        if (!nodeData.optionDetails.optionType) defaultValues.optionDetails.optionType = 'CE';
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
        initializedRef.current = true;
      }
    }
  }, [nodeId, nodeData, updateNodeData]);
};
