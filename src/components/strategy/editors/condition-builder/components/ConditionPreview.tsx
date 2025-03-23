
import React from 'react';
import { GroupCondition, groupConditionToString } from '../../../utils/conditionTypes';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface ConditionPreviewProps {
  rootCondition: GroupCondition;
}

const ConditionPreview: React.FC<ConditionPreviewProps> = ({
  rootCondition,
}) => {
  return (
    <Card className="mt-4 bg-muted/40">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-xs font-medium">Preview</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <div className="text-sm font-mono break-words">
          {groupConditionToString(rootCondition)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionPreview;
