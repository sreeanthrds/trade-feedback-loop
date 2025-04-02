
import React from 'react';
import { Position } from '../types';
import { InputField, RadioGroupField, SelectField } from '../../shared';
import OptionsSettingsPanel from './OptionsSettingsPanel';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';

interface PositionEditorProps {
  position: Position;
  hasOptionTrading: boolean;
  isEntryNode?: boolean;
  onPositionChange: (updates: Partial<Position>) => void;
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

const PositionEditor: React.FC<PositionEditorProps> = ({
  position,
  hasOptionTrading,
  isEntryNode = false,
  onPositionChange,
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
  const handleVpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPositionChange({ vpi: e.target.value });
  };

  const handleVptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPositionChange({ vpt: e.target.value });
  };

  const handlePriorityChange = (value: number | undefined) => {
    onPositionChange({ priority: value });
  };

  // Create wrapped handlers for the EnhancedNumberInput components
  const handleLimitPriceChange = (value: number | undefined) => {
    const simulatedEvent = {
      target: {
        value: value !== undefined ? String(value) : '',
        id: 'limit-price',
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onLimitPriceChange(simulatedEvent);
  };
  
  const handleLotsChange = (value: number | undefined) => {
    const simulatedEvent = {
      target: {
        value: value !== undefined ? String(value) : '',
        id: 'lots',
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onLotsChange(simulatedEvent);
  };
  
  const handleStrikeValueChange = (value: number | undefined) => {
    const simulatedEvent = {
      target: {
        value: value !== undefined ? String(value) : '',
        id: 'strike-value',
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onStrikeValueChange(simulatedEvent);
  };

  // Display limit price input conditionally
  const showLimitPrice = position.orderType === 'limit';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <InputField
          label="VPI"
          id="vpi"
          value={position.vpi || ''}
          onChange={handleVpiChange}
          placeholder="Position ID"
          readOnly={true} // Always read-only
          description="Virtual Position ID (read-only)"
        />
        
        <InputField
          label="VPT"
          id="vpt"
          value={position.vpt || ''}
          onChange={handleVptChange}
          placeholder="Position tag"
          readOnly={!isEntryNode} // Read-only except in entry nodes
          description={isEntryNode ? "Virtual Position Tag" : "Virtual Position Tag (read-only)"}
        />
      </div>
      
      <EnhancedNumberInput
        label="Priority"
        id="priority"
        min={1}
        value={position.priority}
        onChange={handlePriorityChange}
        placeholder="Priority"
      />
      
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
      
      <div className="grid grid-cols-2 gap-2">
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
        
        <EnhancedNumberInput
          label="Quantity (Lots)"
          id="lots"
          min={1}
          value={position.lots}
          onChange={handleLotsChange}
          placeholder="Lots"
        />
      </div>
      
      {showLimitPrice && (
        <EnhancedNumberInput
          label="Limit Price"
          id="limit-price"
          value={position.limitPrice}
          onChange={handleLimitPriceChange}
          placeholder="Limit price"
          min={0.01}
          step={0.01}
        />
      )}
      
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
      
      {hasOptionTrading && (
        <OptionsSettingsPanel 
          position={position}
          hasOptionTrading={hasOptionTrading}
          onExpiryChange={onExpiryChange}
          onStrikeTypeChange={onStrikeTypeChange}
          onStrikeValueChange={onStrikeValueChange}
          onOptionTypeChange={onOptionTypeChange}
        />
      )}
    </div>
  );
};

export default PositionEditor;
