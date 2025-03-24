
import React from 'react';
import { Separator } from '@/components/ui/separator';
import ActionTypeSelector from './ActionTypeSelector';
import ActionTabs from './ActionTabs';
import AlertMessage from './AlertMessage';
import InfoMessage from './InfoMessage';
import { NodeData } from './types';

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
  return (
    <div className="space-y-4">
      <ActionTypeSelector 
        actionType={nodeData.actionType}
        onActionTypeChange={onActionTypeChange}
      />
      
      {nodeData.actionType !== 'alert' && (
        <>
          <Separator />
          
          <ActionTabs
            nodeData={nodeData}
            showLimitPrice={showLimitPrice}
            hasOptionTrading={hasOptionTrading}
            startNodeSymbol={startNodeSymbol}
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
        </>
      )}
      
      {nodeData.actionType === 'alert' && <AlertMessage />}
      
      <InfoMessage actionType={nodeData.actionType} />
    </div>
  );
};

export default ActionNodeContent;
