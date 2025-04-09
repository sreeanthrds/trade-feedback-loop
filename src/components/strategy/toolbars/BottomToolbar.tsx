
import React, { useRef, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Panel } from '@xyflow/react';
import { Save, Download, Upload, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  exportStrategyToFile, 
  importStrategyFromEvent
} from '../utils/import-export/fileOperations';
import { saveStrategyToLocalStorage } from '../utils/storage/localStorageUtils';
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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isImporting) {
      console.log("Import already in progress, ignoring");
      return;
    }
    
    setIsImporting(true);
    console.log(`Starting import process for strategy: ${strategyId} - ${strategyName}`);
    
    try {
      // Show loading toast
      toast({
        title: "Importing strategy",
        description: "Please wait while we process your file..."
      });
      
      // Important: Clear the file input value first to ensure we can import the same file again
      if (fileInputRef.current) {
        const filePath = fileInputRef.current.value;
        console.log("Current file input path:", filePath);
      }
      
      // Clear existing nodes and edges first to prevent conflicts
      setNodes([]);
      setEdges([]);
      
      // Force a brief delay to ensure React state is updated before import
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Perform the import operation with current strategy context
      const result = await importStrategyFromEvent(
        event, 
        setNodes, 
        setEdges, 
        addHistoryItem, 
        resetHistory,
        strategyId,
        strategyName
      );
      
      console.log("Import completed with result:", result);
      
      // Reset the input value so the same file can be imported again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call the success handler with a delay to ensure state has propagated
      if (result && onImportSuccess) {
        // Delay to allow state updates to complete
        setTimeout(() => {
          console.log("Calling onImportSuccess callback with delay");
          onImportSuccess();
        }, 300); // Increased delay for better state propagation
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
      }, 800);
    }
  };

  const handleSave = () => {
    if (!strategyId) {
      console.error("Cannot save strategy without ID");
      toast({
        title: "Save failed",
        description: "Strategy ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    // Save to localStorage with ID and name - pass the entire nodes and edges objects
    saveStrategyToLocalStorage(nodes, edges, strategyId, strategyName);
    
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
    exportStrategyToFile(nodes, edges, strategyName);
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
        <Button variant="secondary" onClick={triggerFileInput} disabled={isImporting}>
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
