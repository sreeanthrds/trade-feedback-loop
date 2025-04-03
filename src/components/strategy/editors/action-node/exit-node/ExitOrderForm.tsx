
import React from 'react';
import { Node } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { useExitOrderForm } from './useExitOrderForm';
import { ExitConditionType } from './types';
import { ExitConditionOptions } from './ExitConditionOptions';
import ExitConditionForm from './ExitConditionForm';
import { OrderTypeOptions } from './OrderTypeOptions';
import { ReEntryToggle } from './ReEntryToggle';

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
    // Re-entry config
    reEntryEnabled,
    handleReEntryToggle
  } = useExitOrderForm({ node, updateNodeData });
  
  return (
    <div className="space-y-4">
      {/* Exit Condition Section */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Exit Condition</h3>
            
            {/* Re-entry toggle - now in exit condition section */}
            <ReEntryToggle 
              enabled={reEntryEnabled}
              onToggle={handleReEntryToggle}
            />
            
            <ExitConditionOptions
              value={exitConditionType as ExitConditionType}
              onChange={handleExitConditionTypeChange}
            />
            
            <ExitConditionForm
              exitCondition={exitCondition}
              updateField={updateExitConditionField}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Order Type Section */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Order Settings</h3>
            
            <OrderTypeOptions
              orderType={orderType}
              limitPrice={limitPrice}
              onChange={handleOrderTypeChange}
              onLimitPriceChange={handleLimitPriceChange}
              multipleOrders={multipleOrders}
              onMultipleOrdersToggle={handleMultipleOrdersToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExitOrderForm;
