
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';

interface NodeData {
  label?: string;
  timeframe?: string;
  exchange?: string;
  symbol?: string;
  tradingInstrument?: {
    type: 'stock' | 'futures' | 'options';
    underlyingType?: 'index' | 'indexFuture' | 'stock';
  };
  indicators?: string[];
  indicatorParameters?: Record<string, Record<string, any>>;
}

interface UseStartNodeFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const useStartNodeForm = ({ node, updateNodeData }: UseStartNodeFormProps) => {
  const nodeData = node.data as NodeData | undefined;
  
  const [formData, setFormData] = useState<NodeData>({
    label: nodeData?.label || 'Start',
    timeframe: nodeData?.timeframe || '',
    exchange: nodeData?.exchange || '',
    symbol: nodeData?.symbol || '',
    tradingInstrument: nodeData?.tradingInstrument || { type: 'stock' },
    indicators: nodeData?.indicators || [],
    indicatorParameters: nodeData?.indicatorParameters || {}
  });
  
  // Load initial data from node - run only once when node changes
  useEffect(() => {
    setFormData({
      label: nodeData?.label || 'Start',
      timeframe: nodeData?.timeframe || '',
      exchange: nodeData?.exchange || '',
      symbol: nodeData?.symbol || '',
      tradingInstrument: nodeData?.tradingInstrument || { type: 'stock' },
      indicators: nodeData?.indicators || [],
      indicatorParameters: nodeData?.indicatorParameters || {}
    });
  }, [node.id]); // Only when node.id changes, not when nodeData changes
  
  const handleInputChange = (field: keyof NodeData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Use a timeout to avoid multiple rapid updates
    setTimeout(() => {
      updateNodeData(node.id, {
        ...formData,
        [field]: value
      });
    }, 100);
  };

  const handleTradingInstrumentChange = (type: 'stock' | 'futures' | 'options') => {
    const updatedInstrument = { 
      type,
      ...(type === 'options' ? { underlyingType: undefined } : {})
    };
    
    const updatedFormData = {
      ...formData,
      tradingInstrument: updatedInstrument,
      symbol: '' // Reset symbol when type changes
    };
    
    setFormData(updatedFormData);
    
    setTimeout(() => {
      updateNodeData(node.id, updatedFormData);
    }, 100);
  };

  const handleUnderlyingTypeChange = (underlyingType: 'index' | 'indexFuture' | 'stock') => {
    if (!formData.tradingInstrument) return;
    
    const updatedInstrument = { 
      ...formData.tradingInstrument,
      underlyingType
    };
    
    const updatedFormData = {
      ...formData,
      tradingInstrument: updatedInstrument,
      symbol: '' // Reset symbol when underlying type changes
    };
    
    setFormData(updatedFormData);
    
    setTimeout(() => {
      updateNodeData(node.id, updatedFormData);
    }, 100);
  };
  
  const handleIndicatorsChange = (indicatorParams: Record<string, Record<string, any>>) => {
    const updatedFormData = {
      ...formData,
      indicatorParameters: indicatorParams,
      indicators: Object.keys(indicatorParams)
    };
    
    setFormData(updatedFormData);
    
    // Use a timeout to avoid multiple rapid updates
    setTimeout(() => {
      updateNodeData(node.id, updatedFormData);
    }, 100);
  };
  
  return {
    formData,
    handleInputChange,
    handleTradingInstrumentChange,
    handleUnderlyingTypeChange,
    handleIndicatorsChange
  };
};
