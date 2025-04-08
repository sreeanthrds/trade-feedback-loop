
import React from 'react';
import StrategyCard from './StrategyCard';

interface Strategy {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  created: string;
  returns?: number;
}

interface StrategiesListProps {
  strategies: Strategy[];
  isLoading: boolean;
  onDeleteStrategy: (id: string) => void;
  onCreateStrategy: () => void;
}

const StrategiesList = ({ strategies, isLoading, onDeleteStrategy, onCreateStrategy }: StrategiesListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-lg bg-muted/40 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {strategies.length > 0 ? (
        strategies.map((strategy) => (
          <StrategyCard 
            key={strategy.id} 
            {...strategy} 
            onDelete={onDeleteStrategy}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12 border border-dashed rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">You haven't created any strategies yet</p>
          <button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2"
            onClick={onCreateStrategy}
          >
            Create Your First Strategy
          </button>
        </div>
      )}
    </div>
  );
};

export default StrategiesList;
