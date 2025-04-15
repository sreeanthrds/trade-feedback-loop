
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BacktestResult } from '@/components/strategy/backtesting/types';
import RegimePerfHeatmap from './market-condition-analysis/RegimePerfHeatmap';
import MarketRegimeComparison from './market-condition-analysis/MarketRegimeComparison';
import VolatilityImpactChart from './market-condition-analysis/VolatilityImpactChart';
import SectorPerformanceBreakdown from './market-condition-analysis/SectorPerformanceBreakdown';

interface MarketConditionAnalysisProps {
  results: BacktestResult;
}

const MarketConditionAnalysis: React.FC<MarketConditionAnalysisProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RegimePerfHeatmap results={results} />
      <MarketRegimeComparison results={results} />
      <VolatilityImpactChart results={results} />
      <SectorPerformanceBreakdown results={results} />
    </div>
  );
};

export default MarketConditionAnalysis;
