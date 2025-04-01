
import React, { useEffect } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useActionNodeForm } from './action-node/useActionNodeForm';
import InstrumentPanel from './action-node/components/InstrumentPanel';
import { toast } from "@/hooks/use-toast";
import PositionEditor from './action-node/components/PositionEditor';
import { Separator } from '@/components/ui/separator';

interface EntryNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const EntryNodeEditor = ({ node, updateNodeData }: EntryNodeEditorProps) => {
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
    handleLabelChange,
    handlePositionChange,
    handleAddPosition,
    validateVpiUniqueness,
    createDefaultPosition,
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

  // Ensure we always have a position for entry nodes
  useEffect(() => {
    // If there are no positions, create one
    if ((!nodeData.positions || nodeData.positions.length === 0) && handleAddPosition) {
      handleAddPosition();
    }
  }, [nodeData.positions, handleAddPosition]);

  // Get the current position (there should be only one for entry nodes)
  const position = nodeData.positions && nodeData.positions.length > 0 
    ? nodeData.positions[0] 
    : null;

  const handlePositionUpdate = (updates: Partial<any>) => {
    if (!position) return;
    
    // We only check if the user is manually changing the VPI
    if (updates.vpi && updates.vpi !== position?.vpi && !validateVpiUniqueness(updates.vpi, position.id)) {
      toast({
        title: "Duplicate VPI",
        description: "This Virtual Position ID is already in use.",
        variant: "destructive"
      });
      return;
    }

    handlePositionChange(position.id, updates);
  };

  return (
    <div className="space-y-3">
      <NodeDetailsPanel
        nodeLabel={nodeData?.label || ''}
        onLabelChange={handleLabelChange}
        infoTooltip="Entry nodes open new positions when the strategy detects a signal."
      />
      
      <Separator className="my-2" />
      
      <InstrumentPanel startNodeSymbol={startNodeSymbol} />
      
      <div className="bg-accent/5 rounded-md p-3">
        {position ? (
          <PositionEditor
            position={position}
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
        ) : (
          <div className="text-center p-2">
            <p className="text-sm text-muted-foreground">Loading position...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryNodeEditor;
