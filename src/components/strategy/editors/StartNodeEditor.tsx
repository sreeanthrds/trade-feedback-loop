
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IndicatorSelector from './IndicatorSelector';
import { timeframeOptions, exchangeOptions } from '../utils/indicatorConfig';
import SymbolSelector from './form-components/SymbolSelector';
import { 
  InputField, 
  SelectField, 
  RadioGroupField
} from './shared';

interface StartNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

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

const StartNodeEditor = ({ node, updateNodeData }: StartNodeEditorProps) => {
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
  
  // Update node data when form data changes, but avoid infinite loops
  const handleFormSubmit = () => {
    updateNodeData(node.id, formData);
  };
  
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
  
  // Define radio options for instrument type
  const instrumentTypeOptions = [
    { value: 'stock', label: 'Stock' },
    { value: 'futures', label: 'Futures' },
    { value: 'options', label: 'Options' }
  ];
  
  // Define radio options for underlying type
  const underlyingTypeOptions = [
    { value: 'index', label: 'Index' },
    { value: 'indexFuture', label: 'Index Future' },
    { value: 'stock', label: 'Stock' }
  ];

  return (
    <Tabs defaultValue="basic" className="space-y-4">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="basic">Basic Settings</TabsTrigger>
        <TabsTrigger value="indicators">Indicators</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <InputField
          label="Strategy Name"
          id="node-label"
          value={formData.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          placeholder="Enter strategy name"
        />
        
        <RadioGroupField
          label="Trading Instrument Type" 
          value={formData.tradingInstrument?.type || 'stock'}
          options={instrumentTypeOptions}
          onChange={(value) => handleTradingInstrumentChange(value as 'stock' | 'futures' | 'options')}
        />
        
        {formData.tradingInstrument?.type === 'options' && (
          <RadioGroupField
            label="Underlying Type" 
            value={formData.tradingInstrument.underlyingType || ''}
            options={underlyingTypeOptions}
            onChange={(value) => handleUnderlyingTypeChange(value as 'index' | 'indexFuture' | 'stock')}
          />
        )}
        
        <SelectField
          label="Timeframe"
          id="node-timeframe"
          value={formData.timeframe || ''}
          options={timeframeOptions}
          onChange={(value) => handleInputChange('timeframe', value)}
          placeholder="Select timeframe"
        />
        
        <SelectField
          label="Exchange"
          id="node-exchange"
          value={formData.exchange || ''}
          options={exchangeOptions}
          onChange={(value) => handleInputChange('exchange', value)}
          placeholder="Select exchange"
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="node-symbol">Symbol</label>
          <SymbolSelector
            id="node-symbol"
            value={formData.symbol || ''}
            onChange={(value) => handleInputChange('symbol', value)}
            placeholder="Search for a symbol..."
            instrumentType={formData.tradingInstrument?.type}
            underlyingType={formData.tradingInstrument?.type === 'options' ? formData.tradingInstrument.underlyingType : undefined}
          />
        </div>
        
        <div className="bg-muted/30 rounded-md p-4 mt-4">
          <p className="text-sm text-muted-foreground">
            The Start Node is the entry point of your strategy. Configure basic settings here and add technical indicators in the Indicators tab.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="indicators">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-medium text-foreground">Technical Indicators</h3>
          </div>
          
          <div className="pt-1">
            <IndicatorSelector
              selectedIndicators={formData.indicatorParameters || {}}
              onChange={handleIndicatorsChange}
            />
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-md p-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Add and configure technical indicators to use in your strategy conditions and actions.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default StartNodeEditor;
