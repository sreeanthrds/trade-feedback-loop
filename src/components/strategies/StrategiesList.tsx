
import React from 'react';
import StrategyCard from './StrategyCard';
import EmptyStateView from './EmptyStateView';

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
        <EmptyStateView onCreateStrategy={onCreateStrategy} />
      )}
    </div>
  );
};

export default StrategiesList;
