
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExitOrderForm } from './useExitOrderForm';
import { Node } from '@xyflow/react';
import { RefreshCcw } from 'lucide-react';
import ExitConditionForm from './ExitConditionForm';
import ReEntryForm from './ReEntryForm';
import { Separator } from '@/components/ui/separator';
import SelectField from '../../shared/SelectField';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import SwitchField from '../../shared/SwitchField';

interface ExitOrderFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ExitOrderForm: React.FC<ExitOrderFormProps> = ({ node, updateNodeData }) => {
  const {
    exitConditionType,
    orderType,
    limitPrice,
    multipleOrders,
    exitCondition,
    handleExitConditionTypeChange,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleMultipleOrdersToggle,
    updateExitConditionField,
    // Re-entry related
    reEntryEnabled,
    handleReEntryToggle
  } = useExitOrderForm({ node, updateNodeData });

  return (
    <div className="space-y-4">
      <Tabs defaultValue="exit_condition" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="exit_condition">Condition</TabsTrigger>
          <TabsTrigger value="order_settings">Order</TabsTrigger>
          <TabsTrigger value="re_entry">Re-Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exit_condition" className="space-y-4 pt-4">
          <SelectField
            label="Exit Condition Type"
            id="exit-condition-type"
            value={exitConditionType}
            onChange={handleExitConditionTypeChange}
            options={[
              { value: 'vpi', label: 'By Virtual Position ID' },
              { value: 'vpt', label: 'By Virtual Position Tag' },
              { value: 'all_positions', label: 'All Open Positions' },
              { value: 'realized_pnl', label: 'Realized P&L' },
              { value: 'unrealized_pnl', label: 'Unrealized P&L (MTM)' },
              { value: 'premium_change', label: '% Change in Premium' },
              { value: 'position_value_change', label: '% Change in Position Value' },
              { value: 'price_target', label: 'Price Target' },
              { value: 'indicator_underlying', label: 'Indicator on Underlying' },
              { value: 'indicator_contract', label: 'Indicator on Contract' },
              { value: 'time_based', label: 'After Time Period' },
              { value: 'market_close', label: 'Before Market Close' },
              { value: 'limit_to_market', label: 'Limit to Market Fallback' },
              { value: 'rolling', label: 'Rolling to Next Expiry' }
            ]}
            description="Select the condition that will trigger this exit"
          />
          
          <Separator className="my-4" />
          
          <ExitConditionForm 
            exitCondition={exitCondition} 
            updateField={updateExitConditionField}
          />
        </TabsContent>
        
        <TabsContent value="order_settings" className="space-y-4 pt-4">
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
        </TabsContent>

        <TabsContent value="re_entry" className="space-y-4 pt-4">
          <ReEntryForm
            reEntryEnabled={reEntryEnabled}
            onReEntryToggle={handleReEntryToggle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExitOrderForm;
