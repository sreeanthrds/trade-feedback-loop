
import React from 'react';

const NoIndicatorsMessage: React.FC = () => {
  return (
    <div className="text-center p-4 bg-muted/30 rounded-md">
      <p className="text-muted-foreground text-sm">
        No indicators selected. Add indicators using the dropdown above.
      </p>
    </div>
  );
};

export default NoIndicatorsMessage;
