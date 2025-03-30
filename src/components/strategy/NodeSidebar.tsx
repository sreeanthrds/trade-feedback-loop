
import React, { useCallback, memo } from 'react';
import { ShoppingCart, LogOut, StopCircle, AlertTriangle, Activity, Play } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface NodeSidebarProps {
  onAddNode: (type: string, parentNodeId?: string) => void;
}

interface NodeTypeItem {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

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
    type: 'entryNode',
    label: 'Entry Node',
    description: 'Execute buy/sell orders',
    icon: <ShoppingCart className="h-5 w-5 text-green-600 dark:text-green-400" />,
    color: 'border-green-600 dark:border-green-400 bg-green-600/10 dark:bg-green-400/10'
  },
  {
    type: 'exitNode',
    label: 'Exit Node',
    description: 'Close positions',
    icon: <LogOut className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    color: 'border-amber-600 dark:border-amber-400 bg-amber-600/10 dark:bg-amber-400/10'
  },
  {
    type: 'alertNode',
    label: 'Alert Node',
    description: 'Send alerts',
    icon: <AlertTriangle className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    color: 'border-purple-600 dark:border-purple-400 bg-purple-600/10 dark:bg-purple-400/10'
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
    icon: <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />,
    color: 'border-red-500 dark:border-red-400 bg-red-500/10 dark:bg-red-400/10'
  }
];

const NodeSidebar = memo(({ onAddNode }: NodeSidebarProps) => {
  const handleNodeClick = useCallback((type: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddNode(type);  // Call without second parameter when adding from sidebar
  }, [onAddNode]);

  const handleDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

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
                  onClick={(e) => handleNodeClick(nodeType.type, e)}
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
});

NodeSidebar.displayName = 'NodeSidebar';

export default NodeSidebar;
