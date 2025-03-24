
import React from 'react';
import { FormField } from '../shared';

interface InstrumentDisplayProps {
  startNodeSymbol?: string;
}

const InstrumentDisplay: React.FC<InstrumentDisplayProps> = ({
  startNodeSymbol
}) => {
  return (
    <FormField 
      label="Instrument" 
      htmlFor="instrument"
    >
      <div className="p-2 border border-input rounded-md bg-muted/20 text-sm flex items-center justify-between">
        <span className={startNodeSymbol ? "font-medium" : "text-muted-foreground"}>
          {startNodeSymbol || 'No instrument selected in Start Node'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        This value is inherited from the Start Node
      </p>
    </FormField>
  );
};

export default InstrumentDisplay;
