
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import EnhancedNumberInput from '@/components/ui/form/enhanced/EnhancedNumberInput';
import { BacktestingConfig } from '../types';

interface ExecutionSettingsCardProps {
  config: BacktestingConfig;
  updateConfig: (updates: Partial<BacktestingConfig>) => void;
  onStartBacktest: () => void;
  isRunning: boolean;
}

const ExecutionSettingsCard: React.FC<ExecutionSettingsCardProps> = ({ 
  config, 
  updateConfig, 
  onStartBacktest, 
  isRunning 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Execution Settings</CardTitle>
        <CardDescription>Configure execution parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Slippage (%)</FormLabel>
            <EnhancedNumberInput
              value={config.slippagePercentage}
              onChange={(value) => updateConfig({ slippagePercentage: value || 0 })}
              min={0}
              max={10}
              step={0.01}
            />
          </div>
          
          <div className="space-y-2">
            <FormLabel>Commission (%)</FormLabel>
            <EnhancedNumberInput
              value={config.commissionPercentage}
              onChange={(value) => updateConfig({ commissionPercentage: value || 0 })}
              min={0}
              max={10}
              step={0.01}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="optimization"
            checked={config.enableOptimization}
            onCheckedChange={(checked) => updateConfig({ enableOptimization: checked })}
          />
          <FormLabel htmlFor="optimization" className="cursor-pointer">
            Enable Parameter Optimization
          </FormLabel>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onStartBacktest}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Backtest
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Backtest
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExecutionSettingsCard;
