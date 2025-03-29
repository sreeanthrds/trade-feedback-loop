
import React from 'react';
import { Position } from '../types';
import { InputField, RadioGroupField, SelectField } from '../../shared';
import OptionsSettingsPanel from './OptionsSettingsPanel';

interface PositionEditorProps {
  position: Position;
  hasOptionTrading: boolean;
  onPositionChange: (id: string, updates: Partial<Position>) => void;
}

const PositionEditor: React.FC<PositionEditorProps> = ({
  position,
  hasOptionTrading,
  onPositionChange
}) => {
  const handleVpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPositionChange(position.id, { vpi: e.target.value });
  };

  const handleVptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPositionChange(position.id, { vpt: e.target.value });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priority = parseInt(e.target.value);
    if (!isNaN(priority) && priority > 0) {
      onPositionChange(position.id, { priority });
    }
  };

  const handlePositionTypeChange = (value: string) => {
    onPositionChange(position.id, { positionType: value as 'buy' | 'sell' });
  };

  const handleOrderTypeChange = (value: string) => {
    onPositionChange(position.id, { 
      orderType: value as 'market' | 'limit',
      ...(value === 'market' && { limitPrice: undefined })
    });
  };

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseFloat(e.target.value);
    if (value === '' || !isNaN(value)) {
      onPositionChange(position.id, { limitPrice: value as number });
    }
  };

  const handleLotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onPositionChange(position.id, { lots: value });
    }
  };

  const handleProductTypeChange = (value: string) => {
    onPositionChange(position.id, { productType: value as 'intraday' | 'carryForward' });
  };

  const handleExpiryChange = (value: string) => {
    onPositionChange(position.id, { 
      optionDetails: {
        ...position.optionDetails,
        expiry: value
      }
    });
  };

  const handleStrikeTypeChange = (value: string) => {
    // Ensure value is one of the allowed strikeType values
    const validatedValue = value as Position['optionDetails']['strikeType'];
    onPositionChange(position.id, { 
      optionDetails: {
        ...position.optionDetails,
        strikeType: validatedValue
      }
    });
  };

  const handleStrikeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
    onPositionChange(position.id, { 
      optionDetails: {
        ...position.optionDetails,
        strikeValue: value
      }
    });
  };

  const handleOptionTypeChange = (value: string) => {
    // Ensure value is one of the allowed optionType values
    const validatedValue = value as 'CE' | 'PE';
    onPositionChange(position.id, { 
      optionDetails: {
        ...position.optionDetails,
        optionType: validatedValue
      }
    });
  };

  // Display limit price input conditionally
  const showLimitPrice = position.orderType === 'limit';

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Position Details</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="VPI (Virtual Position ID)"
          id="vpi"
          value={position.vpi || ''}
          onChange={handleVpiChange}
          placeholder="Enter unique position ID"
          description="Unique identifier across strategy"
        />
        
        <InputField
          label="VPT (Virtual Position Tag)"
          id="vpt"
          value={position.vpt || ''}
          onChange={handleVptChange}
          placeholder="Enter position tag"
          description="Group related positions"
        />
      </div>
      
      <InputField
        label="Priority"
        id="priority"
        type="number"
        min={1}
        value={position.priority}
        onChange={handlePriorityChange}
        placeholder="Execution priority"
        description="Lower numbers execute first"
      />
      
      <RadioGroupField
        label="Position Type"
        value={position.positionType || 'buy'}
        onChange={handlePositionTypeChange}
        options={[
          { value: 'buy', label: 'Buy' },
          { value: 'sell', label: 'Sell' }
        ]}
        layout="horizontal"
      />
      
      <SelectField
        label="Order Type"
        id="order-type"
        value={position.orderType || 'market'}
        onChange={handleOrderTypeChange}
        options={[
          { value: 'market', label: 'Market' },
          { value: 'limit', label: 'Limit' }
        ]}
      />
      
      {showLimitPrice && (
        <InputField
          label="Limit Price"
          id="limit-price"
          type="number"
          value={position.limitPrice === undefined ? '' : position.limitPrice}
          onChange={handleLimitPriceChange}
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
        onChange={handleLotsChange}
        placeholder="Number of lots"
      />
      
      <SelectField
        label="Product Type"
        id="product-type"
        value={position.productType || 'intraday'}
        onChange={handleProductTypeChange}
        options={[
          { value: 'intraday', label: 'Intraday (MIS)' },
          { value: 'carryForward', label: 'Carry Forward (CNC)' }
        ]}
      />
      
      {hasOptionTrading && (
        <OptionsSettingsPanel 
          hasOptionTrading={hasOptionTrading}
          position={position}
          onExpiryChange={handleExpiryChange}
          onStrikeTypeChange={handleStrikeTypeChange}
          onStrikeValueChange={handleStrikeValueChange}
          onOptionTypeChange={handleOptionTypeChange}
        />
      )}
    </div>
  );
};

export default PositionEditor;
