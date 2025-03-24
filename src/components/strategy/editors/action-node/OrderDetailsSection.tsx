
import React from 'react';
import { RadioGroupField, SelectField, InputField } from '../shared';

interface OrderDetailsSectionProps {
  actionType?: 'entry' | 'exit' | 'alert';
  positionType?: 'buy' | 'sell';
  orderType?: 'market' | 'limit';
  limitPrice?: number;
  lots?: number;
  productType?: 'intraday' | 'carryForward';
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
  return (
    <div className="space-y-4 grid grid-cols-1 gap-4">
      {actionType === 'entry' && (
        <RadioGroupField
          label="Position Type"
          value={positionType || 'buy'}
          onChange={onPositionTypeChange}
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
        onChange={onOrderTypeChange}
        options={[
          { value: 'market', label: 'Market' },
          { value: 'limit', label: 'Limit' }
        ]}
        orientation="horizontal"
      />
      
      {orderType === 'limit' && (
        <InputField
          label="Limit Price"
          id="limit-price"
          type="number"
          value={limitPrice || ''}
          onChange={onLimitPriceChange}
          placeholder="Enter limit price"
          orientation="horizontal"
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
        orientation="horizontal"
      />
      
      <SelectField
        label="Product Type"
        id="product-type"
        value={productType || 'intraday'}
        onChange={onProductTypeChange}
        options={[
          { value: 'intraday', label: 'Intraday (MIS)' },
          { value: 'carryForward', label: 'Carry Forward (CNC)' }
        ]}
        orientation="horizontal"
      />
    </div>
  );
};

export default OrderDetailsSection;
