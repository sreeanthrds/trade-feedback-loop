
import React from 'react';
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

  // Create or get the default position
  React.useEffect(() => {
    // If there are no positions, create one
    if ((!nodeData.positions || nodeData.positions.length === 0) && handleAddPosition) {
      console.log("Creating initial position for entry node");
      handleAddPosition();
    }
  }, [nodeData.positions, handleAddPosition]);

  // Get the current position (there should be only one for entry nodes)
  const position = nodeData.positions && nodeData.positions.length > 0 
    ? nodeData.positions[0] 
    : null;

  // Get the appropriate info message
  const getActionInfoTooltip = () => {
    return "Entry nodes open new positions when the strategy detects a signal. Configure quantity and order details based on your trading preferences.";
  };

  const handlePositionUpdate = (updates: Partial<typeof position>) => {
    if (!position) return;
    
    // We only check if the user is manually changing the VPI
    if (updates.vpi && updates.vpi !== position?.vpi && !validateVpiUniqueness(updates.vpi, position.id)) {
      toast({
        title: "Duplicate VPI",
        description: "This Virtual Position ID is already in use. Please choose a unique identifier.",
        variant: "destructive"
      });
      return;
    }

    handlePositionChange(position.id, updates);
  };

  return (
    <div className="space-y-4">
      <NodeDetailsPanel
        nodeLabel={nodeData?.label || ''}
        onLabelChange={handleLabelChange}
        infoTooltip={getActionInfoTooltip()}
      />
      
      <Separator />
      
      <InstrumentPanel startNodeSymbol={startNodeSymbol} />
      
      <div className="bg-accent/10 rounded-md p-4">
        <h3 className="text-base font-medium mb-3">Position Configuration</h3>
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
          <div className="text-center p-4 bg-background rounded-md">
            <p className="text-sm text-muted-foreground">Loading position configuration...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryNodeEditor;
