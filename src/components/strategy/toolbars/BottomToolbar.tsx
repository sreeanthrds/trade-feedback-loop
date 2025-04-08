
import React, { useRef, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Panel } from '@xyflow/react';
import { Save, Download, Upload, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  saveStrategyToLocalStorage, 
  exportStrategyToFile, 
  importStrategyFromEvent
} from '../utils/flowUtils';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { useBacktestingStore } from '../backtesting/useBacktestingStore';
import { toast } from "@/hooks/use-toast";

interface BottomToolbarProps {
  resetStrategy: () => void;
  onImportSuccess?: () => void;
  toggleBacktest?: () => void;
}

const BottomToolbar: React.FC<BottomToolbarProps> = ({ 
  resetStrategy, 
  onImportSuccess,
  toggleBacktest 
}) => {
  const { nodes, edges, setNodes, setEdges, addHistoryItem, resetHistory } = useStrategyStore();
  const { isRunning } = useBacktestingStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const strategyId = searchParams.get('id');
  const strategyName = searchParams.get('name') || 'Untitled Strategy';

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const success = importStrategyFromEvent(event, setNodes, setEdges, addHistoryItem, resetHistory);
    // Reset the input value so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Notify parent component that import was successful
    if (success && onImportSuccess) {
      onImportSuccess();
    }
  };

  const handleSave = () => {
    saveStrategyToLocalStorage(nodes, edges, strategyId || undefined, strategyName);
    toast({
      title: "Strategy saved",
      description: "Your strategy has been saved locally"
    });
  };

  const handleExport = () => {
    exportStrategyToFile(nodes, edges);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBacktestClick = useCallback(() => {
    console.log("Backtest button clicked, toggleBacktest exists:", !!toggleBacktest);
    
    // Only toggle the backtest panel, don't start the backtest
    if (toggleBacktest) {
      toggleBacktest();
    }
  }, [toggleBacktest]);

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
        <Button onClick={handleBacktestClick} disabled={isRunning}>
          <Play className="mr-1 h-4 w-4" />
          {isRunning ? 'Running...' : 'Backtest'}
        </Button>
      </div>
    </Panel>
  );
};

export default BottomToolbar;
