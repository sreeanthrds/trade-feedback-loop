
import React, { useState } from 'react';
import { Background, Controls, MiniMap } from '@xyflow/react';
import { Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasControlsProps {
  nodeClassName: (node: any) => string;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({ nodeClassName }) => {
  const [minimapVisible, setMinimapVisible] = useState(false);

  const toggleMinimap = () => {
    setMinimapVisible(prev => !prev);
  };

  return (
    <>
      <Background />
      <Controls />
      
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-1">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7 bg-background/80 backdrop-blur-sm" 
          onClick={toggleMinimap}
          type="button"
        >
          {minimapVisible ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </Button>
        
        {minimapVisible && (
          <MiniMap 
            className="rounded-md overflow-hidden border border-border"
            nodeStrokeWidth={1}
            nodeColor={(node) => {
              switch (node.type) {
                case 'startNode': return '#4CAF50';
                case 'signalNode': return '#2196F3';
                case 'actionNode': return '#FF9800';
                case 'endNode': return '#F44336';
                case 'forceEndNode': return '#9C27B0';
                default: return '#eee';
              }
            }}
            nodeClassName={nodeClassName}
          />
        )}
      </div>
    </>
  );
};

export default React.memo(CanvasControls);
