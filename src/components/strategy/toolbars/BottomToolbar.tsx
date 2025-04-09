
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Panel } from '@xyflow/react';
import { Save, Download, Upload, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  exportStrategyToFile, 
  importStrategyFromEvent
} from '../utils/import-export/fileOperations';
import { saveStrategyToLocalStorage } from '../utils/storage/operations/saveStrategy';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { useBacktestingStore } from '../backtesting/useBacktestingStore';
import { useToast } from "@/hooks/use-toast";

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
  const [isImporting, setIsImporting] = useState(false);
  const strategyId = searchParams.get('id') || '';
  const strategyName = searchParams.get('name') || 'Untitled Strategy';
  const { toast } = useToast();
  
  const currentStrategyIdRef = useRef(strategyId);
  const currentStrategyNameRef = useRef(strategyName);
  
  useEffect(() => {
    currentStrategyIdRef.current = strategyId;
    currentStrategyNameRef.current = strategyName;
    
    setIsImporting(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    console.log(`BottomToolbar: Strategy context updated - ID: ${strategyId}, Name: ${strategyName}`);
  }, [strategyId, strategyName]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isImporting) {
      console.log("Import already in progress, ignoring");
      return;
    }
    
    if (!currentStrategyIdRef.current) {
      console.error("Cannot import without a strategy ID");
      toast({
        title: "Import failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    console.log(`Starting import process for strategy: ${currentStrategyIdRef.current} - ${currentStrategyNameRef.current}`);
    console.log(`Current state before import: ${nodes.length} nodes, ${edges.length} edges`);
    
    try {
      toast({
        title: "Importing strategy",
        description: "Please wait while we process your file..."
      });
      
      console.log(`Importing with strategy ID: ${currentStrategyIdRef.current}`);
      const result = await importStrategyFromEvent(
        event, 
        setNodes, 
        setEdges, 
        addHistoryItem, 
        resetHistory,
        currentStrategyIdRef.current,
        currentStrategyNameRef.current
      );
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      console.log(`After importStrategyFromEvent: ${nodes.length} nodes, ${edges.length} edges`);
      console.log("Current edges after import:", JSON.stringify(edges));
      
      if (result && onImportSuccess) {
        console.log("Import was successful, calling onImportSuccess callback in 700ms");
        setTimeout(() => {
          console.log("Calling onImportSuccess callback");
          onImportSuccess();
        }, 700);
      }
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Import failed",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        console.log("Resetting importing state");
        setIsImporting(false);
      }, 1000);
    }
  }, [addHistoryItem, onImportSuccess, resetHistory, setEdges, setNodes, toast, isImporting, nodes, edges]);

  const handleSave = useCallback(() => {
    if (!currentStrategyIdRef.current) {
      console.error("Cannot save strategy without ID");
      toast({
        title: "Save failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`Saving strategy with ID: ${currentStrategyIdRef.current}`);
    saveStrategyToLocalStorage(nodes, edges, currentStrategyIdRef.current, currentStrategyNameRef.current);
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: `strategy_${currentStrategyIdRef.current}`,
      newValue: localStorage.getItem(`strategy_${currentStrategyIdRef.current}`)
    }));
    
    toast({
      title: "Strategy saved",
      description: "Your strategy has been saved"
    });
  }, [nodes, edges, toast]);

  const handleExport = useCallback(() => {
    exportStrategyToFile(nodes, edges, currentStrategyNameRef.current);
  }, [nodes, edges]);
  
  const handleReset = useCallback(async () => {
    if (!currentStrategyIdRef.current) {
      console.error("Cannot reset strategy without ID");
      toast({
        title: "Reset failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`Resetting strategy with ID: ${currentStrategyIdRef.current}`);
    
    localStorage.removeItem(`strategy_${currentStrategyIdRef.current}`);
    
    resetStrategy();
    
    toast({
      title: "Strategy reset",
      description: "Your strategy has been reset to default"
    });
  }, [resetStrategy, toast]);

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  const handleBacktestClick = useCallback(() => {
    console.log("Backtest button clicked, toggleBacktest exists:", !!toggleBacktest);
    
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
        <Button 
          variant="secondary" 
          onClick={triggerFileInput} 
          disabled={isImporting}
        >
          <Upload className="mr-1 h-4 w-4" />
          {isImporting ? 'Importing...' : 'Import'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
            disabled={isImporting}
          />
        </Button>
        <Button variant="secondary" onClick={handleReset}>
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
