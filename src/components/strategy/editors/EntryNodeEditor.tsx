
import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useActionNodeForm } from './action-node/useActionNodeForm';
import InstrumentDisplay from './action-node/InstrumentDisplay';
import { toast } from "@/hooks/use-toast";
import PositionEditor from './action-node/components/PositionEditor';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import PositionDialog from './action-node/components/PositionDialog';

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
  
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  
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
  
  const handleEditPosition = () => {
    if (position) {
      setIsPositionDialogOpen(true);
    }
  };
  
  const handleClosePositionDialog = () => {
    setIsPositionDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <NodeDetailsPanel
        nodeLabel={nodeData?.label || ''}
        onLabelChange={handleLabelChange}
        infoTooltip="Entry nodes open new positions when the strategy detects a signal."
        additionalContent={
          <>
            <Separator className="my-1" />
            
            <InstrumentDisplay startNodeSymbol={startNodeSymbol} />
            
            <div className="bg-accent/5 rounded-md p-2">
              {position ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium">Position Details</span>
                      <span className="text-xs bg-primary/10 px-1 rounded" title={position.vpi}>
                        VPI: {position.vpi}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={handleEditPosition}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <PositionEditor
                    position={position}
                    hasOptionTrading={hasOptionTrading}
                    isEntryNode={true}
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
                </div>
              ) : (
                <div className="text-center p-1">
                  <p className="text-xs text-muted-foreground">Loading position...</p>
                </div>
              )}
            </div>
            
            {/* Position Dialog for editing */}
            <PositionDialog
              position={position}
              isOpen={isPositionDialogOpen}
              onClose={handleClosePositionDialog}
              hasOptionTrading={hasOptionTrading}
              isEntryNode={true}
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
        }
      />
    </div>
  );
};

export default EntryNodeEditor;
