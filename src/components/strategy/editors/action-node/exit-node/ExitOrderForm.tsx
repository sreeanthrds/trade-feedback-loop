
import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NodeDetailsPanel } from '../../shared';
import { useActionNodeForm } from '../useActionNodeForm';
import { useExitOrderForm } from '../exit-node/useExitOrderForm';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { ExitOrderConfig, QuantityType } from './types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormItem } from '@/components/ui/form';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReEntryToggle } from './ReEntryToggle';
import { InfoCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PostExecutionTab from './PostExecutionTab';

interface ExitOrderFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

export const ExitOrderForm: React.FC<ExitOrderFormProps> = ({ node, updateNodeData }) => {
  const { nodeData } = useActionNodeForm({ node, updateNodeData });
  const [activeTab, setActiveTab] = useState<string>("exit-order");
  
  // Get all positions from all nodes for position selector
  const nodes = useStrategyStore(state => state.nodes);
  const allPositions = nodes.flatMap(n => n.data?.positions || []).filter(Boolean);
  
  // Get handlers from hook
  const {
    orderType,
    limitPrice,
    targetPositionId,
    quantity,
    partialQuantityPercentage,
    specificQuantity,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleTargetPositionChange,
    handleQuantityTypeChange,
    handlePartialQuantityChange,
    handleSpecificQuantityChange,
    reEntryEnabled,
    handleReEntryToggle
  } = useExitOrderForm({ node, updateNodeData });
  
  return (
    <div className="space-y-4">
      <NodeDetailsPanel 
        nodeLabel={nodeData?.label || ''}
        onLabelChange={(label) => updateNodeData(node.id, { ...nodeData, label })}
        infoTooltip="Exit nodes close existing positions based on conditions from connected signal nodes."
      />
      
      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mt-4"
      >
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="exit-order">Exit Order</TabsTrigger>
          <TabsTrigger className="flex-1" value="post-execution">Post-Execution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exit-order" className="mt-4 space-y-4">
          <div className="space-y-4 bg-accent/5 rounded-md p-3">
            <FormItem className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Position to Exit</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Select which position this exit node should affect.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Select
                value={targetPositionId || '_any'}
                onValueChange={handleTargetPositionChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_any">Any Position (default)</SelectItem>
                  {allPositions.map(position => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.vpi} {position.vpt ? `(${position.vpt})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            
            <FormItem className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Exit Quantity</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Choose how much of the position to exit.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <RadioGroup
                value={quantity}
                onValueChange={handleQuantityTypeChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="cursor-pointer text-xs">Exit All</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage" className="cursor-pointer text-xs">Exit Percentage</Label>
                  
                  {quantity === 'percentage' && (
                    <div className="ml-2 flex-grow">
                      <EnhancedNumberInput
                        label=""
                        hideLabel
                        value={partialQuantityPercentage}
                        onChange={handlePartialQuantityChange}
                        min={1}
                        max={100}
                        step={1}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific" />
                  <Label htmlFor="specific" className="cursor-pointer text-xs">Specific Quantity</Label>
                  
                  {quantity === 'specific' && (
                    <div className="ml-2 flex-grow">
                      <EnhancedNumberInput
                        label=""
                        hideLabel
                        value={specificQuantity}
                        onChange={handleSpecificQuantityChange}
                        min={0.01}
                        step={0.01}
                      />
                    </div>
                  )}
                </div>
              </RadioGroup>
            </FormItem>
            
            <FormItem className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Order Type</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Choose the order type for exiting the position.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <RadioGroup
                value={orderType}
                onValueChange={handleOrderTypeChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="market" id="market" />
                  <Label htmlFor="market" className="cursor-pointer text-xs">Market Order</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limit" id="limit" />
                  <Label htmlFor="limit" className="cursor-pointer text-xs">Limit Order</Label>
                </div>
              </RadioGroup>
              
              {orderType === 'limit' && (
                <div className="mt-2">
                  <EnhancedNumberInput
                    label="Limit Price"
                    value={limitPrice}
                    onChange={handleLimitPriceChange}
                    min={0.01}
                    step={0.01}
                    tooltip="Target price for limit order"
                  />
                </div>
              )}
            </FormItem>
          </div>
          
          <div className="bg-accent/5 rounded-md p-3">
            <ReEntryToggle
              enabled={reEntryEnabled}
              onToggle={handleReEntryToggle}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="post-execution" className="mt-4">
          <PostExecutionTab node={node} updateNodeData={updateNodeData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
