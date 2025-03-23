
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IndicatorSelector from './IndicatorSelector';
import { timeframeOptions, exchangeOptions } from '../utils/indicatorConfig';

interface StartNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface NodeData {
  label?: string;
  timeframe?: string;
  exchange?: string;
  symbol?: string;
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
    indicators: nodeData?.indicators || [],
    indicatorParameters: nodeData?.indicatorParameters || {}
  });
  
  // Update form data when node data changes
  useEffect(() => {
    setFormData({
      label: nodeData?.label || 'Start',
      timeframe: nodeData?.timeframe || '',
      exchange: nodeData?.exchange || '',
      symbol: nodeData?.symbol || '',
      indicators: nodeData?.indicators || [],
      indicatorParameters: nodeData?.indicatorParameters || {}
    });
  }, [nodeData]);
  
  // Update node data when form data changes
  useEffect(() => {
    updateNodeData(node.id, formData);
  }, [formData, node.id, updateNodeData]);
  
  const handleInputChange = (field: keyof NodeData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleIndicatorsChange = (indicatorParams: Record<string, Record<string, any>>) => {
    setFormData(prev => ({
      ...prev,
      indicatorParameters: indicatorParams,
      indicators: Object.keys(indicatorParams)
    }));
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
          <Input
            id="node-symbol"
            value={formData.symbol}
            onChange={(e) => handleInputChange('symbol', e.target.value)}
            placeholder="e.g., BANKNIFTY, RELIANCE"
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
