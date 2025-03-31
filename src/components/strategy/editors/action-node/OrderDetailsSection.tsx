
import React from 'react';
import { RadioGroupField, SelectField } from '../shared';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
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
  // Create wrapped handlers for the EnhancedNumberInput components
  const handleLimitPriceChange = (value: number | undefined) => {
    const simulatedEvent = {
      target: {
        value: value !== undefined ? value.toString() : '',
        id: 'limit-price',
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onLimitPriceChange(simulatedEvent);
  };
  
  const handleLotsChange = (value: number | undefined) => {
    const simulatedEvent = {
      target: {
        value: value !== undefined ? value.toString() : '',
        id: 'lots',
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onLotsChange(simulatedEvent);
  };

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
        <EnhancedNumberInput
          label="Limit Price"
          id="limit-price"
          value={position.limitPrice}
          onChange={handleLimitPriceChange}
          placeholder="Enter limit price"
          min={0.01}
          step={0.01}
        />
      )}
      
      <EnhancedNumberInput
        label="Quantity (Lots)"
        id="lots"
        value={position.lots}
        onChange={handleLotsChange}
        placeholder="Number of lots"
        min={1}
        step={1}
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
