
import React from 'react';
import { Separator } from '@/components/ui/separator';
import OrderDetailsSection from '../OrderDetailsSection';
import InstrumentDisplay from '../InstrumentDisplay';
import OptionsSettingsSection from '../OptionsSettingsSection';
import { NodeData } from '../types';

type ActionType = NodeData['actionType'];
type PositionType = NodeData['positionType'];
type OrderType = NodeData['orderType'];
type ProductType = NodeData['productType'];
type OptionDetailsType = NodeData['optionDetails'];

interface ActionTabsContainerProps {
  actionType?: ActionType;
  positionType?: PositionType;
  orderType?: OrderType;
  limitPrice?: number;
  lots?: number;
  productType?: ProductType;
  startNodeSymbol?: string;
  hasOptionTrading: boolean;
  optionDetails?: OptionDetailsType;
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
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Order Details</h3>
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
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Instrument</h3>
        <InstrumentDisplay startNodeSymbol={startNodeSymbol} />
        
        {hasOptionTrading && (
          <>
            <Separator className="my-4" />
            <h3 className="text-sm font-medium">Options Settings</h3>
            <OptionsSettingsSection 
              optionDetails={optionDetails}
              onExpiryChange={onExpiryChange}
              onStrikeTypeChange={onStrikeTypeChange}
              onStrikeValueChange={onStrikeValueChange}
              onOptionTypeChange={onOptionTypeChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ActionTabsContainer;
