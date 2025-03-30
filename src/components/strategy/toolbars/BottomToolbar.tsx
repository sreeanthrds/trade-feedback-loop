
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

const BottomToolbar: React.FC = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  
  const handleZoomIn = () => {
    zoomIn({ duration: 300 });
  };
  
  const handleZoomOut = () => {
    zoomOut({ duration: 300 });
  };
  
  const handleFitView = () => {
    fitView({ padding: 0.3, duration: 300 });
  };
  
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-1 rounded-md border shadow-sm">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFitView}>
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BottomToolbar;
