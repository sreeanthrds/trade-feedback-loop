
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import OrderDetailsSection from '../OrderDetailsSection';
import InstrumentDisplay from '../InstrumentDisplay';
import OptionsSettingsSection from '../OptionsSettingsSection';

interface ActionTabsContainerProps {
  actionType?: string;
  positionType?: string;
  orderType?: string;
  limitPrice?: number;
  lots?: number;
  productType?: string;
  startNodeSymbol?: string;
  hasOptionTrading: boolean;
  optionDetails?: {
    expiry?: string;
    strikeType?: string;
    strikeValue?: number;
    optionType?: string;
  };
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

const ActionTabsContainer: React.FC<ActionTabsContainerProps> = ({
  actionType,
  positionType,
  orderType,
  limitPrice,
  lots,
  productType,
  startNodeSymbol,
  hasOptionTrading,
  optionDetails,
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
    <Tabs defaultValue="order-details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="order-details">Order Details</TabsTrigger>
        <TabsTrigger value="instrument-details">Instrument</TabsTrigger>
      </TabsList>
      
      <TabsContent value="order-details" className="space-y-4 py-2">
        <OrderDetailsSection 
          actionType={actionType}
          positionType={positionType}
          orderType={orderType}
          limitPrice={limitPrice}
          lots={lots}
          productType={productType}
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
              optionDetails={optionDetails}
              onExpiryChange={onExpiryChange}
              onStrikeTypeChange={onStrikeTypeChange}
              onStrikeValueChange={onStrikeValueChange}
              onOptionTypeChange={onOptionTypeChange}
            />
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ActionTabsContainer;
