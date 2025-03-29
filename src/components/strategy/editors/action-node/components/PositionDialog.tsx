
import React from 'react';
import { Position } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import PositionEditor from './PositionEditor';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PositionDialogProps {
  position: Position | null;
  isOpen: boolean;
  onClose: () => void;
  hasOptionTrading: boolean;
  onPositionChange: (updates: Partial<Position>) => void;
  onPositionTypeChange: (value: string) => void;
  onOrderTypeChange: (value: string) => void;
  onLimitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLotsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProductTypeChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onStrikeTypeChange: (value: string) => void;
  onStrikeValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOptionTypeChange: (value: string) => void;
}

const PositionDialog: React.FC<PositionDialogProps> = ({
  position,
  isOpen,
  onClose,
  hasOptionTrading,
  onPositionChange,
  onPositionTypeChange,
  onOrderTypeChange,
  onLimitPriceChange,
  onLotsChange,
  onProductTypeChange,
  onExpiryChange,
  onStrikeTypeChange,
  onStrikeValueChange,
  onOptionTypeChange
}) => {
  if (!position) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-[450px] h-auto max-h-[90vh] p-4">
        <DialogHeader className="mb-2">
          <DialogTitle>Edit Position {position.priority}</DialogTitle>
          <DialogClose onClick={onClose} className="absolute right-4 top-4" />
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="pb-2">
            <PositionEditor
              position={position}
              hasOptionTrading={hasOptionTrading}
              onPositionChange={onPositionChange}
              onPositionTypeChange={onPositionTypeChange}
              onOrderTypeChange={onOrderTypeChange}
              onLimitPriceChange={onLimitPriceChange}
              onLotsChange={onLotsChange}
              onProductTypeChange={onProductTypeChange}
              onExpiryChange={onExpiryChange}
              onStrikeTypeChange={onStrikeTypeChange}
              onStrikeValueChange={onStrikeValueChange}
              onOptionTypeChange={onOptionTypeChange}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PositionDialog;
