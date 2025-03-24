
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import OrderDetailsSection from './OrderDetailsSection';
import InstrumentDisplay from './InstrumentDisplay';
import OptionsSettingsSection from './OptionsSettingsSection';
import { NodeData } from './types';

interface ActionTabsProps {
  nodeData: NodeData;
  showLimitPrice: boolean;
  hasOptionTrading: boolean;
  startNodeSymbol?: string;
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

const ActionTabs: React.FC<ActionTabsProps> = ({
  nodeData,
  showLimitPrice,
  hasOptionTrading,
  startNodeSymbol,
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
  );
};

export default ActionTabs;
