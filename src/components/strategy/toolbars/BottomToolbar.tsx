
import React from 'react';
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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    importStrategyFromEvent(event, setNodes, setEdges, addHistoryItem, resetHistory);
  };

  const handleSave = () => {
    saveStrategyToLocalStorage(nodes, edges);
  };

  const handleExport = () => {
    exportStrategyToFile(nodes, edges);
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
        <div className="relative">
          <Button variant="secondary">
            <Upload className="mr-1 h-4 w-4" />
            Import
          </Button>
          <label htmlFor="import-strategy" className="absolute inset-0 cursor-pointer">
            <input
              id="import-strategy"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
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
