
import React from 'react';
import { useExitOrderForm } from './useExitOrderForm';
import { Node } from '@xyflow/react';
import { RefreshCcw } from 'lucide-react';
import SelectField from '../../shared/SelectField';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import SwitchField from '../../shared/SwitchField';
import { Separator } from '@/components/ui/separator';

interface ExitOrderFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ExitOrderForm: React.FC<ExitOrderFormProps> = ({ node, updateNodeData }) => {
  const {
    orderType,
    limitPrice,
    multipleOrders,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleMultipleOrdersToggle,
    // Re-entry related
    reEntryEnabled,
    handleReEntryToggle
  } = useExitOrderForm({ node, updateNodeData });

  return (
    <div className="space-y-4">
      <SwitchField
        label="Multiple Exit Orders"
        checked={multipleOrders}
        onCheckedChange={handleMultipleOrdersToggle}
        description="Enable to create multiple exit orders with different conditions"
      />
      
      <SelectField
        label="Order Type"
        id="order-type"
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
          id="limit-price"
          value={typeof limitPrice === 'string' ? parseFloat(limitPrice) : limitPrice}
          onChange={(value) => handleLimitPriceChange({ 
            target: { value: value?.toString() || '' } 
          } as React.ChangeEvent<HTMLInputElement>)}
          min={0}
          step={0.05}
          description="Price at which the limit order will be placed"
        />
      )}

      <Separator className="my-4" />
      
      <div className="flex items-center space-x-2 mb-2">
        <RefreshCcw size={16} className={reEntryEnabled ? "text-primary" : "text-muted-foreground"} />
        <h3 className="text-sm font-medium">Re-Entry Settings</h3>
      </div>
      
      <SwitchField
        label="Enable Re-Entry"
        checked={reEntryEnabled}
        onCheckedChange={handleReEntryToggle}
        description="Create a retry node to re-enter the market after exit"
      />
      
      {reEntryEnabled && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="text-muted-foreground">
            A Retry Node has been created and linked to this Exit Node. Configure the retry settings in the Retry Node's panel.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExitOrderForm;
