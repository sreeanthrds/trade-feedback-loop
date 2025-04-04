
import React from 'react';
import { GroupCondition } from '../../utils/conditionTypes';
import ConditionBuilder from '../condition-builder/ConditionBuilder';

interface ExitSignalNodeContentProps {
  conditions: GroupCondition[];
  updateConditions: (conditions: GroupCondition[]) => void;
}

const ExitSignalNodeContent = ({ conditions, updateConditions }: ExitSignalNodeContentProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Exit Conditions</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Define the conditions that will trigger exit signals for your strategy.
        </p>
        
        <ConditionBuilder 
          rootCondition={conditions[0]}
          updateConditions={(updatedRoot) => updateConditions([updatedRoot])}
          rootGroupId={conditions[0]?.id || 'exit-root'}
          conditionContext="exit"
        />
      </div>
    </div>
  );
};

export default ExitSignalNodeContent;
