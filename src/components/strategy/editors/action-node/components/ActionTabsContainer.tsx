
import React from 'react';
import { Separator } from '@/components/ui/separator';
import OrderDetailsPanel from './OrderDetailsPanel';
import InstrumentPanel from './InstrumentPanel';
import OptionsSettingsPanel from './OptionsSettingsPanel';
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
      <OrderDetailsPanel 
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
      
      <Separator className="my-4" />
      
      <InstrumentPanel startNodeSymbol={startNodeSymbol} />
      
      <OptionsSettingsPanel 
        hasOptionTrading={hasOptionTrading}
        optionDetails={optionDetails}
        onExpiryChange={onExpiryChange}
        onStrikeTypeChange={onStrikeTypeChange}
        onStrikeValueChange={onStrikeValueChange}
        onOptionTypeChange={onOptionTypeChange}
      />
    </div>
  );
};

export default ActionTabsContainer;
