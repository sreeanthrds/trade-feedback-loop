
import React from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useActionNodeForm } from './action-node/useActionNodeForm';
import { Position } from './action-node/types';
import PositionsList from './action-node/components/PositionsList';
import PositionEditor from './action-node/components/PositionEditor';
import InstrumentPanel from './action-node/components/InstrumentPanel';
import ActionTypeSelector from './action-node/ActionTypeSelector';
import AlertMessage from './action-node/AlertMessage';
import { toast } from "@/hooks/use-toast";

interface ActionNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ActionNodeEditor = ({ node, updateNodeData }: ActionNodeEditorProps) => {
  const { 
    nodeData,
    hasOptionTrading,
    startNodeSymbol,
    selectedPosition,
    setSelectedPosition,
    handleLabelChange,
    handleActionTypeChange,
    handlePositionChange,
    handleAddPosition,
    handleDeletePosition,
    validateVpiUniqueness,
    // Position-specific handlers
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

  const handlePositionSelect = (position: Position) => {
    setSelectedPosition(position);
  };

  const handlePositionUpdate = (updates: Partial<Position>) => {
    if (!selectedPosition) return;
    
    // We only check if the user is manually changing the VPI
    // System-generated VPIs are handled in useActionNodeForm
    if (updates.vpi && updates.vpi !== selectedPosition?.vpi && !validateVpiUniqueness(updates.vpi, selectedPosition.id)) {
      toast({
        title: "Duplicate VPI",
        description: "This Virtual Position ID is already in use. Please choose a unique identifier.",
        variant: "destructive"
      });
      return;
    }

    handlePositionChange(selectedPosition.id, updates);
  };

  const onAddPosition = () => {
    console.log("Adding position from ActionNodeEditor");
    const newPosition = handleAddPosition();
    if (newPosition) {
      console.log("New position created:", newPosition);
      setSelectedPosition(newPosition);
    } else {
      console.error("Failed to create new position");
    }
  };

  const onDeletePosition = (id: string) => {
    handleDeletePosition(id);
    // If we deleted the selected position, select another one or null
    if (selectedPosition?.id === id) {
      const remainingPositions = nodeData?.positions?.filter(p => p.id !== id) || [];
      setSelectedPosition(remainingPositions.length > 0 ? remainingPositions[0] : null);
    }
  };

  return (
    <NodeDetailsPanel
      nodeLabel={nodeData?.label || ''}
      onLabelChange={handleLabelChange}
      infoTooltip={getActionInfoTooltip()}
      additionalContent={
        <div className="space-y-6">
          <ActionTypeSelector 
            actionType={nodeData?.actionType}
            onActionTypeChange={handleActionTypeChange}
          />
          
          {nodeData?.actionType === 'alert' ? (
            <AlertMessage />
          ) : (
            <>
              <InstrumentPanel startNodeSymbol={startNodeSymbol} />
              
              <PositionsList 
                positions={nodeData?.positions || []}
                selectedPosition={selectedPosition}
                onSelectPosition={handlePositionSelect}
                onAddPosition={onAddPosition}
                onDeletePosition={onDeletePosition}
              />
              
              {selectedPosition && (
                <PositionEditor 
                  position={selectedPosition}
                  hasOptionTrading={hasOptionTrading}
                  onPositionChange={handlePositionUpdate}
                  onPositionTypeChange={(value) => handlePositionTypeChange(value)}
                  onOrderTypeChange={(value) => handleOrderTypeChange(value)}
                  onLimitPriceChange={(e) => handleLimitPriceChange(e)}
                  onLotsChange={(e) => handleLotsChange(e)}
                  onProductTypeChange={(value) => handleProductTypeChange(value)}
                  onExpiryChange={(value) => handleExpiryChange(value)}
                  onStrikeTypeChange={(value) => handleStrikeTypeChange(value)}
                  onStrikeValueChange={(e) => handleStrikeValueChange(e)}
                  onOptionTypeChange={(value) => handleOptionTypeChange(value)}
                />
              )}
            </>
          )}
        </div>
      }
    />
  );
};

export default ActionNodeEditor;
