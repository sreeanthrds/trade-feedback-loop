
import React, { useEffect } from 'react';
import { useVpsStore } from '@/hooks/useVpsStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import PositionCard from './PositionCard';
import { useStrategyStore } from '@/hooks/strategy-store/use-strategy-store';
import { Position } from '@/components/strategy/types/position-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { ExitNodeData } from '@/components/strategy/editors/action-node/exit-node/types';

// Define types for node data to avoid "unknown" type errors
interface NodeData {
  positions?: Position[];
  exitNodeData?: ExitNodeData;
  retryConfig?: {
    groupNumber: number;
    maxReEntries: number;
  };
}

const VisualPositionStore: React.FC = () => {
  const { isOpen, toggle, positions, setPositions } = useVpsStore();
  const nodes = useStrategyStore((state) => state.nodes);
  
  // Extract positions from all nodes when nodes change and clear any stale positions
  useEffect(() => {
    // Clear positions first to avoid showing stale data
    setPositions([]);
    
    // Only extract positions from nodes that exist in the flow
    const allPositions = nodes.reduce<Position[]>((acc, node) => {
      // Add proper type assertion for node.data
      const nodeData = node.data as NodeData;
      
      if (nodeData?.positions && Array.isArray(nodeData.positions) && nodeData.positions.length > 0) {
        // Process positions to include re-entry information
        const processedPositions = nodeData.positions.map(pos => {
          const position = { ...pos, sourceNodeId: node.id };
          
          // Check if the node has re-entry configuration in the post-execution settings
          if (nodeData.exitNodeData && nodeData.exitNodeData.postExecutionConfig) {
            const postExec = nodeData.exitNodeData.postExecutionConfig;
            
            // Check each post-execution feature for re-entry
            if (postExec.stopLoss?.reEntry?.enabled) {
              position.reEntry = {
                enabled: true,
                groupNumber: postExec.stopLoss.reEntry.groupNumber || 1,
                maxReEntries: postExec.stopLoss.reEntry.maxReEntries || 1,
                currentReEntryCount: 0
              };
            } 
            else if (postExec.trailingStop?.reEntry?.enabled) {
              position.reEntry = {
                enabled: true,
                groupNumber: postExec.trailingStop.reEntry.groupNumber || 1,
                maxReEntries: postExec.trailingStop.reEntry.maxReEntries || 1,
                currentReEntryCount: 0
              };
            }
            else if (postExec.takeProfit?.reEntry?.enabled) {
              position.reEntry = {
                enabled: true,
                groupNumber: postExec.takeProfit.reEntry.groupNumber || 1,
                maxReEntries: postExec.takeProfit.reEntry.maxReEntries || 1,
                currentReEntryCount: 0
              };
            }
          }
          
          // Check for dedicated retry nodes (handle nodes of type 'retryNode')
          if (node.type === 'retryNode' && nodeData.retryConfig) {
            position.reEntry = {
              enabled: true,
              groupNumber: nodeData.retryConfig.groupNumber || 1,
              maxReEntries: nodeData.retryConfig.maxReEntries || 1,
              currentReEntryCount: 0
            };
          }
          
          return position;
        });
        
        return [...acc, ...processedPositions];
      }
      return acc;
    }, []);
    
    // Only update if there are valid positions
    setPositions(allPositions);
    
    // Log for debugging
    console.log('VPS: Updated positions from nodes with re-entry info', allPositions);
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
                  <div className="flex flex-col h-32 items-center justify-center border rounded-md border-dashed text-muted-foreground p-4">
                    <Alert variant="default" className="bg-muted/50 border-none">
                      <Info className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        No positions have been created yet. Add entry positions from action nodes to see them here.
                      </AlertDescription>
                    </Alert>
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
