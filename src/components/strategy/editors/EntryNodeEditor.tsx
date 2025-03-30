
import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useActionNodeForm } from './action-node/useActionNodeForm';
import { Position } from './action-node/types';
import PositionsList from './action-node/components/PositionsList';
import PositionDialog from './action-node/components/PositionDialog';
import InstrumentPanel from './action-node/components/InstrumentPanel';
import { toast } from "@/hooks/use-toast";

interface EntryNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const EntryNodeEditor = ({ node, updateNodeData }: EntryNodeEditorProps) => {
  // State for controlling the dialog
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  
  // Force actionType to be 'entry'
  if (node.data.actionType !== 'entry') {
    updateNodeData(node.id, { 
      ...node.data, 
      actionType: 'entry',
      _lastUpdated: Date.now()
    });
  }
  
  const { 
    nodeData,
    hasOptionTrading,
    startNodeSymbol,
    selectedPosition,
    setSelectedPosition,
    handleLabelChange,
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

  // Get the appropriate info message
  const getActionInfoTooltip = () => {
    return "Entry nodes open new positions when the strategy detects a signal. Configure quantity and order details based on your trading preferences.";
  };

  const handlePositionSelect = (position: Position) => {
    setSelectedPosition(position);
    setIsPositionDialogOpen(true);
  };

  const handlePositionUpdate = (updates: Partial<Position>) => {
    if (!selectedPosition) return;
    
    // We only check if the user is manually changing the VPI
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

  return (
    <>
      <NodeDetailsPanel
        nodeLabel={nodeData?.label || ''}
        onLabelChange={handleLabelChange}
        infoTooltip={getActionInfoTooltip()}
        additionalContent={
          <div className="space-y-6">
            <InstrumentPanel startNodeSymbol={startNodeSymbol} />
            
            <PositionsList 
              positions={nodeData?.positions || []}
              selectedPosition={selectedPosition}
              onSelectPosition={handlePositionSelect}
              onAddPosition={onAddPosition}
              onDeletePosition={onDeletePosition}
            />
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

export default EntryNodeEditor;
