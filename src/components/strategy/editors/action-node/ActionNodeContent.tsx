
import React from 'react';
import { Separator } from '@/components/ui/separator';
import ActionTypeSelector from './ActionTypeSelector';
import AlertMessage from './AlertMessage';
import InfoMessage from './InfoMessage';
import { NodeData } from './types';
import OrderDetailsSection from './OrderDetailsSection';
import InstrumentDisplay from './InstrumentDisplay';
import OptionsSettingsSection from './OptionsSettingsSection';

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
          
          <div className="space-y-4 py-3">
            {/* Order Details Section */}
            <OrderDetailsSection 
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
            
            {/* Instrument Details Section */}
            <InstrumentDisplay startNodeSymbol={startNodeSymbol} />
            
            {/* Options Settings Section (conditionally rendered) */}
            {hasOptionTrading && (
              <OptionsSettingsSection 
                optionDetails={nodeData.optionDetails}
                onExpiryChange={onExpiryChange}
                onStrikeTypeChange={onStrikeTypeChange}
                onStrikeValueChange={onStrikeValueChange}
                onOptionTypeChange={onOptionTypeChange}
              />
            )}
          </div>
        </>
      )}
      
      {nodeData.actionType === 'alert' && <AlertMessage />}
      
      <InfoMessage actionType={nodeData.actionType} />
    </div>
  );
};

export default ActionNodeContent;
