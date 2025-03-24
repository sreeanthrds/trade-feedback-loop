
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

  return (
    <NodeDetailsPanel
      nodeLabel={nodeData?.label || ''}
      onLabelChange={handleLabelChange}
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
