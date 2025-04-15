
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import TimeSettingsCard from './TimeSettingsCard';
import CapitalRiskCard from './CapitalRiskCard';
import ExecutionSettingsCard from './ExecutionSettingsCard';
import { BacktestingConfig } from '../types';

interface ConfigurationTabProps {
  config: BacktestingConfig;
  updateConfig: (updates: Partial<BacktestingConfig>) => void;
  startBacktest: () => void;
  isRunning: boolean;
}

const ConfigurationTab: React.FC<ConfigurationTabProps> = ({ 
  config, 
  updateConfig, 
  startBacktest, 
  isRunning 
}) => {
  return (
    <TabsContent value="settings" className="space-y-4">
      <TimeSettingsCard config={config} updateConfig={updateConfig} />
      <CapitalRiskCard config={config} updateConfig={updateConfig} />
      <ExecutionSettingsCard 
        config={config} 
        updateConfig={updateConfig} 
        onStartBacktest={startBacktest} 
        isRunning={isRunning} 
      />
    </TabsContent>
  );
};

export default ConfigurationTab;
