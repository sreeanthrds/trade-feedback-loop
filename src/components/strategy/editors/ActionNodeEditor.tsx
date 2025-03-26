
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useActionNodeForm } from './action-node/useActionNodeForm';
import ActionNodeContent from './action-node/ActionNodeContent';

interface ActionNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ActionNodeEditor = ({ node, updateNodeData }: ActionNodeEditorProps) => {
  const { 
    nodeData,
    showLimitPrice,
    hasOptionTrading,
    startNodeSymbol,
    handleLabelChange,
    handleActionTypeChange,
    handlePositionTypeChange,
    handleOrderTypeChange,
    handleLimitPriceChange,
    handleLotsChange,
    handleProductTypeChange,
    handleExpiryChange,
    handleStrikeTypeChange,
    handleStrikeValueChange,
    handleOptionTypeChange
  } = useActionNodeForm({ node, updateNodeData });

  // Get the appropriate info message based on the action type
  const getActionInfoTooltip = () => {
    switch (nodeData?.actionType) {
      case 'entry':
        return "Entry nodes open new positions when the strategy detects a signal. Configure quantity and order details based on your trading preferences.";
      case 'exit':
        return "Exit nodes close existing positions. Use these after entry nodes to define when to exit the market based on signals.";
      case 'alert':
        return "Alert nodes notify you of trading opportunities without executing trades. Useful for manual trading or when testing a strategy.";
      default:
        return "Action nodes execute trades or generate notifications when connected to signal nodes in your strategy.";
    }
  };

  return (
    <NodeDetailsPanel
      nodeLabel={nodeData?.label || ''}
      onLabelChange={handleLabelChange}
      infoTooltip={getActionInfoTooltip()}
      additionalContent={
        <ActionNodeContent
          nodeData={nodeData}
          showLimitPrice={showLimitPrice}
          hasOptionTrading={hasOptionTrading}
          startNodeSymbol={startNodeSymbol}
          onActionTypeChange={handleActionTypeChange}
          onPositionTypeChange={handlePositionTypeChange}
          onOrderTypeChange={handleOrderTypeChange}
          onLimitPriceChange={handleLimitPriceChange}
          onLotsChange={handleLotsChange}
          onProductTypeChange={handleProductTypeChange}
          onExpiryChange={handleExpiryChange}
          onStrikeTypeChange={handleStrikeTypeChange}
          onStrikeValueChange={handleStrikeValueChange}
          onOptionTypeChange={handleOptionTypeChange}
        />
      }
    />
  );
};

export default ActionNodeEditor;
