
import React from 'react';
import { NodeData } from './types';
import ActionTypeSelector from './ActionTypeSelector';
import AlertMessage from './AlertMessage';
import { Separator } from '@/components/ui/separator';
import OrderDetailsPanel from './components/OrderDetailsPanel';
import InstrumentPanel from './components/InstrumentPanel';
import OptionsSettingsPanel from './components/OptionsSettingsPanel';

interface ActionNodeContentProps {
  nodeData: NodeData;
  showLimitPrice: boolean;
  hasOptionTrading: boolean;
  startNodeSymbol?: string;
  onActionTypeChange: (value: string) => void;
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

const ActionNodeContent: React.FC<ActionNodeContentProps> = ({
  nodeData,
  showLimitPrice,
  hasOptionTrading,
  startNodeSymbol,
  onActionTypeChange,
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
  if (!nodeData) {
    return <div>Loading node data...</div>;
  }

  if (nodeData.actionType === 'alert') {
    return (
      <div className="space-y-4">
        <ActionTypeSelector 
          actionType={nodeData.actionType}
          onActionTypeChange={onActionTypeChange}
        />
        <AlertMessage />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ActionTypeSelector 
        actionType={nodeData.actionType}
        onActionTypeChange={onActionTypeChange}
      />
      
      <Separator />
      
      <div className="space-y-6">
        <OrderDetailsPanel 
          actionType={nodeData.actionType}
          positionType={nodeData.positionType}
          orderType={nodeData.orderType}
          limitPrice={nodeData.limitPrice}
          lots={nodeData.lots}
          productType={nodeData.productType}
          onPositionTypeChange={onPositionTypeChange}
          onOrderTypeChange={onOrderTypeChange}
          onLimitPriceChange={onLimitPriceChange}
          onLotsChange={onLotsChange}
          onProductTypeChange={onProductTypeChange}
        />
        
        <Separator className="my-4" />
        
        <InstrumentPanel startNodeSymbol={startNodeSymbol} />
        
        {hasOptionTrading && (
          <OptionsSettingsPanel 
            optionDetails={nodeData.optionDetails}
            onExpiryChange={onExpiryChange}
            onStrikeTypeChange={onStrikeTypeChange}
            onStrikeValueChange={onStrikeValueChange}
            onOptionTypeChange={onOptionTypeChange}
          />
        )}
      </div>
    </div>
  );
};

export default ActionNodeContent;
