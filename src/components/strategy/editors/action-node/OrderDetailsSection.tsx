
import React from 'react';
import { RadioGroupField, SelectField, InputField } from '../shared';
import { Position } from './types';

interface OrderDetailsSectionProps {
  actionType?: 'entry' | 'exit' | 'alert';
  position: Position;
  onPositionTypeChange: (value: string) => void;
  onOrderTypeChange: (value: string) => void;
  onLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLotsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductTypeChange: (value: string) => void;
}

const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  actionType,
  position,
  onPositionTypeChange,
  onOrderTypeChange,
  onLimitPriceChange,
  onLotsChange,
  onProductTypeChange
}) => {
  return (
    <div className="space-y-4">
      {actionType === 'entry' && (
        <RadioGroupField
          label="Position Type"
          value={position.positionType || 'buy'}
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
        value={position.orderType || 'market'}
        onChange={onOrderTypeChange}
        options={[
          { value: 'market', label: 'Market' },
          { value: 'limit', label: 'Limit' }
        ]}
      />
      
      {position.orderType === 'limit' && (
        <InputField
          label="Limit Price"
          id="limit-price"
          type="number"
          value={position.limitPrice === undefined ? '' : position.limitPrice}
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
        value={position.lots || 1}
        onChange={onLotsChange}
        placeholder="Number of lots"
      />
      
      <SelectField
        label="Product Type"
        id="product-type"
        value={position.productType || 'intraday'}
        onChange={onProductTypeChange}
        options={[
          { value: 'intraday', label: 'Intraday (MIS)' },
          { value: 'carryForward', label: 'Carry Forward (CNC)' }
        ]}
      />
    </div>
  );
};

export default OrderDetailsSection;
