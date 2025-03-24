
import React from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ActionTypeSelector from './ActionTypeSelector';
import OrderDetailsSection from './OrderDetailsSection';
import InstrumentDisplay from './InstrumentDisplay';
import OptionsSettingsSection from './OptionsSettingsSection';
import AlertMessage from './AlertMessage';
import InfoMessage from './InfoMessage';
import { NodeData } from './types';

interface ActionNodeContentProps {
  nodeData: NodeData;
  showLimitPrice: boolean;
  hasOptionTrading: boolean;
  startNodeSymbol?: string;
  onActionTypeChange: (value: string) => void;
  onPositionTypeChange: (value: string) => void;
  onOrderTypeChange: (value: string) => void;
  onLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLotsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductTypeChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const ActionNodeContent: React.FC<ActionNodeContentProps> = ({
  nodeData,
  showLimitPrice,
  hasOptionTrading,
  startNodeSymbol,
  onActionTypeChange,
  onPositionTypeChange,
  onOrderTypeChange,
  onLimitPriceChange,
  onLotsChange,
  onProductTypeChange,
  onExpiryChange,
  onStrikeTypeChange,
  onStrikeValueChange,
  onOptionTypeChange
}) => {
  return (
    <div className="space-y-4">
      <ActionTypeSelector 
        actionType={nodeData.actionType}
        onActionTypeChange={onActionTypeChange}
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
                  onPositionTypeChange={onPositionTypeChange}
                  onOrderTypeChange={onOrderTypeChange}
                  onLimitPriceChange={onLimitPriceChange}
                  onLotsChange={onLotsChange}
                  onProductTypeChange={onProductTypeChange}
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
                    onExpiryChange={onExpiryChange}
                    onStrikeTypeChange={onStrikeTypeChange}
                    onStrikeValueChange={onStrikeValueChange}
                    onOptionTypeChange={onOptionTypeChange}
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

export default ActionNodeContent;
