
import React from 'react';
import { Separator } from '@/components/ui/separator';
import ActionTypeSelector from './ActionTypeSelector';
import AlertMessage from './AlertMessage';
import InfoMessage from './InfoMessage';
import { NodeData } from './types';
import OrderDetailsSection from './OrderDetailsSection';
import InstrumentDisplay from './InstrumentDisplay';
import OptionsSettingsSection from './OptionsSettingsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  if (nodeData.actionType === 'alert') {
    return (
      <div className="space-y-4">
        <ActionTypeSelector 
          actionType={nodeData.actionType}
          onActionTypeChange={onActionTypeChange}
        />
        <AlertMessage />
        <InfoMessage actionType={nodeData.actionType} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ActionTypeSelector 
        actionType={nodeData.actionType}
        onActionTypeChange={onActionTypeChange}
      />
      
      <Separator />
      
      <Tabs defaultValue="order-details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="order-details">Order Details</TabsTrigger>
          <TabsTrigger value="instrument-details">Instrument</TabsTrigger>
        </TabsList>
        
        <TabsContent value="order-details" className="space-y-4 py-2">
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
        </TabsContent>
        
        <TabsContent value="instrument-details" className="space-y-4 py-2">
          <InstrumentDisplay startNodeSymbol={startNodeSymbol} />
          
          {hasOptionTrading && (
            <>
              <Separator className="my-4" />
              <OptionsSettingsSection 
                optionDetails={nodeData.optionDetails}
                onExpiryChange={onExpiryChange}
                onStrikeTypeChange={onStrikeTypeChange}
                onStrikeValueChange={onStrikeValueChange}
                onOptionTypeChange={onOptionTypeChange}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
      
      <InfoMessage actionType={nodeData.actionType} />
    </div>
  );
};

export default ActionNodeContent;
