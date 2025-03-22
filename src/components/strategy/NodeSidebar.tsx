
import React from 'react';
import { Play, Activity, SlidersHorizontal, StopCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="h-full p-4 overflow-auto">
      <h3 className="font-medium text-base mb-3">Strategy Nodes</h3>
      <p className="text-sm text-foreground/70 mb-4">
        Drag and drop nodes to build your trading strategy
      </p>
      
      <div className="space-y-3">
        {nodeTypes.map((nodeType) => (
          <Card 
            key={nodeType.type}
            className={`border ${nodeType.color} cursor-grab transition-shadow hover:shadow-md`}
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType.type)}
            onClick={() => onAddNode(nodeType.type)}
          >
            <CardContent className="p-3">
              <div className="flex items-center">
                <div className="mr-3">{nodeType.icon}</div>
                <div>
                  <h4 className="text-sm font-medium">{nodeType.label}</h4>
                  <p className="text-xs text-foreground/70">{nodeType.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NodeSidebar;
