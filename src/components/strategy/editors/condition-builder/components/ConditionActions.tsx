
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface ConditionActionsProps {
  addCondition: () => void;
  addGroup: () => void;
}

const ConditionActions: React.FC<ConditionActionsProps> = ({
  addCondition,
  addGroup,
}) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 condition-action-btn"
            onClick={addCondition}
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="text-xs">Add Condition</span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-48 p-2 text-xs">
          Add a new condition to this group
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 condition-action-btn"
            onClick={addGroup}
          >
            <FolderPlus className="h-4 w-4 mr-1" />
            <span className="text-xs">Add Group</span>
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-48 p-2 text-xs">
          Add a nested group of conditions
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default ConditionActions;
