
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
      const defaultValues: Partial<NodeData> = {
        actionType: nodeData?.actionType || 'entry',
        positionType: nodeData?.positionType || 'buy',
        orderType: nodeData?.orderType || 'market',
        lots: nodeData?.lots || 1,
        productType: nodeData?.productType || 'intraday',
        optionDetails: {
          ...nodeData?.optionDetails,
          expiry: nodeData?.optionDetails?.expiry || 'W0',
          strikeType: nodeData?.optionDetails?.strikeType || 'ATM',
          optionType: nodeData?.optionDetails?.optionType || 'CE'
        }
      };
      
      // Only update if any default values are missing
      if (!nodeData?.actionType || !nodeData?.positionType || 
          !nodeData?.orderType || !nodeData?.lots || !nodeData?.productType || 
          !nodeData?.optionDetails?.expiry || !nodeData?.optionDetails?.strikeType || 
          !nodeData?.optionDetails?.optionType) {
        updateNodeData(nodeId, defaultValues);
        initializedRef.current = true;
      }
    }
  }, [nodeId, nodeData, updateNodeData]);
};
