
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import BacktestResultsSection from './BacktestResultsSection';
import { BacktestResult } from '../types';

interface ResultsTabProps {
  results: BacktestResult | null;
  resetResults: () => void;
  setActiveTab: (tab: string) => void;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ 
  results, 
  resetResults, 
  setActiveTab 
}) => {
  return (
    <TabsContent value="results">
      <BacktestResultsSection 
        results={results} 
        resetResults={resetResults} 
        onChangeTab={setActiveTab} 
      />
    </TabsContent>
  );
};

export default ResultsTab;
