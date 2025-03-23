
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import IndicatorSelector from './IndicatorSelector';
import { timeframeOptions, exchangeOptions } from '../utils/indicatorConfig';
import SymbolSelector from './form-components/SymbolSelector';

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
  
  return (
    <Tabs defaultValue="basic" className="space-y-4">
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="basic">Basic Settings</TabsTrigger>
        <TabsTrigger value="indicators">Indicators</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <div>
          <Label htmlFor="node-label">Strategy Name</Label>
          <Input
            id="node-label"
            value={formData.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Enter strategy name"
          />
        </div>
        
        <div>
          <Label>Trading Instrument Type</Label>
          <RadioGroup 
            value={formData.tradingInstrument?.type || 'stock'} 
            onValueChange={(value: 'stock' | 'futures' | 'options') => handleTradingInstrumentChange(value)}
            className="flex flex-col space-y-1 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stock" id="instrument-stock" />
              <Label htmlFor="instrument-stock" className="cursor-pointer">Stock</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="futures" id="instrument-futures" />
              <Label htmlFor="instrument-futures" className="cursor-pointer">Futures</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="options" id="instrument-options" />
              <Label htmlFor="instrument-options" className="cursor-pointer">Options</Label>
            </div>
          </RadioGroup>
        </div>
        
        {formData.tradingInstrument?.type === 'options' && (
          <div>
            <Label>Underlying Type</Label>
            <RadioGroup 
              value={formData.tradingInstrument.underlyingType || ''} 
              onValueChange={(value: 'index' | 'indexFuture' | 'stock') => handleUnderlyingTypeChange(value)}
              className="flex flex-col space-y-1 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="index" id="underlying-index" />
                <Label htmlFor="underlying-index" className="cursor-pointer">Index</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="indexFuture" id="underlying-indexFuture" />
                <Label htmlFor="underlying-indexFuture" className="cursor-pointer">Index Future</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stock" id="underlying-stock" />
                <Label htmlFor="underlying-stock" className="cursor-pointer">Stock</Label>
              </div>
            </RadioGroup>
          </div>
        )}
        
        <div>
          <Label htmlFor="node-timeframe">Timeframe</Label>
          <Select
            value={formData.timeframe}
            onValueChange={(value) => handleInputChange('timeframe', value)}
          >
            <SelectTrigger id="node-timeframe">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="node-exchange">Exchange</Label>
          <Select
            value={formData.exchange}
            onValueChange={(value) => handleInputChange('exchange', value)}
          >
            <SelectTrigger id="node-exchange">
              <SelectValue placeholder="Select exchange" />
            </SelectTrigger>
            <SelectContent>
              {exchangeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="node-symbol">Symbol</Label>
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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="indicators">
            <AccordionTrigger>Technical Indicators</AccordionTrigger>
            <AccordionContent>
              <IndicatorSelector
                selectedIndicators={formData.indicatorParameters || {}}
                onChange={handleIndicatorsChange}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
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
