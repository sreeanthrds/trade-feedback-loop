
import React from 'react';
import { Node } from '@xyflow/react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useModifyPositions, usePositionSelection } from '@/hooks/useModifyPositions';
import { usePositionModification } from '@/hooks/usePositionModification';
import PositionSelector from './modify-node/PositionSelector';
import PositionDetails from './modify-node/PositionDetails';
import { NodeDetailsPanel } from './shared';
import PositionEditor from './action-node/components/PositionEditor';
import { Separator } from '@/components/ui/separator';
import { adaptPosition } from '@/components/strategy/types/position-types';

interface ModifyNodeEditorProps {
  node: Node;
  updateNodeData: (id: string, data: any) => void;
}

const ModifyNodeEditor: React.FC<ModifyNodeEditorProps> = ({ node, updateNodeData }) => {
  // Use our custom hooks
  const {
    positions,
    selectedPosition,
    selectedPositionId,
    setSelectedPositionId,
    setSelectedPosition
  } = useModifyPositions(node);

  const {
    handlePositionSelect,
    handleLabelChange
  } = usePositionSelection(
    node, 
    updateNodeData,
    positions,
    setSelectedPositionId,
    setSelectedPosition
  );

  const {
    handlePositionChange,
    saveModifiedPosition
  } = usePositionModification(node, updateNodeData);

  // For position handlers
  const handlePositionTypeChange = (value: string) => {
    if (!selectedPosition) return;
    handlePositionChange({ positionType: value as 'buy' | 'sell' });
  };
  
  const handleOrderTypeChange = (value: string) => {
    if (!selectedPosition) return;
    handlePositionChange({ orderType: value as 'market' | 'limit' });
  };
  
  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPosition) return;
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    handlePositionChange({ limitPrice: value });
  };
  
  const handleLotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPosition) return;
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    handlePositionChange({ lots: value });
  };
  
  const handleProductTypeChange = (value: string) => {
    if (!selectedPosition) return;
    handlePositionChange({ productType: value as 'intraday' | 'carryForward' });
  };
  
  const handleExpiryChange = (value: string) => {
    if (!selectedPosition || !selectedPosition.optionDetails) return;
    
    handlePositionChange({ 
      optionDetails: {
        ...selectedPosition.optionDetails,
        expiry: value 
      }
    });
  };
  
  const handleStrikeTypeChange = (value: string) => {
    if (!selectedPosition || !selectedPosition.optionDetails) return;
    
    handlePositionChange({ 
      optionDetails: {
        ...selectedPosition.optionDetails,
        strikeType: value 
      }
    });
  };
  
  const handleStrikeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPosition || !selectedPosition.optionDetails) return;
    
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    handlePositionChange({ 
      optionDetails: {
        ...selectedPosition.optionDetails,
        strikeValue: value 
      }
    });
  };
  
  const handleOptionTypeChange = (value: string) => {
    if (!selectedPosition || !selectedPosition.optionDetails) return;
    
    // Make sure value is only "CE" or "PE"
    if (value !== "CE" && value !== "PE") return;
    
    handlePositionChange({ 
      optionDetails: {
        ...selectedPosition.optionDetails,
        optionType: value as "CE" | "PE"
      }
    });
  };

  // Safe access to node.data.label with default value to fix type issue
  const nodeLabel = typeof node.data?.label === 'string' ? node.data.label : 'Modify Position';

  return (
    <div className="space-y-4">
      {/* Use NodeDetailsPanel for consistent node label editing */}
      <NodeDetailsPanel
        nodeLabel={nodeLabel}
        onLabelChange={handleLabelChange}
        infoTooltip="Modify Nodes can change the parameters of existing positions"
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Position Selection</CardTitle>
          <CardDescription>
            Select a position to modify from an Entry Node
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PositionSelector
            positions={positions}
            selectedPositionId={selectedPositionId || ''}
            onSelect={handlePositionSelect}
          />
        </CardContent>
      </Card>

      {/* Display position editor directly when a position is selected */}
      {selectedPosition && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Edit Position {selectedPosition.vpi || ''}</CardTitle>
            <CardDescription>
              Modify parameters for {selectedPosition.positionType || 'buy'} {selectedPosition.orderType || 'market'} order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PositionEditor
              position={adaptPosition(selectedPosition)}
              hasOptionTrading={!!selectedPosition.optionDetails}
              isEntryNode={false}
              onPositionChange={handlePositionChange}
              onPositionTypeChange={handlePositionTypeChange}
              onOrderTypeChange={handleOrderTypeChange}
              onLimitPriceChange={handleLimitPriceChange}
              onLotsChange={handleLotsChange}
              onProductTypeChange={handleProductTypeChange}
              onExpiryChange={handleExpiryChange}
              onStrikeTypeChange={handleStrikeTypeChange}
              onStrikeValueChange={handleStrikeValueChange}
              onOptionTypeChange={handleOptionTypeChange}
            />
            
            <Separator className="my-4" />
            
            <div className="flex justify-end">
              <button 
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                onClick={saveModifiedPosition}
              >
                Save Changes
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModifyNodeEditor;
