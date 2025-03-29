
import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useActionNodeForm } from './action-node/useActionNodeForm';
import { Position } from './action-node/types';
import PositionsList from './action-node/components/PositionsList';
import PositionDialog from './action-node/components/PositionDialog';
import InstrumentPanel from './action-node/components/InstrumentPanel';
import ActionTypeSelector from './action-node/ActionTypeSelector';
import AlertMessage from './action-node/AlertMessage';
import ExitNodeForm from './action-node/components/ExitNodeForm';
import { toast } from "@/hooks/use-toast";

interface ActionNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ActionNodeEditor = ({ node, updateNodeData }: ActionNodeEditorProps) => {
  // State for controlling the dialog
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  
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
    setIsPositionDialogOpen(true);
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
    const newPosition = handleAddPosition();
    if (newPosition) {
      setSelectedPosition(newPosition);
      setIsPositionDialogOpen(true);
    } else {
      console.error("Failed to create new position");
    }
  };

  const onDeletePosition = (id: string) => {
    handleDeletePosition(id);
    // If we deleted the selected position, close the dialog
    if (selectedPosition?.id === id) {
      setIsPositionDialogOpen(false);
      setSelectedPosition(null);
    }
  };

  const closePositionDialog = () => {
    setIsPositionDialogOpen(false);
  };

  // Render different content based on action type
  const renderActionContent = () => {
    if (nodeData?.actionType === 'alert') {
      return <AlertMessage />;
    }

    // Render specialized exit node form
    if (nodeData?.actionType === 'exit') {
      return <ExitNodeForm node={node} updateNodeData={updateNodeData} />;
    }

    // For entry nodes, continue with the positions list
    return (
      <>
        <InstrumentPanel startNodeSymbol={startNodeSymbol} />
        
        <PositionsList 
          positions={nodeData?.positions || []}
          selectedPosition={selectedPosition}
          onSelectPosition={handlePositionSelect}
          onAddPosition={onAddPosition}
          onDeletePosition={onDeletePosition}
        />
      </>
    );
  };

  return (
    <>
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
            
            {renderActionContent()}
          </div>
        }
      />
      
      {/* Position Dialog */}
      <PositionDialog
        position={selectedPosition}
        isOpen={isPositionDialogOpen}
        onClose={closePositionDialog}
        hasOptionTrading={hasOptionTrading}
        onPositionChange={handlePositionUpdate}
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
    </>
  );
};

export default ActionNodeEditor;
