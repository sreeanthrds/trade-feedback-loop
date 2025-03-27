
import React from 'react';
import { RadioGroupField, SelectField, InputField } from '../shared';
import { NodeData } from './types';

type ActionType = NodeData['actionType'];
type PositionType = NodeData['positionType'];
type OrderType = NodeData['orderType'];
type ProductType = NodeData['productType'];

interface OrderDetailsSectionProps {
  actionType?: ActionType;
  positionType?: PositionType;
  orderType?: OrderType;
  limitPrice?: number;
  lots?: number;
  productType?: ProductType;
  onPositionTypeChange: (value: string) => void;
  onOrderTypeChange: (value: string) => void;
  onLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLotsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductTypeChange: (value: string) => void;
}

const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  actionType,
  positionType,
  orderType,
  limitPrice,
  lots,
  productType,
  onPositionTypeChange,
  onOrderTypeChange,
  onLimitPriceChange,
  onLotsChange,
  onProductTypeChange
}) => {
  // Handle position type change
  const handlePositionTypeChange = (value: string) => {
    onPositionTypeChange(value);
  };

  // Handle order type change
  const handleOrderTypeChange = (value: string) => {
    onOrderTypeChange(value);
  };

  // Handle product type change
  const handleProductTypeChange = (value: string) => {
    onProductTypeChange(value);
  };

  return (
    <div className="space-y-4">
      {actionType === 'entry' && (
        <RadioGroupField
          label="Position Type"
          value={positionType || 'buy'}
          onChange={handlePositionTypeChange}
          options={[
            { value: 'buy', label: 'Buy' },
            { value: 'sell', label: 'Sell' }
          ]}
          layout="horizontal"
        />
      )}
      
      <SelectField
        label="Order Type"
        id="order-type"
        value={orderType || 'market'}
        onChange={handleOrderTypeChange}
        options={[
          { value: 'market', label: 'Market' },
          { value: 'limit', label: 'Limit' }
        ]}
      />
      
      {orderType === 'limit' && (
        <InputField
          label="Limit Price"
          id="limit-price"
          type="number"
          value={limitPrice === undefined ? '' : limitPrice}
          onChange={onLimitPriceChange}
          placeholder="Enter limit price"
          min={0.01}
          step={0.01}
        />
      )}
      
      <InputField
        label="Quantity (Lots)"
        id="lots"
        type="number"
        min={1}
        value={lots || 1}
        onChange={onLotsChange}
        placeholder="Number of lots"
      />
      
      <SelectField
        label="Product Type"
        id="product-type"
        value={productType || 'intraday'}
        onChange={handleProductTypeChange}
        options={[
          { value: 'intraday', label: 'Intraday (MIS)' },
          { value: 'carryForward', label: 'Carry Forward (CNC)' }
        ]}
      />
    </div>
  );
};

export default OrderDetailsSection;
