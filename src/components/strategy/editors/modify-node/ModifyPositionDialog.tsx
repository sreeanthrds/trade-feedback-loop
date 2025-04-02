
import React from 'react';
import { Position } from '@/hooks/useModifyPositions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PositionEditor from '../action-node/components/PositionEditor';

interface ModifyPositionDialogProps {
  position: Position | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onPositionChange: (updates: Partial<Position>) => void;
}

const ModifyPositionDialog: React.FC<ModifyPositionDialogProps> = ({
  position,
  isOpen,
  onClose,
  onSave,
  onPositionChange
}) => {
  if (!position) return null;

  // Position type handlers
  const handlePositionTypeChange = (value: string) => {
    onPositionChange({ positionType: value as 'buy' | 'sell' });
  };
  
  const handleOrderTypeChange = (value: string) => {
    onPositionChange({ orderType: value as 'market' | 'limit' });
  };
  
  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    onPositionChange({ limitPrice: value });
  };
  
  const handleLotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onPositionChange({ lots: value });
  };
  
  const handleProductTypeChange = (value: string) => {
    onPositionChange({ productType: value as 'intraday' | 'carryForward' });
  };
  
  const handleExpiryChange = (value: string) => {
    if (!position.optionDetails) return;
    
    onPositionChange({ 
      optionDetails: {
        ...position.optionDetails,
        expiry: value 
      }
    });
  };
  
  const handleStrikeTypeChange = (value: string) => {
    if (!position.optionDetails) return;
    
    onPositionChange({ 
      optionDetails: {
        ...position.optionDetails,
        strikeType: value 
      }
    });
  };
  
  const handleStrikeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!position.optionDetails) return;
    
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    onPositionChange({ 
      optionDetails: {
        ...position.optionDetails,
        strikeValue: value 
      }
    });
  };
  
  const handleOptionTypeChange = (value: string) => {
    if (!position.optionDetails) return;
    
    onPositionChange({ 
      optionDetails: {
        ...position.optionDetails,
        optionType: value 
      }
    });
  };

  // Create compatible position for PositionEditor
  const adaptedPosition = {
    id: position.id,
    vpi: position.vpi,
    vpt: position.vpt,
    priority: position.priority,
    positionType: position.positionType,
    orderType: position.orderType,
    limitPrice: position.limitPrice,
    lots: position.lots,
    productType: position.productType,
    optionDetails: position.optionDetails ? {
      expiry: position.optionDetails.expiry,
      strikeType: position.optionDetails.strikeType,
      strikeValue: position.optionDetails.strikeValue,
      optionType: position.optionDetails.optionType
    } : undefined
  };

  // Create the handler wrapper for type safety
  const handleAdaptedPositionChange = (updates: any) => {
    onPositionChange(updates);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-[500px] h-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Modify Position {position.vpi}</DialogTitle>
          <DialogDescription>
            Change position parameters for {position.positionType} {position.orderType} order
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-180px)] pr-4">
          <div className="pb-6">
            <PositionEditor
              position={adaptedPosition}
              hasOptionTrading={!!position.optionDetails}
              onPositionChange={handleAdaptedPositionChange}
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
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button onClick={onSave} className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyPositionDialog;
