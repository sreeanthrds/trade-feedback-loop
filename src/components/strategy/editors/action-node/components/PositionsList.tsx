
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Position } from '../types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PositionsListProps {
  positions: Position[];
  selectedPosition: Position | null;
  onSelectPosition: (position: Position) => void;
  onAddPosition: () => void;
  onDeletePosition: (id: string) => void;
}

const PositionsList: React.FC<PositionsListProps> = ({
  positions,
  selectedPosition,
  onSelectPosition,
  onAddPosition,
  onDeletePosition
}) => {
  const sortedPositions = [...positions].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Positions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddPosition}
          className="h-8 px-2 flex items-center gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Position</span>
        </Button>
      </div>
      
      {sortedPositions.length === 0 ? (
        <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
          No positions added. Click the button above to add your first position.
        </div>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {sortedPositions.map((position) => (
            <div 
              key={position.id} 
              className={`p-2 border rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
                selectedPosition?.id === position.id ? 'bg-accent border-primary' : ''
              }`}
              onClick={() => onSelectPosition(position)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedPosition?.id === position.id ? "default" : "outline"} className="px-1.5 py-0 h-5">
                    P{position.priority}
                  </Badge>
                  <span className="font-medium">
                    {position.positionType === 'buy' ? 'Buy' : 'Sell'} {position.lots || 1} lot{(position.lots || 1) > 1 ? 's' : ''}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePosition(position.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
              <div className="mt-1 flex gap-2 text-xs">
                {position.vpi && (
                  <span className="bg-primary/10 px-1.5 py-0.5 rounded">
                    VPI: {position.vpi}
                  </span>
                )}
                {position.vpt && (
                  <span className="bg-secondary/10 px-1.5 py-0.5 rounded">
                    Tag: {position.vpt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Separator />
    </div>
  );
};

export default PositionsList;
