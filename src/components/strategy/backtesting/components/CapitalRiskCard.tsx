
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import EnhancedNumberInput from '@/components/ui/form/enhanced/EnhancedNumberInput';
import { BacktestingConfig } from '../types';

interface CapitalRiskCardProps {
  config: BacktestingConfig;
  updateConfig: (updates: Partial<BacktestingConfig>) => void;
}

const CapitalRiskCard: React.FC<CapitalRiskCardProps> = ({ config, updateConfig }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Capital & Risk</CardTitle>
        <CardDescription>Configure capital and risk parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel>Initial Capital</FormLabel>
            <EnhancedNumberInput
              value={config.initialCapital}
              onChange={(value) => updateConfig({ initialCapital: value || 10000 })}
              min={1000}
              step={1000}
            />
          </div>
          
          <div className="space-y-2">
            <FormLabel>Risk Per Trade (%)</FormLabel>
            <EnhancedNumberInput
              value={config.riskPerTrade}
              onChange={(value) => updateConfig({ riskPerTrade: value || 1 })}
              min={0.1}
              max={100}
              step={0.1}
            />
          </div>
          
          <div className="space-y-2">
            <FormLabel>Max Open Positions</FormLabel>
            <EnhancedNumberInput
              value={config.maxOpenPositions}
              onChange={(value) => updateConfig({ maxOpenPositions: value || 1 })}
              min={1}
              max={100}
              step={1}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapitalRiskCard;
