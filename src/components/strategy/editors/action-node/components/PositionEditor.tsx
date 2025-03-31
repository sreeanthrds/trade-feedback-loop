
import React from 'react';
import { Position } from '../types';
import { InputField, RadioGroupField, SelectField } from '../../shared';
import OptionsSettingsPanel from './OptionsSettingsPanel';
import { Separator } from '@/components/ui/separator';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';

interface PositionEditorProps {
  position: Position;
  hasOptionTrading: boolean;
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
  
  const handleStrikeValueChange = (value: number | undefined) => {
    const simulatedEvent = {
      target: {
        value: value !== undefined ? value.toString() : '',
        id: 'strike-value',
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onStrikeValueChange(simulatedEvent);
  };

  // Display limit price input conditionally
  const showLimitPrice = position.orderType === 'limit';

  return (
    <div className="space-y-3 border rounded-md border-primary/30 bg-accent/20">
      <div className="flex justify-between items-center p-3">
        <h3 className="text-sm font-medium">Position Details</h3>
        <div className="text-xs text-muted-foreground">
          Editing position P{position.priority}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3 px-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        
        <EnhancedNumberInput
          label="Priority"
          id="priority"
          min={1}
          value={position.priority}
          onChange={handlePriorityChange}
          placeholder="Execution priority"
          description="Lower numbers execute first"
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
        
        {showLimitPrice && (
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
          min={1}
          value={position.lots}
          onChange={handleLotsChange}
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
      <div className="h-3"></div>
    </div>
  );
};

export default PositionEditor;
