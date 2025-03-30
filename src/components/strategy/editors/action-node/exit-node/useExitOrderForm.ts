
import { useState, useEffect, useRef, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { ExitOrderType, ExitOrderConfig } from './types';

interface UseExitOrderFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useExitOrderForm = ({ node, updateNodeData }: UseExitOrderFormProps) => {
  // Default order config
  const defaultOrderConfig: ExitOrderConfig = {
    orderType: 'market' as ExitOrderType,
    limitPrice: undefined,
    quantity: 'all',
    partialQuantityPercentage: 50
  };

  // Get exit node data from node or use default
  const nodeData = node.data || {};
  const exitOrderConfig = (nodeData.exitOrderConfig as ExitOrderConfig | null) || null;
  
  // Track if we've done initialization
  const initializedRef = useRef(false);
  
  // State for order form
  const [orderType, setOrderType] = useState<ExitOrderType>(
    exitOrderConfig?.orderType || 'market'
  );
  
  const [limitPrice, setLimitPrice] = useState<number | undefined>(
    exitOrderConfig?.limitPrice
  );
  
  const [multipleOrders, setMultipleOrders] = useState<boolean>(
    Boolean(nodeData.multipleOrders)
  );
  
  const [quantityType, setQuantityType] = useState<'all' | 'partial'>(
    exitOrderConfig?.quantity || 'all'
  );
  
  const [quantityPercentage, setQuantityPercentage] = useState<number | undefined>(
    exitOrderConfig?.partialQuantityPercentage || 50
  );

  // Initialize the node data if needed
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      
      if (!exitOrderConfig) {
        updateNodeData(node.id, {
          ...nodeData,
          exitOrderConfig: defaultOrderConfig
        });
      }
    }
  }, [node.id, nodeData, updateNodeData, exitOrderConfig, defaultOrderConfig]);

  // Order type change handler
  const handleOrderTypeChange = useCallback((value: string) => {
    setOrderType(value as ExitOrderType);
    
    const updatedConfig: ExitOrderConfig = {
      ...(exitOrderConfig || defaultOrderConfig),
      orderType: value as ExitOrderType
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitOrderConfig: updatedConfig
    });
  }, [node.id, nodeData, updateNodeData, exitOrderConfig, defaultOrderConfig]);

  // Limit price change handler
  const handleLimitPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const limitPrice = value === '' ? undefined : parseFloat(value);
    
    setLimitPrice(limitPrice);
    
    const updatedConfig: ExitOrderConfig = {
      ...(exitOrderConfig || defaultOrderConfig),
      limitPrice
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitOrderConfig: updatedConfig
    });
  }, [node.id, nodeData, updateNodeData, exitOrderConfig, defaultOrderConfig]);

  // Multiple orders toggle handler
  const handleMultipleOrdersToggle = useCallback((checked: boolean) => {
    setMultipleOrders(checked);
    
    updateNodeData(node.id, {
      ...nodeData,
      multipleOrders: checked
    });
  }, [node.id, nodeData, updateNodeData]);

  // Quantity type change handler
  const handleQuantityTypeChange = useCallback((value: string) => {
    setQuantityType(value as 'all' | 'partial');
    
    const updatedConfig: ExitOrderConfig = {
      ...(exitOrderConfig || defaultOrderConfig),
      quantity: value as 'all' | 'partial'
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitOrderConfig: updatedConfig
    });
  }, [node.id, nodeData, updateNodeData, exitOrderConfig, defaultOrderConfig]);

  // Quantity percentage change handler
  const handleQuantityPercentageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const percentage = value === '' ? undefined : parseInt(value);
    
    setQuantityPercentage(percentage);
    
    const updatedConfig: ExitOrderConfig = {
      ...(exitOrderConfig || defaultOrderConfig),
      partialQuantityPercentage: percentage
    };
    
    updateNodeData(node.id, {
      ...nodeData,
      exitOrderConfig: updatedConfig
    });
  }, [node.id, nodeData, updateNodeData, exitOrderConfig, defaultOrderConfig]);

  return {
    orderType,
    limitPrice,
    multipleOrders,
    quantityType,
    quantityPercentage,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleMultipleOrdersToggle,
    handleQuantityTypeChange,
    handleQuantityPercentageChange
  };
};
