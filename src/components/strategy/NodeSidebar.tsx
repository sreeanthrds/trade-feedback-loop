
import React, { useCallback } from 'react';
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
      icon: <Play className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />,
      color: 'border-emerald-500 dark:border-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10'
    },
    {
      type: 'signalNode',
      label: 'Signal Node',
      description: 'Detect market conditions',
      icon: <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      color: 'border-blue-600 dark:border-blue-400 bg-blue-600/10 dark:bg-blue-400/10'
    },
    {
      type: 'actionNode',
      label: 'Action Node',
      description: 'Execute trading actions',
      icon: <SlidersHorizontal className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      color: 'border-amber-600 dark:border-amber-400 bg-amber-600/10 dark:bg-amber-400/10'
    },
    {
      type: 'endNode',
      label: 'End Node',
      description: 'End a strategy branch',
      icon: <StopCircle className="h-5 w-5 text-rose-600 dark:text-rose-500" />,
      color: 'border-rose-600 dark:border-rose-500 bg-rose-600/10 dark:bg-rose-500/10'
    },
    {
      type: 'forceEndNode',
      label: 'Force End Node',
      description: 'Close positions and end strategy',
      icon: <AlertTriangle className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
      color: 'border-purple-500 dark:border-purple-400 bg-purple-500/10 dark:bg-purple-400/10'
    }
  ];

  // Create stable event handlers that don't cause re-renders
  const handleDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleNodeAdd = useCallback((nodeType: string, event: React.MouseEvent) => {
    // Prevent the event from bubbling up to parent elements
    event.stopPropagation();
    event.preventDefault();
    
    console.log('Sidebar adding node type:', nodeType);
    onAddNode(nodeType);
  }, [onAddNode]);

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
                  onClick={(e) => handleNodeAdd(nodeType.type, e)}
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

export default React.memo(NodeSidebar);
