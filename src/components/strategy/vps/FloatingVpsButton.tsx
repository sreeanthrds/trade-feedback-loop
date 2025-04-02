
import React from 'react';
import { Button } from '@/components/ui/button';
import { useVpsStore } from '@/hooks/useVpsStore';
import { Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const FloatingVpsButton: React.FC = () => {
  const { toggle, positions } = useVpsStore();
  const positionCount = positions.length;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggle}
        className="h-12 w-12 rounded-full shadow-lg"
        size="icon"
        variant="default"
      >
        <Layers className="h-5 w-5" />
        {positionCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
          >
            {positionCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default FloatingVpsButton;
