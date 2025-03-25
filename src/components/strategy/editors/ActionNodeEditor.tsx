
import React from 'react';
import { Node } from '@xyflow/react';
import { useActionNodeForm } from './action-node/useActionNodeForm';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { ArrowUpCircle, ArrowDownCircle, X, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActionNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ActionNodeEditor = ({ node, updateNodeData }: ActionNodeEditorProps) => {
  const { 
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
  } = useActionNodeForm({ node, updateNodeData });

  return (
    <div className="space-y-4 p-1">
      <div className="space-y-3">
        <Label htmlFor="node-label" className="text-sm font-medium">Node Label</Label>
        <Input
          id="node-label"
          value={nodeData?.label || ''}
          onChange={handleLabelChange}
          placeholder="Enter node label"
          className="h-9"
        />
      </div>

      <Separator className="my-4" />
      
      <div className="space-y-4">
        <Label className="text-sm font-medium">Action Type</Label>
        <div className="grid grid-cols-3 gap-2 mt-1">
          <ActionTypeButton 
            icon={<ArrowUpCircle className="h-4 w-4 text-emerald-500" />}
            label="Entry"
            selected={nodeData?.actionType === 'entry'}
            onClick={() => handleActionTypeChange('entry')}
          />
          <ActionTypeButton 
            icon={<X className="h-4 w-4 text-amber-600" />}
            label="Exit"
            selected={nodeData?.actionType === 'exit'}
            onClick={() => handleActionTypeChange('exit')}
          />
          <ActionTypeButton 
            icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
            label="Alert"
            selected={nodeData?.actionType === 'alert'}
            onClick={() => handleActionTypeChange('alert')}
          />
        </div>
      </div>

      {nodeData?.actionType !== 'alert' && (
        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="basic">Order</TabsTrigger>
            <TabsTrigger value="instrument">Instrument</TabsTrigger>
            {hasOptionTrading && <TabsTrigger value="options" className="col-span-2">Options</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="basic" className="pt-4 space-y-4">
            {nodeData?.actionType === 'entry' && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Position Type</Label>
                <RadioGroup 
                  value={nodeData?.positionType || 'buy'} 
                  onValueChange={handlePositionTypeChange}
                  className="flex"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="buy" id="r1" />
                    <Label htmlFor="r1" className="flex items-center cursor-pointer">
                      <ArrowUpCircle className="h-4 w-4 text-emerald-500 mr-2" />
                      <span>Buy</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="sell" id="r2" />
                    <Label htmlFor="r2" className="flex items-center cursor-pointer">
                      <ArrowDownCircle className="h-4 w-4 text-rose-600 mr-2" />
                      <span>Sell</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Order Type</Label>
              <RadioGroup 
                value={nodeData?.orderType || 'market'} 
                onValueChange={handleOrderTypeChange}
                className="flex"
              >
                <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="market" id="o1" />
                  <Label htmlFor="o1" className="cursor-pointer">Market</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="limit" id="o2" />
                  <Label htmlFor="o2" className="cursor-pointer">Limit</Label>
                </div>
              </RadioGroup>
            </div>
            
            {showLimitPrice && (
              <div className="space-y-2">
                <Label htmlFor="limit-price" className="text-sm font-medium">Limit Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="limit-price"
                    type="number"
                    value={nodeData?.limitPrice || ''}
                    onChange={handleLimitPriceChange}
                    className="pl-7 h-9"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="lots" className="text-sm font-medium">Quantity (Lots)</Label>
              <Input
                id="lots"
                type="number"
                value={nodeData?.lots || 1}
                onChange={handleLotsChange}
                min={1}
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Product Type</Label>
              <RadioGroup 
                value={nodeData?.productType || 'intraday'} 
                onValueChange={handleProductTypeChange}
                className="flex"
              >
                <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="intraday" id="p1" />
                  <Label htmlFor="p1" className="cursor-pointer">MIS</Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="carryForward" id="p2" />
                  <Label htmlFor="p2" className="cursor-pointer">CNC</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="instrument" className="pt-4">
            <Card className="border bg-muted/30">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Instrument</span>
                  <span className="text-sm font-semibold">{startNodeSymbol || 'Not set'}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2.5">
                  This value is inherited from the Start Node. To change it, edit the Start Node configuration.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {hasOptionTrading && (
            <TabsContent value="options" className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-sm font-medium">Expiry</Label>
                <Select
                  value={nodeData?.optionDetails?.expiry || 'W0'}
                  onValueChange={handleExpiryChange}
                >
                  <SelectTrigger id="expiry" className="h-9">
                    <SelectValue placeholder="Select expiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="W0">Current (W0)</SelectItem>
                    <SelectItem value="W1">Next Week (W1)</SelectItem>
                    <SelectItem value="W2">Week 2 (W2)</SelectItem>
                    <SelectItem value="M1">Next Month (M1)</SelectItem>
                    <SelectItem value="M2">Month 2 (M2)</SelectItem>
                    <SelectItem value="M3">Month 3 (M3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strikeType" className="text-sm font-medium">Strike Type</Label>
                <Select
                  value={nodeData?.optionDetails?.strikeType || 'ATM'}
                  onValueChange={handleStrikeTypeChange}
                >
                  <SelectTrigger id="strikeType" className="h-9">
                    <SelectValue placeholder="Select strike type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATM">At the Money (ATM)</SelectItem>
                    <SelectItem value="ITM1">In the Money 1 (ITM1)</SelectItem>
                    <SelectItem value="ITM2">In the Money 2 (ITM2)</SelectItem>
                    <SelectItem value="OTM1">Out of Money 1 (OTM1)</SelectItem>
                    <SelectItem value="OTM2">Out of Money 2 (OTM2)</SelectItem>
                    <SelectItem value="premium">Custom Strike Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {nodeData?.optionDetails?.strikeType === 'premium' && (
                <div className="space-y-2">
                  <Label htmlFor="strikeValue" className="text-sm font-medium">Strike Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="strikeValue"
                      type="number"
                      value={nodeData?.optionDetails?.strikeValue || ''}
                      onChange={handleStrikeValueChange}
                      className="pl-7 h-9"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Option Type</Label>
                <RadioGroup 
                  value={nodeData?.optionDetails?.optionType || 'CE'} 
                  onValueChange={handleOptionTypeChange}
                  className="flex"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="CE" id="ce" />
                    <Label htmlFor="ce" className="cursor-pointer">Call (CE)</Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-2 flex-1 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="PE" id="pe" />
                    <Label htmlFor="pe" className="cursor-pointer">Put (PE)</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
      
      {nodeData?.actionType === 'alert' && (
        <Card className="border bg-amber-50 dark:bg-amber-950/20 mt-4">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-medium">Alert Only</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This node will only send a notification without placing any order.
            </p>
          </CardContent>
        </Card>
      )}
      
      <Card className="border bg-muted/30 mt-4">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <span className="text-xs font-medium">Action Node Settings</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {nodeData?.actionType === 'entry' && 'This node will place an order to enter a new position.'}
            {nodeData?.actionType === 'exit' && 'This node will exit from an existing position.'}
            {nodeData?.actionType === 'alert' && 'This node will only send a notification without placing any order.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Action Type Button Component
interface ActionTypeButtonProps {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const ActionTypeButton: React.FC<ActionTypeButtonProps> = ({ 
  icon, 
  label, 
  selected, 
  onClick 
}) => {
  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      className={`h-auto py-2 px-3 flex flex-col items-center justify-center ${selected ? 'bg-primary/10 border-primary text-primary' : ''}`}
      onClick={onClick}
    >
      <span className="mb-1">{icon}</span>
      <span className="text-xs font-normal">{label}</span>
    </Button>
  );
};

export default ActionNodeEditor;
