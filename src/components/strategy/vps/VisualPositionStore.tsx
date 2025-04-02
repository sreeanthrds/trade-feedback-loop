
import React, { useEffect } from 'react';
import { useVpsStore } from '@/hooks/useVpsStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import PositionCard from './PositionCard';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';

const VisualPositionStore: React.FC = () => {
  const { isOpen, toggle, positions, setPositions } = useVpsStore();
  const nodes = useStrategyStore((state) => state.nodes);
  
  // Extract positions from all nodes when nodes change
  useEffect(() => {
    const allPositions = nodes.reduce<any[]>((acc, node) => {
      if (node.data?.positions?.length) {
        return [...acc, ...node.data.positions];
      }
      return acc;
    }, []);
    
    // Only update if there are actual changes
    if (allPositions.length > 0) {
      setPositions(allPositions);
    }
  }, [nodes, setPositions]);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={toggle}>
        <SheetContent side="right" className="w-[350px] sm:w-[450px]">
          <SheetHeader>
            <SheetTitle>Visual Position Store</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-4 pr-4">
                {positions.length > 0 ? (
                  positions.map((position) => (
                    <PositionCard key={position.id} position={position} />
                  ))
                ) : (
                  <div className="flex h-32 items-center justify-center border rounded-md border-dashed text-muted-foreground">
                    No positions created yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default VisualPositionStore;
