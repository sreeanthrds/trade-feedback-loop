
import React from 'react';
import { Node } from '@xyflow/react';
import { Separator } from '@/components/ui/separator';
import SelectField from '../../shared/SelectField';
import SwitchField from '../../shared/SwitchField';
import { useExitOrderForm } from './useExitOrderForm';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';

interface ExitOrderFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

// Use React.memo to prevent unnecessary re-renders
const ExitOrderForm: React.FC<ExitOrderFormProps> = React.memo(({ node, updateNodeData }) => {
  const {
    orderType,
    limitPrice,
    multipleOrders,
    quantityType,
    quantityPercentage,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleMultipleOrdersToggle,
    handleQuantityTypeChange,
    handleQuantityPercentageChange
  } = useExitOrderForm({ 
    node, 
    updateNodeData 
  });

  // Create enhanced handlers for the number inputs
  const handleLimitPriceChangeEnhanced = (value: number | undefined) => {
    const simulatedEvent = {
      target: {
        value: value !== undefined ? value.toString() : '',
        id: 'exit-limit-price',
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleLimitPriceChange(simulatedEvent);
  };
  
  const handleQuantityPercentageChangeEnhanced = (value: number | undefined) => {
    const simulatedEvent = {
      target: {
        value: value !== undefined ? value.toString() : '',
        id: 'exit-quantity-percentage',
        type: 'number'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleQuantityPercentageChange(simulatedEvent);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Exit Order Configuration</h3>
        
        <Separator className="my-4" />
        
        <SwitchField
          label="Multiple Exit Orders"
          checked={multipleOrders}
          onCheckedChange={handleMultipleOrdersToggle}
          description="Enable to create multiple exit orders with different conditions"
        />
        
        <SelectField
          label="Order Type"
          id="exit-order-type"
          value={orderType}
          onChange={handleOrderTypeChange}
          options={[
            { value: 'market', label: 'Market Order' },
            { value: 'limit', label: 'Limit Order' }
          ]}
          description="Select the type of order to use for the exit"
        />
        
        {orderType === 'limit' && (
          <EnhancedNumberInput
            label="Limit Price"
            id="exit-limit-price"
            value={typeof limitPrice === 'string' ? parseFloat(limitPrice) : limitPrice}
            onChange={handleLimitPriceChangeEnhanced}
            min={0}
            step={0.05}
            description="Price at which the limit order will be placed"
          />
        )}
        
        <SelectField
          label="Quantity"
          id="exit-quantity-type"
          value={quantityType || 'all'}
          onChange={handleQuantityTypeChange}
          options={[
            { value: 'all', label: 'Exit All Quantity' },
            { value: 'partial', label: 'Exit Partial Quantity' }
          ]}
          description="Choose to exit all or partial position quantity"
        />
        
        {quantityType === 'partial' && (
          <EnhancedNumberInput
            label="Quantity Percentage"
            id="exit-quantity-percentage"
            value={typeof quantityPercentage === 'string' ? parseFloat(quantityPercentage) : quantityPercentage}
            onChange={handleQuantityPercentageChangeEnhanced}
            min={1}
            max={99}
            step={1}
            description="Percentage of position to exit (1-99%)"
          />
        )}
      </div>
    </div>
  );
});

// Add display name
ExitOrderForm.displayName = 'ExitOrderForm';

export default ExitOrderForm;
