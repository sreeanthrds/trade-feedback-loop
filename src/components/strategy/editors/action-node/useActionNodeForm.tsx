import { useState, useEffect, useRef, useCallback } from 'react';
import { Node, useReactFlow } from '@xyflow/react';
import { NodeData, StartNodeData } from './types';

interface UseActionNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useActionNodeForm = ({ node, updateNodeData }: UseActionNodeFormProps) => {
  const { getNodes } = useReactFlow();
  const nodeData = node.data as NodeData;
  const [showLimitPrice, setShowLimitPrice] = useState(nodeData?.orderType === 'limit');
  const [hasOptionTrading, setHasOptionTrading] = useState(false);
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(nodeData?.instrument || undefined);
  const previousSymbolRef = useRef<string | undefined>(startNodeSymbol);
  const previousInstrumentTypeRef = useRef<string | undefined>(undefined);
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
        updateNodeData(node.id, defaultValues);
        initializedRef.current = true;
      }
    }
  }, [node.id, nodeData, updateNodeData]);
  
  // Keep orderType and showLimitPrice in sync
  useEffect(() => {
    setShowLimitPrice(nodeData?.orderType === 'limit');
  }, [nodeData?.orderType]);
  
  // Get the start node to access its instrument
  useEffect(() => {
    const fetchStartNodeData = () => {
      const nodes = getNodes();
      const startNode = nodes.find(node => node.type === 'startNode');
      if (startNode && startNode.data) {
        const data = startNode.data as StartNodeData;
        
        // Check for options trading
        const optionsEnabled = data.tradingInstrument?.type === 'options';
        
        // If instrument type changed from options to something else, we need to clear option details
        if (previousInstrumentTypeRef.current === 'options' && data.tradingInstrument?.type !== 'options') {
          updateNodeData(node.id, { optionDetails: undefined });
        }
        
        // Update the previous instrument type reference
        previousInstrumentTypeRef.current = data.tradingInstrument?.type;
        
        // Update options trading state
        if (hasOptionTrading !== optionsEnabled) {
          setHasOptionTrading(optionsEnabled || false);
        }
        
        // Get and set the instrument from the start node
        if (data.symbol !== previousSymbolRef.current) {
          setStartNodeSymbol(data.symbol);
          previousSymbolRef.current = data.symbol;
          
          // Also update the node data if the symbol changed
          if (data.symbol) {
            updateNodeData(node.id, { instrument: data.symbol });
          }
        }
      }
    };

    // Initial fetch
    fetchStartNodeData();

    // Set up an interval to check for changes - more frequent updates for better responsiveness
    const intervalId = setInterval(fetchStartNodeData, 100);

    return () => clearInterval(intervalId);
  }, [getNodes, node.id, updateNodeData, hasOptionTrading]);
  
  // Create memoized handler functions that will remain stable across renders
  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  }, [node.id, updateNodeData]);

  const handleActionTypeChange = useCallback((value: string) => {
    updateNodeData(node.id, { 
      actionType: value,
      // Reset position type if changing to alert
      ...(value === 'alert' && { positionType: undefined })
    });
  }, [node.id, updateNodeData]);
  
  const handlePositionTypeChange = useCallback((value: string) => {
    updateNodeData(node.id, { positionType: value });
  }, [node.id, updateNodeData]);
  
  const handleOrderTypeChange = useCallback((value: string) => {
    setShowLimitPrice(value === 'limit');
    updateNodeData(node.id, { 
      orderType: value,
      // Reset limit price if changing to market
      ...(value === 'market' && { limitPrice: undefined })
    });
  }, [node.id, updateNodeData]);
  
  const handleLimitPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updateNodeData(node.id, { limitPrice: value });
    }
  }, [node.id, updateNodeData]);
  
  const handleLotsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateNodeData(node.id, { lots: value });
    }
  }, [node.id, updateNodeData]);
  
  const handleProductTypeChange = useCallback((value: string) => {
    updateNodeData(node.id, { productType: value });
  }, [node.id, updateNodeData]);
  
  const handleExpiryChange = useCallback((value: string) => {
    updateNodeData(node.id, { 
      optionDetails: {
        ...nodeData?.optionDetails,
        expiry: value
      }
    });
  }, [node.id, nodeData?.optionDetails, updateNodeData]);
  
  const handleStrikeTypeChange = useCallback((value: string) => {
    updateNodeData(node.id, { 
      optionDetails: {
        ...nodeData?.optionDetails,
        strikeType: value,
        // Reset strike value if not premium
        ...(value !== 'premium' && { strikeValue: undefined })
      }
    });
  }, [node.id, nodeData?.optionDetails, updateNodeData]);
  
  const handleStrikeValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updateNodeData(node.id, { 
        optionDetails: {
          ...nodeData?.optionDetails,
          strikeValue: value
        }
      });
    }
  }, [node.id, nodeData?.optionDetails, updateNodeData]);
  
  const handleOptionTypeChange = useCallback((value: string) => {
    updateNodeData(node.id, { 
      optionDetails: {
        ...nodeData?.optionDetails,
        optionType: value
      }
    });
  }, [node.id, nodeData?.optionDetails, updateNodeData]);

  return {
    nodeData,
    showLimitPrice,
    hasOptionTrading,
    startNodeSymbol,
    handleLabelChange,
    handleActionTypeChange,
    handlePositionTypeChange,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleLotsChange,
    handleProductTypeChange,
    handleExpiryChange,
    handleStrikeTypeChange,
    handleStrikeValueChange,
    handleOptionTypeChange
  };
};
