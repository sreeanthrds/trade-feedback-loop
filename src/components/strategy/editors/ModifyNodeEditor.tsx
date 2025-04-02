
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
import ModifyPositionDialog from './modify-node/ModifyPositionDialog';
import { NodeDetailsPanel } from './shared';

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
      {/* Use NodeDetailsPanel for consistent node label editing */}
      <NodeDetailsPanel
        nodeLabel={node.data?.label || 'Modify Position'}
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

          {selectedPosition && (
            <PositionDetails 
              position={selectedPosition}
              onEditClick={openModificationDialog}
            />
          )}
        </CardContent>
      </Card>

      {/* Position Modification Dialog */}
      {currentPosition && (
        <ModifyPositionDialog
          position={currentPosition}
          isOpen={isDialogOpen}
          onClose={closeModificationDialog}
          onSave={saveModifiedPosition}
          onPositionChange={handlePositionChange}
        />
      )}
    </div>
  );
};

export default ModifyNodeEditor;
