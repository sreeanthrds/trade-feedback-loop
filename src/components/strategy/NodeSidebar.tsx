import React, { useCallback, memo, useState } from 'react';
import { Play, Activity, SlidersHorizontal, StopCircle, AlertTriangle, ArrowUpCircle, X } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NodeSidebarProps {
  onAddNode: (type: string, parentNodeId?: string, initialNodeData?: Record<string, any>) => void;
}

interface NodeTypeItem {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subItems?: {
    type: string;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[];
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
    type: 'actionNode',
    label: 'Action Node',
    description: 'Execute trading actions',
    icon: <SlidersHorizontal className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    color: 'border-amber-600 dark:border-amber-400 bg-amber-600/10 dark:bg-amber-400/10',
    subItems: [
      {
        type: 'actionNode-entry',
        label: 'Entry Order',
        description: 'Open a new position',
        icon: <ArrowUpCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
      },
      {
        type: 'actionNode-exit',
        label: 'Exit Order',
        description: 'Close an existing position',
        icon: <X className="h-5 w-5 text-amber-600 dark:text-amber-500" />
      },
      {
        type: 'actionNode-alert',
        label: 'Alert',
        description: 'Generate a notification only',
        icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      }
    ]
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

const NodeSidebar = memo(({ onAddNode }: NodeSidebarProps) => {
  const [openActionMenu, setOpenActionMenu] = useState(false);

  const handleNodeClick = useCallback((type: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddNode(type);  // Call without second parameter when adding from sidebar
  }, [onAddNode]);

  const handleSubItemClick = useCallback((subType: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Extract base type and action type
    const [baseType, actionType] = subType.split('-');
    
    // Add the node with preconfigured action type
    onAddNode(baseType, undefined, { actionType });
    
    // Close the dropdown
    setOpenActionMenu(false);
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
          {nodeTypes.map((nodeType) => {
            // Render action node differently with dropdown
            if (nodeType.type === 'actionNode' && nodeType.subItems) {
              return (
                <DropdownMenu 
                  key={nodeType.type} 
                  open={openActionMenu} 
                  onOpenChange={setOpenActionMenu}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <div
                          className={`flex flex-col items-center justify-center p-2 rounded-full w-10 h-10 ${nodeType.color} cursor-grab transition-all hover:scale-105 hover:shadow-md`}
                          onClick={(e) => e.stopPropagation()}
                          draggable
                          onDragStart={(e) => handleDragStart(e, nodeType.type)}
                        >
                          {nodeType.icon}
                        </div>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{nodeType.label}</p>
                        <p className="text-xs text-muted-foreground">{nodeType.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  
                  <DropdownMenuContent side="right" align="start" className="min-w-[200px]">
                    {nodeType.subItems.map((subItem) => (
                      <DropdownMenuItem 
                        key={subItem.type}
                        onClick={(e) => handleSubItemClick(subItem.type, e as React.MouseEvent)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {subItem.icon}
                        <div>
                          <p className="text-sm font-medium">{subItem.label}</p>
                          <p className="text-xs text-muted-foreground">{subItem.description}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            
            // Render other node types normally
            return (
              <Tooltip key={nodeType.type}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex flex-col items-center justify-center w-10 h-10 rounded-full ${nodeType.color} cursor-grab transition-all hover:scale-105 hover:shadow-md`}
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
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
});

NodeSidebar.displayName = 'NodeSidebar';

export default NodeSidebar;
