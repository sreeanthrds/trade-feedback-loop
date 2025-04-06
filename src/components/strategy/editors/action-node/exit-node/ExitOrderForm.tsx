
import React from 'react';
import { useExitOrderForm } from './useExitOrderForm';
import { Node } from '@xyflow/react';
import { RefreshCcw, CircleDollarSign } from 'lucide-react';
import SelectField from '../../shared/SelectField';
import { EnhancedNumberInput } from '@/components/ui/form/enhanced';
import SwitchField from '../../shared/SwitchField';
import { Separator } from '@/components/ui/separator';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { RadioGroupField } from '../../shared';

interface ExitOrderFormProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ExitOrderForm: React.FC<ExitOrderFormProps> = ({ node, updateNodeData }) => {
  const {
    orderType,
    limitPrice,
    targetPositionId,
    quantity,
    partialQuantityPercentage,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleTargetPositionChange,
    handleQuantityTypeChange,
    handlePartialQuantityChange,
    // Re-entry related
    reEntryEnabled,
    handleReEntryToggle
  } = useExitOrderForm({ node, updateNodeData });
  
  // Get all available positions from entry nodes
  const nodes = useStrategyStore(state => state.nodes);
  const positions = React.useMemo(() => {
    const allPositions: any[] = [];
    
    nodes.forEach(n => {
      if (n.type === 'entryNode' && Array.isArray(n.data.positions)) {
        n.data.positions.forEach((position: any) => {
          if (position.id && position.vpi) {
            allPositions.push({
              id: position.id,
              vpi: position.vpi,
              positionType: position.positionType,
              nodeId: n.id
            });
          }
        });
      }
    });
    
    return allPositions;
  }, [nodes]);
  
  // Format positions for the select field
  const positionOptions = React.useMemo(() => {
    return [
      { value: '_any', label: 'Any position (first found)' },
      ...positions.map(pos => ({
        value: pos.id,
        label: `${pos.vpi} (${pos.positionType === 'buy' ? 'Buy' : 'Sell'})`
      }))
    ];
  }, [positions]);

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 border rounded-md p-3">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
          <CircleDollarSign size={16} className="text-primary" />
          Exit Order Settings
        </h3>
        
        <SelectField
          label="Position to Exit"
          id="target-position"
          value={targetPositionId || '_any'}
          onChange={handleTargetPositionChange}
          options={positionOptions}
          description="Select which position to exit"
        />
        
        <div className="mt-3">
          <RadioGroupField
            label="Quantity"
            value={quantity || 'all'}
            onChange={handleQuantityTypeChange}
            options={[
              { value: 'all', label: 'Exit all' },
              { value: 'partial', label: 'Partial exit' }
            ]}
            layout="horizontal"
          />
        </div>
        
        {quantity === 'partial' && (
          <EnhancedNumberInput
            label="Percentage to Exit"
            id="partial-percentage"
            value={typeof partialQuantityPercentage === 'number' ? partialQuantityPercentage : 50}
            onChange={(value) => handlePartialQuantityChange(value || 50)}
            min={1}
            max={99}
            step={1}
            description="Percentage of the position to exit"
            suffix="%"
          />
        )}
        
        <div className="mt-3">
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
        </div>
        
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
      </div>

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
