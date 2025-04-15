
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useBacktestingStore } from './store/useBacktestingStore';
import BacktestTabHeader from './components/BacktestTabHeader';
import ConfigurationTab from './components/ConfigurationTab';
import ResultsTab from './components/ResultsTab';

const BacktestConfigPanel = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const { config, updateConfig, startBacktest, isRunning, results, resetResults } = useBacktestingStore();

  const handleStartBacktest = () => {
    resetResults();
    startBacktest();
  };

  return (
    <div className="p-4 border-t border-border max-h-[calc(100vh-10rem)] overflow-y-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <BacktestTabHeader activeTab={activeTab} />
        
        <ConfigurationTab 
          config={config}
          updateConfig={updateConfig}
          startBacktest={handleStartBacktest}
          isRunning={isRunning}
        />
        
        <ResultsTab 
          results={results}
          resetResults={resetResults}
          setActiveTab={setActiveTab}
        />
      </Tabs>
    </div>
  );
};

export default BacktestConfigPanel;
