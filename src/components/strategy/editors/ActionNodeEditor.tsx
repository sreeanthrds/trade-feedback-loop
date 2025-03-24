
import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator'; 
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  CircleDollarSign,
  X
} from 'lucide-react';

interface ActionNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

interface NodeData {
  label?: string;
  actionType?: 'entry' | 'exit' | 'alert';
  positionType?: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  limitPrice?: number;
  lots?: number;
  productType?: 'intraday' | 'carryForward';
  instrument?: string;
  optionDetails?: {
    expiry?: string;
    strikeType?: 'ATM' | 'ITM' | 'OTM' | 'premium';
    strikeValue?: number;
    optionType?: 'CE' | 'PE';
  };
}

// Check if the start node has options trading enabled
const isOptionsSelected = (nodes: Node[], currentNodeId: string): boolean => {
  // Find the start node
  const startNode = nodes.find(node => node.type === 'startNode');
  if (!startNode || !startNode.data.tradingInstrument) return false;
  
  return startNode.data.tradingInstrument.type === 'options';
};

const ActionNodeEditor = ({ node, updateNodeData }: ActionNodeEditorProps) => {
  const nodeData = node.data as NodeData;
  const [showLimitPrice, setShowLimitPrice] = useState(nodeData.orderType === 'limit');
  const [hasOptionTrading, setHasOptionTrading] = useState(false);
  
  // Check for options trading when component mounts
  useEffect(() => {
    // This would typically be accessed from a context or from props
    // For now, we'll mock this check with a simple function
    const allNodes = []; // This should come from context/props
    const optionsEnabled = isOptionsSelected(allNodes, node.id);
    setHasOptionTrading(optionsEnabled);
    
    // For demo purposes, let's assume options are available
    setHasOptionTrading(true);
  }, [node.id]);
  
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
  
  const handleInstrumentChange = (value: string) => {
    updateNodeData(node.id, { instrument: value });
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

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-label">Node Label</Label>
        <Input
          id="node-label"
          value={nodeData?.label || ''}
          onChange={handleLabelChange}
          placeholder="Enter a name for this action"
        />
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <Label>Action Type</Label>
        <div className="grid grid-cols-3 gap-2">
          <div 
            className={`flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer transition-colors
              ${nodeData.actionType === 'entry' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
            onClick={() => handleActionTypeChange('entry')}
          >
            <ArrowUpCircle className="h-5 w-5 mb-1 text-success" />
            <span className="text-xs">Entry Order</span>
          </div>
          
          <div 
            className={`flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer transition-colors
              ${nodeData.actionType === 'exit' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
            onClick={() => handleActionTypeChange('exit')}
          >
            <X className="h-5 w-5 mb-1 text-warning" />
            <span className="text-xs">Exit Order</span>
          </div>
          
          <div 
            className={`flex flex-col items-center justify-center p-2 rounded-md border cursor-pointer transition-colors
              ${nodeData.actionType === 'alert' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
            onClick={() => handleActionTypeChange('alert')}
          >
            <AlertTriangle className="h-5 w-5 mb-1 text-amber-500" />
            <span className="text-xs">Alert Only</span>
          </div>
        </div>
      </div>
      
      {nodeData.actionType !== 'alert' && (
        <>
          <Separator />
          
          <Accordion type="single" collapsible defaultValue="order-details">
            <AccordionItem value="order-details">
              <AccordionTrigger className="text-sm font-medium py-2">
                Order Details
              </AccordionTrigger>
              <AccordionContent className="space-y-4 py-3">
                {nodeData.actionType === 'entry' && (
                  <div className="space-y-2">
                    <Label>Position Type</Label>
                    <RadioGroup 
                      defaultValue={nodeData.positionType || 'buy'}
                      onValueChange={handlePositionTypeChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buy" id="buy" />
                        <Label htmlFor="buy" className="cursor-pointer">Buy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sell" id="sell" />
                        <Label htmlFor="sell" className="cursor-pointer">Sell</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="order-type">Order Type</Label>
                  <Select
                    value={nodeData.orderType || 'market'}
                    onValueChange={handleOrderTypeChange}
                  >
                    <SelectTrigger id="order-type">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {showLimitPrice && (
                  <div className="space-y-2">
                    <Label htmlFor="limit-price">Limit Price</Label>
                    <Input
                      id="limit-price"
                      type="number"
                      value={nodeData.limitPrice || ''}
                      onChange={handleLimitPriceChange}
                      placeholder="Enter limit price"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="lots">Quantity (Lots)</Label>
                  <Input
                    id="lots"
                    type="number"
                    min="1"
                    value={nodeData.lots || 1}
                    onChange={handleLotsChange}
                    placeholder="Number of lots"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-type">Product Type</Label>
                  <Select
                    value={nodeData.productType || 'intraday'}
                    onValueChange={handleProductTypeChange}
                  >
                    <SelectTrigger id="product-type">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intraday">Intraday (MIS)</SelectItem>
                      <SelectItem value="carryForward">Carry Forward (CNC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="instrument-details">
              <AccordionTrigger className="text-sm font-medium py-2">
                Instrument Details
              </AccordionTrigger>
              <AccordionContent className="space-y-4 py-3">
                <div className="space-y-2">
                  <Label htmlFor="instrument">Instrument</Label>
                  <Select
                    value={nodeData.instrument || ''}
                    onValueChange={handleInstrumentChange}
                  >
                    <SelectTrigger id="instrument">
                      <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NIFTY50">NIFTY 50</SelectItem>
                      <SelectItem value="BANKNIFTY">BANK NIFTY</SelectItem>
                      <SelectItem value="FINNIFTY">FIN NIFTY</SelectItem>
                      <SelectItem value="MIDCPNIFTY">MIDCAP NIFTY</SelectItem>
                      <SelectItem value="SENSEX">SENSEX</SelectItem>
                      <SelectItem value="RELIANCE">Reliance Industries</SelectItem>
                      <SelectItem value="HDFCBANK">HDFC Bank</SelectItem>
                      <SelectItem value="TCS">TCS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {hasOptionTrading && (
              <AccordionItem value="option-details">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Options Settings
                </AccordionTrigger>
                <AccordionContent className="space-y-4 py-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Select
                      value={nodeData.optionDetails?.expiry || ''}
                      onValueChange={handleExpiryChange}
                    >
                      <SelectTrigger id="expiry">
                        <SelectValue placeholder="Select expiry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="W0">Current Week (W0)</SelectItem>
                        <SelectItem value="W1">Next Week (W1)</SelectItem>
                        <SelectItem value="M0">Current Month (M0)</SelectItem>
                        <SelectItem value="M1">Next Month (M1)</SelectItem>
                        <SelectItem value="Q0">Current Quarter (Q0)</SelectItem>
                        <SelectItem value="Q1">Next Quarter (Q1)</SelectItem>
                        <SelectItem value="Y0">Current Year (Y0)</SelectItem>
                        <SelectItem value="Y1">Next Year (Y1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="strike-type">Strike Selection</Label>
                    <Select
                      value={nodeData.optionDetails?.strikeType || ''}
                      onValueChange={handleStrikeTypeChange}
                    >
                      <SelectTrigger id="strike-type">
                        <SelectValue placeholder="Select strike type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ATM">At The Money (ATM)</SelectItem>
                        <SelectItem value="ITM">In The Money (ITM)</SelectItem>
                        <SelectItem value="OTM">Out The Money (OTM)</SelectItem>
                        <SelectItem value="premium">By Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {nodeData.optionDetails?.strikeType === 'premium' && (
                    <div className="space-y-2">
                      <Label htmlFor="premium-value">Target Premium (₹)</Label>
                      <Input
                        id="premium-value"
                        type="number"
                        min="1"
                        value={nodeData.optionDetails?.strikeValue || ''}
                        onChange={handleStrikeValueChange}
                        placeholder="Enter target premium"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Option Type</Label>
                    <RadioGroup 
                      defaultValue={nodeData.optionDetails?.optionType || 'CE'}
                      onValueChange={handleOptionTypeChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="CE" id="ce" />
                        <Label htmlFor="ce" className="cursor-pointer">Call (CE)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="PE" id="pe" />
                        <Label htmlFor="pe" className="cursor-pointer">Put (PE)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </>
      )}
      
      {nodeData.actionType === 'alert' && (
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-md p-4 mt-3">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 shrink-0" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Alert Settings
            </span>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            This node will only generate an alert notification without placing any order.
          </p>
        </div>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mt-3">
        <p className="text-sm text-foreground/70">
          {nodeData.actionType === 'entry' 
            ? "Entry orders open new positions based on the configured settings."
            : nodeData.actionType === 'exit'
            ? "Exit orders close existing positions from previous entry nodes."
            : "Alerts notify you when conditions are met without executing trades."}
        </p>
      </div>
    </div>
  );
};

export default ActionNodeEditor;
