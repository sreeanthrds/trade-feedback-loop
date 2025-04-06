
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExitOrderForm } from './useExitOrderForm';
import { Node } from '@xyflow/react';
import ReEntryForm from './ReEntryForm';
import SelectField from '../../shared/SelectField';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import SwitchField from '../../shared/SwitchField';

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

  const [activeTab, setActiveTab] = useState('order_settings');

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue={activeTab}
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="order_settings">Order</TabsTrigger>
          <TabsTrigger value="re_entry">Re-Entry</TabsTrigger>
        </TabsList>
        
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
