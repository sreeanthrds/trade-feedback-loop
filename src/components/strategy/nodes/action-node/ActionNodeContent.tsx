
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import ActionIcon from './ActionIcon';
import ActionLabel from './ActionLabel';
import ActionDetails from './ActionDetails';
import { ActionNodeData, Position as PositionType } from './types';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import PositionDialog from '../../editors/action-node/components/PositionDialog';

interface ActionNodeContentProps {
  data: ActionNodeData;
  startNodeSymbol?: string;
  isSymbolMissing?: boolean;
  id: string;
  updateNodeData?: (id: string, data: Partial<ActionNodeData>) => void;
}

const ActionNodeContent: React.FC<ActionNodeContentProps> = ({ 
  data, 
  startNodeSymbol,
  isSymbolMissing,
  id,
  updateNodeData
}) => {
  // Sort positions by priority
  const sortedPositions = [...(data.positions || [])].sort((a, b) => a.priority - b.priority);
  const [editingPosition, setEditingPosition] = useState<PositionType | null>(null);
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  
  const handleEditPosition = (position: PositionType) => {
    setEditingPosition({...position});
    setIsPositionDialogOpen(true);
  };
  
  const handlePositionChange = (updates: Partial<PositionType>) => {
    if (!editingPosition || !updateNodeData) return;
    
    const updatedPositions = data.positions?.map(pos => 
      pos.id === editingPosition.id ? { ...pos, ...updates } : pos
    ) || [];
    
    updateNodeData(id, { positions: updatedPositions });
  };

  const handleClosePositionDialog = () => {
    setIsPositionDialogOpen(false);
    setEditingPosition(null);
  };

  // Handle option details updates safely
  const handleOptionDetailsChange = (optionUpdates: Record<string, any>) => {
    if (!editingPosition || !updateNodeData) return;
    
    const updatedOptionDetails = {
      ...editingPosition.optionDetails,
      ...optionUpdates
    };
    
    const updatedPositions = data.positions?.map(pos => 
      pos.id === editingPosition.id ? { 
        ...pos, 
        optionDetails: updatedOptionDetails 
      } : pos
    ) || [];
    
    updateNodeData(id, { positions: updatedPositions });
  };
  
  // Enhanced handlers for number inputs
  const handleLimitPriceChange = (value: number | undefined) => {
    handlePositionChange({ limitPrice: value });
  };
  
  const handleLotsChange = (value: number | undefined) => {
    handlePositionChange({ lots: value });
  };
  
  const handleStrikeValueChange = (value: number | undefined) => {
    handleOptionDetailsChange({ strikeValue: value });
  };
  
  return (
    <div className={`px-4 py-2 rounded-md bg-background/95 border ${isSymbolMissing ? 'border-destructive/50' : 'border-border/50'}`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#FF9800' }}
      />
      
      <div className="flex items-center mb-2">
        <ActionIcon data={data} />
        <div className="font-medium">
          <ActionLabel data={data} />
        </div>
      </div>
      
      {isSymbolMissing && (
        <div className="flex items-center gap-1 py-1 px-2 bg-destructive/10 rounded text-destructive text-xs mb-2">
          <AlertTriangle className="h-3 w-3" />
          <span>Missing instrument</span>
        </div>
      )}
      
      {/* Display multiple positions */}
      {sortedPositions.length > 0 ? (
        <div className="space-y-2">
          {sortedPositions.map((position, index) => (
            <div key={position.id} className="text-xs border-t pt-1 first:border-t-0 first:pt-0">
              <div className="flex justify-between items-center">
                <span className="font-medium">Position {index + 1}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    Priority: {position.priority}
                  </span>
                  {updateNodeData && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5" 
                      onClick={() => handleEditPosition(position)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span>{position.positionType === 'buy' ? 'Buy' : 'Sell'}</span>
                <span>{position.lots || 1} lot{(position.lots || 1) > 1 ? 's' : ''}</span>
                {position.vpi && (
                  <span className="text-xs bg-primary/10 px-1 rounded overflow-hidden text-ellipsis max-w-[120px]" title={position.vpi}>
                    VPI: {position.vpi}
                  </span>
                )}
                {position.vpt && (
                  <span className="text-xs bg-secondary/10 px-1 rounded overflow-hidden text-ellipsis max-w-[120px]" title={position.vpt}>
                    Tag: {position.vpt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ActionDetails data={data} startNodeSymbol={startNodeSymbol} />
      )}
      
      {/* Display node ID */}
      <div className="text-[9px] text-muted-foreground mt-2 text-right">
        ID: {id}
      </div>
      
      {/* Position Dialog */}
      {editingPosition && updateNodeData && (
        <PositionDialog
          position={editingPosition}
          isOpen={isPositionDialogOpen}
          onClose={handleClosePositionDialog}
          hasOptionTrading={true}
          onPositionChange={handlePositionChange}
          onPositionTypeChange={(value) => handlePositionChange({ positionType: value as 'buy' | 'sell' })}
          onOrderTypeChange={(value) => handlePositionChange({ orderType: value as 'market' | 'limit' })}
          onLimitPriceChange={(e) => handleLimitPriceChange(parseFloat(e.target.value) || undefined)}
          onLotsChange={(e) => handleLotsChange(parseInt(e.target.value) || undefined)}
          onProductTypeChange={(value) => handlePositionChange({ productType: value as 'intraday' | 'carryForward' })}
          onExpiryChange={(value) => {
            handleOptionDetailsChange({ expiry: value });
          }}
          onStrikeTypeChange={(value) => {
            handleOptionDetailsChange({ strikeType: value as any });
          }}
          onStrikeValueChange={(e) => {
            handleStrikeValueChange(parseFloat(e.target.value) || undefined);
          }}
          onOptionTypeChange={(value) => {
            handleOptionDetailsChange({ optionType: value as 'CE' | 'PE' });
          }}
        />
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#FF9800' }}
      />
    </div>
  );
};

export default ActionNodeContent;
