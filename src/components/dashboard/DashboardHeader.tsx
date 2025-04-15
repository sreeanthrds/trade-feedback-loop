
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Share2, Download, Save, BarChart2 } from 'lucide-react';

interface DashboardHeaderProps {
  onClearResults: () => void;
}

const DashboardHeader = ({ onClearResults }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Options Strategy Backtest</h1>
        <p className="text-gray-400">
          AAPL Bull Put Spread • Jan 2023 - Dec 2023 • 42 Trades
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-[#2A2F3C] bg-[#161923]/60 hover:bg-[#1C202C]/60 text-gray-300">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-[#2A2F3C] bg-[#161923]/60 hover:bg-[#1C202C]/60 text-gray-300">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-[#2A2F3C] bg-[#161923]/60 hover:bg-[#1C202C]/60 text-gray-300">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearResults}
          className="ml-2 border-[#2A2F3C] bg-[#161923]/60 hover:bg-[#1C202C]/60 text-gray-300"
        >
          Clear
        </Button>
        <Button 
          size="sm" 
          onClick={() => navigate('/app/backtesting')}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
        >
          <BarChart2 className="h-4 w-4" />
          <span>New Backtest</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
