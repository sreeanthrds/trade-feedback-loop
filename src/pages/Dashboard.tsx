
import React from 'react';
import { useBacktestingStore } from '@/components/strategy/backtesting/useBacktestingStore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import NoResultsView from '@/components/dashboard/NoResultsView';
import MetricsCards from '@/components/dashboard/MetricsCards';
import EquityChart from '@/components/dashboard/EquityChart';
import ReportsGrid from '@/components/dashboard/ReportsGrid';

const Dashboard = () => {
  const { results, resetResults } = useBacktestingStore();

  // If no results yet, show a message and redirect button
  if (!results) {
    return <NoResultsView />;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <DashboardHeader onClearResults={resetResults} />
      <MetricsCards results={results} />
      <div className="grid grid-cols-1 gap-6 mb-8">
        <EquityChart equityCurve={results.equityCurve} />
      </div>
      <ReportsGrid results={results} />
    </div>
  );
};

export default Dashboard;
