
import React from 'react';
import { Label } from '@/components/ui/label';

interface InstrumentDisplayProps {
  startNodeSymbol?: string;
}

const InstrumentDisplay: React.FC<InstrumentDisplayProps> = ({
  startNodeSymbol
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="instrument">Instrument</Label>
      <div className="p-2 border border-input rounded-md bg-muted/20 text-sm">
        {startNodeSymbol || 'No instrument selected in Start Node'}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        This value is inherited from the Start Node
      </p>
    </div>
  );
};

export default InstrumentDisplay;
