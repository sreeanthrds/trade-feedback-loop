
import React from 'react';
import { GroupCondition, groupConditionToString } from '../../../utils/conditionTypes';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useStrategyStore } from '@/hooks/use-strategy-store';

interface ConditionPreviewProps {
  rootCondition: GroupCondition;
}

const ConditionPreview: React.FC<ConditionPreviewProps> = ({
  rootCondition,
}) => {
  const strategyStore = useStrategyStore();
  
  if (!rootCondition) {
    return (
      <Card className="mt-4 bg-muted/40">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-xs font-medium">Preview</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-3">
          <div className="text-sm font-mono text-muted-foreground">
            No conditions defined
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get the start node to access indicator parameters
  const startNode = strategyStore.nodes.find(node => node.type === 'startNode');
  
  return (
    <Card className="mt-4 bg-muted/40">
      <CardHeader className="py-2 px-3">
        <CardTitle className="text-xs font-medium">Preview</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <div className="text-sm font-mono break-words">
          {groupConditionToString(rootCondition, startNode?.data)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionPreview;
