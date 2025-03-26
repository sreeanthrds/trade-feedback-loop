
import React from 'react';
import { Separator } from '@/components/ui/separator';
import ActionTypeSelector from '../ActionTypeSelector';
import AlertMessage from '../AlertMessage';
import ActionTabsContainer from './ActionTabsContainer';
import { NodeData } from '../types';

interface ActionContentProps {
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

const ActionContent: React.FC<ActionContentProps> = ({
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
      
      <ActionTabsContainer 
        actionType={nodeData.actionType}
        positionType={nodeData.positionType}
        orderType={nodeData.orderType}
        limitPrice={nodeData.limitPrice}
        lots={nodeData.lots}
        productType={nodeData.productType}
        startNodeSymbol={startNodeSymbol}
        hasOptionTrading={hasOptionTrading}
        optionDetails={nodeData.optionDetails}
        onPositionTypeChange={onPositionTypeChange}
        onOrderTypeChange={onOrderTypeChange}
        onLimitPriceChange={onLimitPriceChange}
        onLotsChange={onLotsChange}
        onProductTypeChange={onProductTypeChange}
        onExpiryChange={onExpiryChange}
        onStrikeTypeChange={onStrikeTypeChange}
        onStrikeValueChange={onStrikeValueChange}
        onOptionTypeChange={onOptionTypeChange}
      />
    </div>
  );
};

export default ActionContent;
