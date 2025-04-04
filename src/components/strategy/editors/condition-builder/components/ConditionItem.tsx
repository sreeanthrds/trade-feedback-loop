
import React, { memo, useState } from 'react';
import { Condition, GroupCondition } from '../../../utils/conditions';
import SingleConditionEditor from '../SingleConditionEditor';
import ConditionBuilder from '../ConditionBuilder';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface ConditionItemProps {
  condition: Condition | GroupCondition;
  index: number;
  level: number;
  updateCondition: (updated: Condition | GroupCondition) => void;
  removeCondition: () => void;
  conditionContext?: 'entry' | 'exit';
}

const ConditionItem = ({
  condition,
  index,
  level,
  updateCondition,
  removeCondition,
  conditionContext = 'entry'
}: ConditionItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if we're working with a group condition or a single condition
  const isGroup = 'groupLogic' in condition;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div 
      className="condition-item relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isGroup ? (
        <div className="nested-group">
          <ConditionBuilder
            rootCondition={condition as GroupCondition}
            updateConditions={updateCondition}
            level={level + 1}
            parentUpdateFn={updateCondition}
            allowRemove={true}
            index={index}
            conditionContext={conditionContext}
          />
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <div className="flex-grow">
            <SingleConditionEditor
              condition={condition as Condition}
              updateCondition={updateCondition}
              conditionContext={conditionContext}
            />
          </div>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 mt-1 opacity-70 hover:opacity-100 condition-action-btn"
                onClick={removeCondition}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove condition</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-48 p-2 text-xs">
              Remove this condition
            </HoverCardContent>
          </HoverCard>
        </div>
      )}
    </div>
  );
};

export default memo(ConditionItem);
