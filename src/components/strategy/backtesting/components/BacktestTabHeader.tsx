
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Settings } from 'lucide-react';

interface BacktestTabHeaderProps {
  activeTab: string;
}

const BacktestTabHeader: React.FC<BacktestTabHeaderProps> = ({ activeTab }) => {
  return (
    <div className="flex justify-between items-center mb-4 sticky top-0 bg-background pt-2 pb-4 z-10">
      <h3 className="text-lg font-medium">Backtest Configuration</h3>
      <TabsList>
        <TabsTrigger value="settings" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
        <TabsTrigger value="results" className="flex items-center gap-1">
          <BarChart className="h-4 w-4" />
          <span className="hidden sm:inline">Results</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default BacktestTabHeader;
