
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InstrumentDisplayProps {
  startNodeSymbol?: string;
  isSymbolMissing?: boolean;
}

const InstrumentDisplay: React.FC<InstrumentDisplayProps> = ({
  startNodeSymbol,
  isSymbolMissing
}) => {
  return (
    <div>
      {isSymbolMissing && (
        <Alert variant="destructive" className="py-2 mb-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            The instrument is no longer available in the Start Node. Please configure an instrument in the Start Node.
          </AlertDescription>
        </Alert>
      )}
      
      <div className={`p-2 border rounded-md text-sm flex items-center justify-between ${isSymbolMissing ? 'border-destructive bg-destructive/5' : 'border-input bg-muted/20'}`}>
        <span className="text-xs text-muted-foreground">Instrument:</span>
        <span className={startNodeSymbol ? "font-medium" : "text-muted-foreground"}>
          {startNodeSymbol || 'No instrument selected in Start Node'}
        </span>
      </div>
    </div>
  );
};

export default InstrumentDisplay;
