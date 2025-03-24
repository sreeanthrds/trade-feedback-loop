
import { useState, useEffect, useRef } from 'react';
import { Node, useReactFlow } from '@xyflow/react';
import { NodeData, StartNodeData } from './types';

interface UseActionNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useActionNodeForm = ({ node, updateNodeData }: UseActionNodeFormProps) => {
  const { getNodes } = useReactFlow();
  const nodeData = node.data as NodeData;
  const [showLimitPrice, setShowLimitPrice] = useState(nodeData.orderType === 'limit');
  const [hasOptionTrading, setHasOptionTrading] = useState(false);
  const [startNodeSymbol, setStartNodeSymbol] = useState<string | undefined>(nodeData.instrument || undefined);
  const previousSymbolRef = useRef<string | undefined>(startNodeSymbol);
  
  // Get the start node to access its instrument
  useEffect(() => {
    const fetchStartNodeData = () => {
      const nodes = getNodes();
      const startNode = nodes.find(node => node.type === 'startNode');
      if (startNode && startNode.data) {
        const data = startNode.data as StartNodeData;
        
        // Check for options trading
        const optionsEnabled = data.tradingInstrument?.type === 'options';
        setHasOptionTrading(optionsEnabled || false);
        
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
    const intervalId = setInterval(fetchStartNodeData, 200);

    return () => clearInterval(intervalId);
  }, [getNodes, node.id, updateNodeData]);
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  const handleActionTypeChange = (value: string) => {
    updateNodeData(node.id, { 
      actionType: value,
      // Reset position type if changing to alert
      ...(value === 'alert' && { positionType: undefined })
    });
  };
  
  const handlePositionTypeChange = (value: string) => {
    updateNodeData(node.id, { positionType: value });
  };
  
  const handleOrderTypeChange = (value: string) => {
    setShowLimitPrice(value === 'limit');
    updateNodeData(node.id, { 
      orderType: value,
      // Reset limit price if changing to market
      ...(value === 'market' && { limitPrice: undefined })
    });
  };
  
  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { limitPrice: parseFloat(e.target.value) || 0 });
  };
  
  const handleLotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { lots: parseInt(e.target.value) || 1 });
  };
  
  const handleProductTypeChange = (value: string) => {
    updateNodeData(node.id, { productType: value });
  };
  
  const handleExpiryChange = (value: string) => {
    updateNodeData(node.id, { 
      optionDetails: {
        ...nodeData.optionDetails,
        expiry: value
      }
    });
  };
  
  const handleStrikeTypeChange = (value: string) => {
    updateNodeData(node.id, { 
      optionDetails: {
        ...nodeData.optionDetails,
        strikeType: value,
        // Reset strike value if not premium
        ...(value !== 'premium' && { strikeValue: undefined })
      }
    });
  };
  
  const handleStrikeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { 
      optionDetails: {
        ...nodeData.optionDetails,
        strikeValue: parseFloat(e.target.value) || 0
      }
    });
  };
  
  const handleOptionTypeChange = (value: string) => {
    updateNodeData(node.id, { 
      optionDetails: {
        ...nodeData.optionDetails,
        optionType: value
      }
    });
  };

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
