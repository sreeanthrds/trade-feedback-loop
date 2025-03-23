
import React from 'react';
import { Play, Activity, SlidersHorizontal, StopCircle, AlertTriangle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface NodeSidebarProps {
  onAddNode: (type: string) => void;
}

interface NodeTypeItem {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const NodeSidebar = ({ onAddNode }: NodeSidebarProps) => {
  const nodeTypes: NodeTypeItem[] = [
    {
      type: 'startNode',
      label: 'Start Node',
      description: 'Entry point of the strategy',
      icon: <Play className="h-5 w-5 text-success" />,
      color: 'border-success bg-success/10'
    },
    {
      type: 'signalNode',
      label: 'Signal Node',
      description: 'Detect market conditions',
      icon: <Activity className="h-5 w-5 text-primary" />,
      color: 'border-primary bg-primary/10'
    },
    {
      type: 'actionNode',
      label: 'Action Node',
      description: 'Execute trading actions',
      icon: <SlidersHorizontal className="h-5 w-5 text-warning" />,
      color: 'border-warning bg-warning/10'
    },
    {
      type: 'endNode',
      label: 'End Node',
      description: 'End a strategy branch',
      icon: <StopCircle className="h-5 w-5 text-danger" />,
      color: 'border-danger bg-danger/10'
    },
    {
      type: 'forceEndNode',
      label: 'Force End Node',
      description: 'Close positions and end strategy',
      icon: <AlertTriangle className="h-5 w-5 text-[#9C27B0]" />,
      color: 'border-[#9C27B0] bg-[#9C27B0]/10'
    }
  ];

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full overflow-auto py-4 flex flex-col items-center">
      <h3 className="font-medium text-xs uppercase tracking-wider mb-4 text-center text-muted-foreground">Nodes</h3>
      
      <div className="space-y-6">
        <TooltipProvider delayDuration={200}>
          {nodeTypes.map((nodeType) => (
            <Tooltip key={nodeType.type}>
              <TooltipTrigger asChild>
                <div
                  className={`flex justify-center items-center w-10 h-10 rounded-full ${nodeType.color} cursor-grab transition-all hover:scale-105 hover:shadow-md`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, nodeType.type)}
                  onClick={() => onAddNode(nodeType.type)}
                >
                  {nodeType.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{nodeType.label}</p>
                  <p className="text-xs text-muted-foreground">{nodeType.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default NodeSidebar;
