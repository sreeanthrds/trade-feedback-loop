
import React from 'react';
import { GroupCondition } from '../../../utils/conditions';
import { groupConditionToString } from '../../../utils/conditions/stringRepresentation';
import FieldTooltip from '../../shared/FieldTooltip';

interface ConditionPreviewProps {
  rootCondition: GroupCondition;
  contextLabel?: string;
}

const ConditionPreview: React.FC<ConditionPreviewProps> = ({
  rootCondition,
  contextLabel = 'When:'
}) => {
  const conditionString = groupConditionToString(rootCondition);
  const hasConditions = rootCondition.conditions.length > 0;

  return (
    <div className="mt-4 p-3 bg-muted/30 rounded-md border border-border">
      <div className="flex items-center gap-1.5 mb-1">
        <h4 className="text-xs font-medium">Condition Preview</h4>
        <FieldTooltip 
          content="This shows a human-readable representation of your condition" 
          iconClassName="h-3 w-3 text-muted-foreground cursor-help"
        />
      </div>
      <div className="text-xs bg-background p-2 rounded border transition-colors hover:border-primary/30">
        <div className="flex gap-1.5">
          <span className="text-muted-foreground">{contextLabel}</span>
          <span>{hasConditions ? conditionString : 'No conditions defined'}</span>
        </div>
      </div>
    </div>
  );
};

export default ConditionPreview;
