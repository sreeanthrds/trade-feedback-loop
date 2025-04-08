
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface StrategiesHeaderProps {
  onRefresh: () => void;
  onCreateStrategy: () => void;
}

const StrategiesHeader = ({ onRefresh, onCreateStrategy }: StrategiesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">My Strategies</h1>
        <p className="text-muted-foreground">
          Create, manage and backtest your trading strategies
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          title="Refresh strategies list"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button onClick={onCreateStrategy} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Strategy</span>
        </Button>
      </div>
    </div>
  );
};

export default StrategiesHeader;
