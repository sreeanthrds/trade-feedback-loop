
import React from 'react';

interface ActionLabelProps {
  label?: string;
  description?: string;
  actionType: 'entry' | 'exit' | 'alert' | 'modify';
}

const ActionLabel: React.FC<ActionLabelProps> = ({ label, description, actionType }) => {
  // Build a default label based on the action type if none provided
  const displayLabel = label || (() => {
    switch (actionType) {
      case 'entry':
        return 'Buy/Sell';
      case 'exit':
        return 'Exit Position';
      case 'alert':
        return 'Send Alert';
      case 'modify':
        return 'Modify Position';
      default:
        return 'Action';
    }
  })();

  return (
    <div className="flex items-center mb-1.5">
      <div className="flex-1">
        <div className="text-sm font-medium">{displayLabel}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
    </div>
  );
};

export default ActionLabel;
