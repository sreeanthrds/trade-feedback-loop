
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useBacktestingStore } from './store/useBacktestingStore';
import BacktestTabHeader from './components/BacktestTabHeader';
import ConfigurationTab from './components/ConfigurationTab';
import ResultsTab from './components/ResultsTab';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const BacktestConfigPanel = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const { config, updateConfig, startBacktest, isRunning, results, resetResults } = useBacktestingStore();

  const handleStartBacktest = () => {
    resetResults();
    startBacktest();
  };

  return (
    <Card className="border-[#2A2F3C] bg-[#161923]/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-white">Strategy Backtest Configuration</CardTitle>
      </CardHeader>
      <div className="p-4 max-h-[calc(100vh-15rem)] overflow-y-auto">
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
    </Card>
  );
};

export default BacktestConfigPanel;
