
import React, { useCallback, useRef } from 'react';
import { Download } from 'lucide-react';
import { exportStrategyToFile } from '../../utils/import-export/fileOperations';
import ToolbarButton from './ToolbarButton';

interface ExportButtonProps {
  nodes: any[];
  edges: any[];
  strategyName: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ nodes, edges, strategyName }) => {
  const currentStrategyNameRef = useRef(strategyName);
  
  // Update ref when props change
  React.useEffect(() => {
    currentStrategyNameRef.current = strategyName;
  }, [strategyName]);

  const handleExport = useCallback(() => {
    exportStrategyToFile(nodes, edges, currentStrategyNameRef.current);
  }, [nodes, edges]);

  return (
    <ToolbarButton
      icon={Download}
      label="Export"
      onClick={handleExport}
    />
  );
};

export default ExportButton;
