
import React from 'react';
import { Node } from '@xyflow/react';
import { Separator } from '@/components/ui/separator';
import SelectField from '../../shared/SelectField';
import InputField from '../../shared/InputField';
import SwitchField from '../../shared/SwitchField';
import { useExitOrderForm } from './useExitOrderForm';

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
          value={orderType}
          onChange={handleOrderTypeChange}
          options={[
            { value: 'market', label: 'Market Order' },
            { value: 'limit', label: 'Limit Order' }
          ]}
          description="Select the type of order to use for the exit"
        />
        
        {orderType === 'limit' && (
          <InputField
            label="Limit Price"
            type="number"
            value={limitPrice === undefined ? '' : limitPrice}
            onChange={handleLimitPriceChange}
            min={0}
            step={0.05}
            description="Price at which the limit order will be placed"
          />
        )}
        
        <SelectField
          label="Quantity"
          value={quantityType || 'all'}
          onChange={handleQuantityTypeChange}
          options={[
            { value: 'all', label: 'Exit All Quantity' },
            { value: 'partial', label: 'Exit Partial Quantity' }
          ]}
          description="Choose to exit all or partial position quantity"
        />
        
        {quantityType === 'partial' && (
          <InputField
            label="Quantity Percentage"
            type="number"
            value={quantityPercentage === undefined ? '' : quantityPercentage}
            onChange={handleQuantityPercentageChange}
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
