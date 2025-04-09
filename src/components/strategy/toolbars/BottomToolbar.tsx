
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
  const importProcessingRef = useRef(false);
  const currentStrategyIdRef = useRef(strategyId);
  const currentStrategyNameRef = useRef(strategyName);
  
  // Update refs when strategy ID/name changes
  useEffect(() => {
    currentStrategyIdRef.current = strategyId;
    currentStrategyNameRef.current = strategyName;
    
    // Reset import status when strategy ID changes
    setIsImporting(false);
    importProcessingRef.current = false;
    
    // Clear file input when strategy changes
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    console.log(`BottomToolbar: Strategy context updated - ID: ${strategyId}, Name: ${strategyName}`);
  }, [strategyId, strategyName]);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isImporting || importProcessingRef.current) {
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
    importProcessingRef.current = true;
    console.log(`Starting import process for strategy: ${currentStrategyIdRef.current} - ${currentStrategyNameRef.current}`);
    
    try {
      // Show loading toast
      toast({
        title: "Importing strategy",
        description: "Please wait while we process your file..."
      });
      
      // Important: Clear the file input value first to ensure we can import the same file again
      const filePath = fileInputRef.current?.value;
      console.log("Current file input path:", filePath);
      
      // CRITICAL: Clear existing nodes and edges first to prevent conflicts
      console.log("Explicitly clearing nodes and edges before import");
      setNodes([]);
      await new Promise(resolve => setTimeout(resolve, 100));
      setEdges([]);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // CRITICAL: Perform the import with explicit, current strategy context
      // This ensures import is isolated to this strategy
      console.log(`Importing with explicit strategy ID: ${currentStrategyIdRef.current}`);
      const result = await importStrategyFromEvent(
        event, 
        setNodes, 
        setEdges, 
        addHistoryItem, 
        resetHistory,
        currentStrategyIdRef.current,
        currentStrategyNameRef.current
      );
      
      console.log("Import completed with result:", result);
      
      // Reset the input value so the same file can be imported again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call the success handler with a delay to ensure state has propagated
      if (result && onImportSuccess) {
        // Longer delay to allow state updates to complete
        setTimeout(() => {
          console.log("Calling onImportSuccess callback with delay");
          onImportSuccess();
        }, 800);
      }
    } catch (error) {
      console.error("Error during import:", error);
      toast({
        title: "Import failed",
        description: "An unexpected error occurred during import",
        variant: "destructive"
      });
    } finally {
      // Set importing to false after a delay to prevent rapid re-imports
      setTimeout(() => {
        setIsImporting(false);
        importProcessingRef.current = false;
      }, 1000);
    }
  };

  const handleSave = () => {
    if (!currentStrategyIdRef.current) {
      console.error("Cannot save strategy without ID");
      toast({
        title: "Save failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    // Save to localStorage with current strategy context
    console.log(`Explicitly saving strategy with ID: ${currentStrategyIdRef.current}`);
    saveStrategyToLocalStorage(nodes, edges, currentStrategyIdRef.current, currentStrategyNameRef.current);
    
    // Trigger storage event to update strategies list
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'strategies'
    }));
    
    toast({
      title: "Strategy saved",
      description: "Your strategy has been saved"
    });
  };

  const handleExport = () => {
    exportStrategyToFile(nodes, edges, currentStrategyNameRef.current);
  };
  
  const handleReset = async () => {
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
    
    // First clear all nodes and edges
    setNodes([]);
    await new Promise(resolve => setTimeout(resolve, 50));
    setEdges([]);
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Then remove the strategy from localStorage
    localStorage.removeItem(`strategy_${currentStrategyIdRef.current}`);
    
    // Now run the reset function which will reinitialize with default nodes
    resetStrategy();
    
    toast({
      title: "Strategy reset",
      description: "Your strategy has been reset to default"
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      // Reset the input value before triggering click
      fileInputRef.current.value = '';
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
        <Button 
          variant="secondary" 
          onClick={triggerFileInput} 
          disabled={isImporting || importProcessingRef.current}
        >
          <Upload className="mr-1 h-4 w-4" />
          {isImporting ? 'Importing...' : 'Import'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
            disabled={isImporting || importProcessingRef.current}
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
