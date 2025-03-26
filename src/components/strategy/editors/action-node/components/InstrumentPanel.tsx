
import React from 'react';
import InstrumentDisplay from '../InstrumentDisplay';

interface InstrumentPanelProps {
  startNodeSymbol?: string;
}

const InstrumentPanel: React.FC<InstrumentPanelProps> = ({
  startNodeSymbol
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Instrument</h3>
      <InstrumentDisplay startNodeSymbol={startNodeSymbol} />
    </div>
  );
};

export default InstrumentPanel;
