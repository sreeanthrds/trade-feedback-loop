
import React, { useRef } from 'react';
import { Panel } from '@xyflow/react';
import { Save, Download, Upload, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  saveStrategyToLocalStorage, 
  exportStrategyToFile, 
  importStrategyFromEvent
} from '../utils/flowUtils';
import { useStrategyStore } from '@/hooks/use-strategy-store';

interface BottomToolbarProps {
  resetStrategy: () => void;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({ resetStrategy }) => {
  const { nodes, edges, setNodes, setEdges, addHistoryItem, resetHistory } = useStrategyStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    importStrategyFromEvent(event, setNodes, setEdges, addHistoryItem, resetHistory);
    // Reset the input value so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    saveStrategyToLocalStorage(nodes, edges);
  };

  const handleExport = () => {
    exportStrategyToFile(nodes, edges);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Panel position="bottom-center">
      <div className="flex gap-2 bg-background/90 p-2 rounded-md shadow-md">
        <Button variant="secondary" onClick={handleSave}>
          <Save className="mr-1 h-4 w-4" />
          Save
        </Button>
        <Button variant="secondary" onClick={handleExport}>
          <Download className="mr-1 h-4 w-4" />
          Export
        </Button>
        <Button variant="secondary" onClick={triggerFileInput}>
          <Upload className="mr-1 h-4 w-4" />
          Import
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </Button>
        <Button variant="secondary" onClick={resetStrategy}>
          <RotateCcw className="mr-1 h-4 w-4" />
          Reset
        </Button>
        <Button>
          <Play className="mr-1 h-4 w-4" />
          Backtest
        </Button>
      </div>
    </Panel>
  );
};

export default BottomToolbar;
