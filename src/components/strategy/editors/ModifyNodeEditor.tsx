
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Edit, AlertTriangle } from 'lucide-react';

interface Position {
  id: string;
  vpi: string;
  vpt: string;
  positionType: 'buy' | 'sell';
  lots?: number;
  orderType: 'market' | 'limit';
  productType: string;
  priority: number;
  limitPrice?: number;
  optionDetails?: {
    expiry: string;
    strikeType: string;
    strikeValue?: number;
    optionType: string;
  };
  // Add the sourceNodeId property
  sourceNodeId?: string;
}

interface ModifyNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ModifyNodeEditor: React.FC<ModifyNodeEditorProps> = ({ node, updateNodeData }) => {
  const nodes = useStrategyStore(state => state.nodes);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(node.data.targetPositionId);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Collect all positions from entry nodes
  useEffect(() => {
    const allPositions: Position[] = [];
    
    nodes.forEach(n => {
      if (n.type === 'entryNode' && Array.isArray(n.data.positions)) {
        n.data.positions.forEach((position: Position) => {
          // Add source node information to each position
          allPositions.push({
            ...position,
            sourceNodeId: n.id
          });
        });
      }
    });
    
    setPositions(allPositions);
    
    // If we have a previously selected position, find and select it again
    if (node.data.targetPositionId) {
      const position = allPositions.find(p => p.id === node.data.targetPositionId);
      if (position) {
        setSelectedPosition(position);
      } else {
        // If the selected position no longer exists, reset the selection
        setSelectedPosition(null);
        updateNodeData(node.id, { 
          targetPositionId: null,
          targetNodeId: null
        });
      }
    }
  }, [nodes]);

  const handlePositionSelect = (positionId: string) => {
    const position = positions.find(p => p.id === positionId);
    
    if (position) {
      setSelectedPositionId(positionId);
      setSelectedPosition(position);
      
      // Update the node data with the selected position and source node
      updateNodeData(node.id, {
        targetPositionId: positionId,
        targetNodeId: position.sourceNodeId,
      });
      
      toast({
        title: "Position selected",
        description: `Selected position ${position.vpi} for modification`
      });
    }
  };

  // Modify the label field
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Label htmlFor="label">Node Label</Label>
        <input
          id="label"
          className="border rounded p-1 flex-grow"
          value={node.data.label || ''}
          onChange={handleLabelChange}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Position Selection</CardTitle>
          <CardDescription>
            Select a position to modify from an Entry Node
          </CardDescription>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                No positions found. Create a position in an Entry Node first.
              </p>
            </div>
          ) : (
            <Select
              value={selectedPositionId || ''}
              onValueChange={handlePositionSelect}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a position to modify" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available positions</SelectLabel>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.vpi} - {position.positionType.toUpperCase()} - {position.orderType}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {selectedPosition && (
            <div className="mt-4 border rounded-md p-3">
              <h3 className="font-medium mb-2">Position Details</h3>
              
              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ID:</span>
                  <span className="text-sm">{selectedPosition.vpi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant={selectedPosition.positionType === 'buy' ? 'success' : 'destructive'}>
                    {selectedPosition.positionType.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Order:</span>
                  <span className="text-sm">{selectedPosition.orderType}</span>
                </div>
                {selectedPosition.orderType === 'limit' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Limit Price:</span>
                    <span className="text-sm">{selectedPosition.limitPrice}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quantity:</span>
                  <span className="text-sm">{selectedPosition.lots} lots</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Product:</span>
                  <span className="text-sm">{selectedPosition.productType}</span>
                </div>
                {selectedPosition.optionDetails && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Expiry:</span>
                      <span className="text-sm">{selectedPosition.optionDetails.expiry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Strike:</span>
                      <span className="text-sm">{selectedPosition.optionDetails.strikeType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Option:</span>
                      <span className="text-sm">{selectedPosition.optionDetails.optionType}</span>
                    </div>
                  </>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Source:</span>
                  <span className="text-sm">{selectedPosition.sourceNodeId}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t">
                <Button size="sm" className="w-full flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Modifications
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModifyNodeEditor;
