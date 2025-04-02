
import React from 'react';
import { Node } from '@xyflow/react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useModifyPositions, usePositionSelection } from '@/hooks/useModifyPositions';
import { usePositionModification } from '@/hooks/usePositionModification';
import PositionSelector from './modify-node/PositionSelector';
import PositionDetails from './modify-node/PositionDetails';
import ModifyPositionDialog from './modify-node/ModifyPositionDialog';

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
    isDialogOpen,
    currentPosition,
    openModificationDialog,
    closeModificationDialog,
    handlePositionChange,
    saveModifiedPosition
  } = usePositionModification(node, updateNodeData);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Label htmlFor="label">Node Label</Label>
        <input
          id="label"
          className="border rounded p-1 flex-grow"
          value={node.data?.label || ''}
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
          <PositionSelector
            positions={positions}
            selectedPositionId={selectedPositionId || ''}
            onSelect={(value: string) => handlePositionSelect(value)}
          />

          {selectedPosition && (
            <PositionDetails 
              position={selectedPosition}
              onEditClick={openModificationDialog}
            />
          )}
        </CardContent>
      </Card>

      {/* Position Modification Dialog */}
      <ModifyPositionDialog
        position={currentPosition}
        isOpen={isDialogOpen}
        onClose={closeModificationDialog}
        onSave={saveModifiedPosition}
        onPositionChange={handlePositionChange}
      />
    </div>
  );
};

export default ModifyNodeEditor;
