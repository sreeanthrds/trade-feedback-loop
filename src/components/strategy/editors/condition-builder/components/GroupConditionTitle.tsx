
import React from 'react';
import { GroupCondition } from '../../../utils/conditions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface GroupConditionTitleProps {
  rootCondition: GroupCondition;
  level?: number;
  allowRemove?: boolean;
  updateGroupLogic: (value: string) => void;
  removeGroup: () => void;
}

const GroupConditionTitle: React.FC<GroupConditionTitleProps> = ({
  rootCondition,
  level = 0,
  allowRemove = false,
  updateGroupLogic,
  removeGroup,
}) => {
  return (
    <div className="flex items-center gap-2 group-condition-title">
      <div className="text-xs font-medium text-muted-foreground pr-1">When</div>
      
      <HoverCard>
        <HoverCardTrigger asChild>
          <Select
            value={rootCondition.groupLogic}
            onValueChange={updateGroupLogic}
          >
            <SelectTrigger className="h-7 px-2 text-xs min-w-[90px] condition-selector">
              <SelectValue placeholder="Select logic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">ALL conditions</SelectItem>
              <SelectItem value="OR">ANY condition</SelectItem>
            </SelectContent>
          </Select>
        </HoverCardTrigger>
        <HoverCardContent className="w-48 p-2 text-xs">
          {rootCondition.groupLogic === 'AND' 
            ? 'ALL conditions in this group must be true' 
            : 'ANY condition in this group can be true'}
        </HoverCardContent>
      </HoverCard>

      <div className="text-xs font-medium text-muted-foreground">are true</div>
      
      {allowRemove && level > 0 && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-70 hover:opacity-100 condition-action-btn"
              onClick={removeGroup}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Remove group</span>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-48 p-2 text-xs">
            Remove this entire condition group
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};

export default GroupConditionTitle;
