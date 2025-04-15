
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import MarketRegimeHeatmap from './market-condition-analysis/MarketRegimeHeatmap';
import MarketRegimeComparison from './market-condition-analysis/MarketRegimeComparison';
import VolatilityRegimeAnalysis from './market-condition-analysis/VolatilityRegimeAnalysis';
import SectorPerformanceBreakdown from './market-condition-analysis/SectorPerformanceBreakdown';
import SectorRotationImpact from './market-condition-analysis/SectorRotationImpact';
import CorrelationAnalysis from './market-condition-analysis/CorrelationAnalysis';

interface MarketConditionAnalysisProps {
  results: BacktestResult;
}

const MarketConditionAnalysis: React.FC<MarketConditionAnalysisProps> = ({ results }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Market Condition Analysis</h2>
      <p className="text-muted-foreground">
        Analyze how your strategy performs across different market conditions, volatility regimes, and sectors.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketRegimeHeatmap results={results} />
        <MarketRegimeComparison results={results} />
        <VolatilityRegimeAnalysis results={results} />
        <CorrelationAnalysis results={results} />
        <SectorPerformanceBreakdown results={results} />
        <SectorRotationImpact results={results} />
      </div>
    </div>
  );
};

export default MarketConditionAnalysis;
