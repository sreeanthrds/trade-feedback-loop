
import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { NodeDetailsPanel } from './shared';
import { useActionNodeForm } from './action-node/useActionNodeForm';
import InstrumentDisplay from './action-node/InstrumentDisplay';
import { toast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Edit2, ExternalLink } from 'lucide-react';
import PositionDialog from './action-node/components/PositionDialog';
import { Position } from './action-node/types';
import { useStrategyStore } from '@/hooks/use-strategy-store';

interface ModifyNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ModifyNodeEditor = ({ node, updateNodeData }: ModifyNodeEditorProps) => {
  // Force actionType to be 'modify'
  if (node.data.actionType !== 'modify') {
    updateNodeData(node.id, { 
      ...node.data, 
      actionType: 'modify',
      _lastUpdated: Date.now()
    });
  }
  
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  
  const { 
    nodeData,
    hasOptionTrading,
    startNodeSymbol,
    handleLabelChange,
    handlePositionChange,
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

  // Get all nodes to find available positions
  const nodes = useStrategyStore(state => state.nodes);
  
  useEffect(() => {
    // Scan all nodes to find entry nodes with positions
    const positions: Position[] = [];
    
    nodes.forEach(node => {
      if (node.type === 'entryNode' && node.data.positions && node.data.positions.length > 0) {
        node.data.positions.forEach((position: Position) => {
          positions.push({
            ...position,
            sourceNodeId: node.id
          });
        });
      }
    });
    
    setAvailablePositions(positions);
    
    // Ensure we have a selected position if one is already set in the node data
    if (nodeData.targetPositionId && !selectedPositionId) {
      setSelectedPositionId(nodeData.targetPositionId);
    }
  }, [nodes, nodeData.targetPositionId, selectedPositionId]);

  // Get the currently selected position from available positions
  const selectedPosition = selectedPositionId 
    ? availablePositions.find(pos => pos.id === selectedPositionId) 
    : null;
    
  // Add a position to modify
  const handleAddPositionToModify = (positionId: string) => {
    const position = availablePositions.find(pos => pos.id === positionId);
    if (!position) return;
    
    // Store just the reference to the position, not the position itself
    updateNodeData(node.id, {
      targetPositionId: position.id,
      targetNodeId: position.sourceNodeId,
      // Store a copy of the modifications we want to make
      modifications: {
        positionType: position.positionType,
        orderType: position.orderType,
        limitPrice: position.limitPrice,
        lots: position.lots,
        productType: position.productType,
        optionDetails: position.optionDetails ? { ...position.optionDetails } : undefined
      },
      _lastUpdated: Date.now()
    });
    
    setSelectedPositionId(position.id);
  };
  
  const handlePositionUpdate = (updates: Partial<any>) => {
    if (!selectedPosition) return;
    
    // We only check if the user is manually changing the VPI
    if (updates.vpi && updates.vpi !== selectedPosition?.vpi && !validateVpiUniqueness(updates.vpi, selectedPosition.id)) {
      toast({
        title: "Duplicate VPI",
        description: "This Virtual Position ID is already in use.",
        variant: "destructive"
      });
      return;
    }

    // Update the modifications in the node data
    const currentModifications = nodeData.modifications || {};
    updateNodeData(node.id, {
      modifications: {
        ...currentModifications,
        ...updates
      },
      _lastUpdated: Date.now()
    });
  };
  
  const handleEditPosition = () => {
    if (selectedPosition) {
      setIsPositionDialogOpen(true);
    }
  };
  
  const handleClosePositionDialog = () => {
    setIsPositionDialogOpen(false);
  };
  
  const handleSelectPosition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const positionId = e.target.value;
    handleAddPositionToModify(positionId);
  };

  return (
    <div className="space-y-2">
      <NodeDetailsPanel
        nodeLabel={nodeData?.label || ''}
        onLabelChange={handleLabelChange}
        infoTooltip="Modify nodes allow you to change parameters of already opened positions."
      />
      
      <Separator className="my-1" />
      
      <InstrumentDisplay startNodeSymbol={startNodeSymbol} />
      
      <div className="bg-accent/5 rounded-md p-2">
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium">Select Position to Modify</label>
            <select 
              className="px-3 py-1 rounded-md bg-background border"
              value={selectedPositionId || ""}
              onChange={handleSelectPosition}
            >
              <option value="">-- Select a position --</option>
              {availablePositions.map(position => (
                <option key={position.id} value={position.id}>
                  {position.vpi} - {position.positionType === 'buy' ? 'Long' : 'Short'}
                </option>
              ))}
            </select>
          </div>
          
          {selectedPosition ? (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">Position Details</span>
                  <span className="text-xs bg-primary/10 px-1 rounded" title={selectedPosition.vpi}>
                    VPI: {selectedPosition.vpi}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={handleEditPosition}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => {
                      // Navigate to the source node's edit panel (in a real app)
                      toast({
                        title: "Position Source",
                        description: `This position comes from node ${selectedPosition.sourceNodeId}`,
                      });
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mb-2">
                Modify the parameters you want to change for this position.
              </div>
              
              {/* Current position details displayed as read-only */}
              <div className="bg-background/50 p-2 rounded-md mb-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-xs">
                    <span className="font-medium">Type:</span> {selectedPosition.positionType === 'buy' ? 'Long' : 'Short'}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Order:</span> {selectedPosition.orderType}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Lots:</span> {selectedPosition.lots || 0}
                  </div>
                  {selectedPosition.orderType === 'limit' && (
                    <div className="text-xs">
                      <span className="font-medium">Limit:</span> {selectedPosition.limitPrice || 'N/A'}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Buttons to make common modifications */}
              <div className="flex flex-wrap gap-1 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handlePositionUpdate({ orderType: 'market' })}
                >
                  Convert to Market
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handlePositionUpdate({ orderType: 'limit' })}
                >
                  Convert to Limit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handlePositionUpdate({ lots: (selectedPosition.lots || 1) + 1 })}
                >
                  Increase Lots
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    const currentLots = selectedPosition.lots || 1;
                    if (currentLots > 1) {
                      handlePositionUpdate({ lots: currentLots - 1 });
                    }
                  }}
                >
                  Decrease Lots
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">
                Select a position to modify its parameters
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Position Dialog for detailed editing */}
      {selectedPosition && (
        <PositionDialog
          position={{
            ...selectedPosition,
            ...nodeData.modifications,
          }}
          isOpen={isPositionDialogOpen}
          onClose={handleClosePositionDialog}
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
      )}
    </div>
  );
};

export default ModifyNodeEditor;
