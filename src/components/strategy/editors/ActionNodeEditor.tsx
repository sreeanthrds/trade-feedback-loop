import React, { useEffect, useState, useRef } from 'react';
import { Node, useReactFlow } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import our new modular components
import ActionTypeSelector from './action-node/ActionTypeSelector';
import OrderDetailsSection from './action-node/OrderDetailsSection';
import InstrumentDisplay from './action-node/InstrumentDisplay';
import OptionsSettingsSection from './action-node/OptionsSettingsSection';
import AlertMessage from './action-node/AlertMessage';
import InfoMessage from './action-node/InfoMessage';
import { NodeData, StartNodeData } from './action-node/types';

interface ActionNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ActionNodeEditor = ({ node, updateNodeData }: ActionNodeEditorProps) => {
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
  }, [getNodes, node.id, updateNodeData]); // Remove startNodeSymbol from dependencies
  
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
      
      <ActionTypeSelector 
        actionType={nodeData.actionType}
        onActionTypeChange={handleActionTypeChange}
      />
      
      {nodeData.actionType !== 'alert' && (
        <>
          <Separator />
          
          <Accordion type="single" collapsible defaultValue="order-details">
            <AccordionItem value="order-details">
              <AccordionTrigger className="text-sm font-medium py-2">
                Order Details
              </AccordionTrigger>
              <AccordionContent className="space-y-4 py-3">
                <OrderDetailsSection 
                  actionType={nodeData.actionType}
                  positionType={nodeData.positionType}
                  orderType={nodeData.orderType}
                  limitPrice={nodeData.limitPrice}
                  lots={nodeData.lots}
                  productType={nodeData.productType}
                  onPositionTypeChange={handlePositionTypeChange}
                  onOrderTypeChange={handleOrderTypeChange}
                  onLimitPriceChange={handleLimitPriceChange}
                  onLotsChange={handleLotsChange}
                  onProductTypeChange={handleProductTypeChange}
                />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="instrument-details">
              <AccordionTrigger className="text-sm font-medium py-2">
                Instrument Details
              </AccordionTrigger>
              <AccordionContent className="space-y-4 py-3">
                <InstrumentDisplay startNodeSymbol={startNodeSymbol} />
              </AccordionContent>
            </AccordionItem>
            
            {hasOptionTrading && (
              <AccordionItem value="option-details">
                <AccordionTrigger className="text-sm font-medium py-2">
                  Options Settings
                </AccordionTrigger>
                <AccordionContent className="space-y-4 py-3">
                  <OptionsSettingsSection 
                    optionDetails={nodeData.optionDetails}
                    onExpiryChange={handleExpiryChange}
                    onStrikeTypeChange={handleStrikeTypeChange}
                    onStrikeValueChange={handleStrikeValueChange}
                    onOptionTypeChange={handleOptionTypeChange}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </>
      )}
      
      {nodeData.actionType === 'alert' && <AlertMessage />}
      
      <InfoMessage actionType={nodeData.actionType} />
    </div>
  );
};

export default ActionNodeEditor;
