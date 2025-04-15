
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Panel } from '@xyflow/react';
import { useStrategyStore } from '@/hooks/use-strategy-store';
import { useBacktestingStore } from '../backtesting/store';
import SaveButton from './bottom-toolbar/SaveButton';
import ExportButton from './bottom-toolbar/ExportButton';
import ImportButton from './bottom-toolbar/ImportButton';
import ResetButton from './bottom-toolbar/ResetButton';
import BacktestButton from './bottom-toolbar/BacktestButton';

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
  const [searchParams] = useSearchParams();
  
  const strategyId = searchParams.get('id') || '';
  const strategyName = searchParams.get('name') || 'Untitled Strategy';
  
  const currentStrategyIdRef = useRef(strategyId);
  const currentStrategyNameRef = useRef(strategyName);
  
  useEffect(() => {
    currentStrategyIdRef.current = strategyId;
    currentStrategyNameRef.current = strategyName;
    
    console.log(`BottomToolbar: Strategy context updated - ID: ${strategyId}, Name: ${strategyName}`);
  }, [strategyId, strategyName]);

  return (
    <Panel position="bottom-center">
      <div className="flex gap-2 bg-background/90 p-2 rounded-md shadow-md">
        <SaveButton 
          nodes={nodes} 
          edges={edges} 
          strategyId={strategyId} 
          strategyName={strategyName} 
        />
        <ExportButton 
          nodes={nodes} 
          edges={edges} 
          strategyName={strategyName} 
        />
        <ImportButton 
          setNodes={setNodes} 
          setEdges={setEdges} 
          addHistoryItem={addHistoryItem} 
          resetHistory={resetHistory}
          strategyId={strategyId}
          strategyName={strategyName}
          onImportSuccess={onImportSuccess}
        />
        <ResetButton 
          resetStrategy={resetStrategy} 
          strategyId={strategyId} 
        />
        <BacktestButton 
          toggleBacktest={toggleBacktest} 
          isRunning={isRunning} 
        />
      </div>
    </Panel>
  );
};

export default BottomToolbar;
