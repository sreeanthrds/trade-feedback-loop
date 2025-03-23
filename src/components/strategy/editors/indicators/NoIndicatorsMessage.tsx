
import React from 'react';

const NoIndicatorsMessage: React.FC = () => {
  return (
    <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-md">
      No indicators selected. Add indicators to configure your strategy.
    </div>
  );
};

export default NoIndicatorsMessage;
