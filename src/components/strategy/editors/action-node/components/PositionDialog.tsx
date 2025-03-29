
import React, { useState, useRef, useEffect } from 'react';
import { Position } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import PositionEditor from './PositionEditor';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X } from 'lucide-react';

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
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverContent 
        className="w-[500px] p-0 bg-background border border-border shadow-lg rounded-lg"
        sideOffset={10}
        align="center"
        alignOffset={0}
        style={{ zIndex: 1000 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Position {position.priority}</h3>
          <button 
            onClick={onClose} 
            className="rounded-full h-6 w-6 flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-4">
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
      </PopoverContent>
    </Popover>
  );
};

export default PositionDialog;
