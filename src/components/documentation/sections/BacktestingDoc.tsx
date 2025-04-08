
import React from 'react';

const BacktestingDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Backtesting</h1>
      
      <p className="text-muted-foreground">
        The Backtesting module allows you to test your trading strategies against historical data to evaluate their performance.
        This helps you refine your strategy before deploying it in live trading conditions.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Backtesting Configuration</h2>
        
        <h3 className="text-xl font-bold tracking-tight">Basic Settings</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Date Range:</strong> The historical period to test your strategy
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Start Date:</strong> Beginning of the backtest period</li>
              <li><strong>End Date:</strong> End of the backtest period</li>
            </ul>
          </li>
          <li><strong>Initial Capital:</strong> The starting amount of capital for the backtest</li>
          <li><strong>Enable Backtesting:</strong> Toggle to activate backtest mode</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Advanced Settings</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Slippage Percentage:</strong> The amount of price slippage to simulate on order execution</li>
          <li><strong>Commission Percentage:</strong> Trading fees to include in performance calculations</li>
          <li><strong>Risk Per Trade:</strong> Maximum percentage of capital to risk on each trade</li>
          <li><strong>Timeframe:</strong> The chart timeframe to use for backtesting</li>
          <li><strong>Max Open Positions:</strong> Maximum number of simultaneous positions allowed</li>
          <li><strong>Optimization:</strong> Enable parameter optimization to find optimal settings</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Running a Backtest</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Configure Strategy:</strong> Ensure your strategy is fully defined with all necessary nodes</li>
          <li><strong>Set Parameters:</strong> Configure the backtest settings in the Backtesting Panel</li>
          <li><strong>Enable Backtesting:</strong> Toggle the Backtesting switch to activate backtest mode</li>
          <li><strong>Start Backtest:</strong> Click the "Run Backtest" button to begin the simulation</li>
          <li><strong>View Results:</strong> After completion, examine the performance metrics and reports</li>
        </ol>
        
        <h2 className="text-2xl font-bold tracking-tight">Backtesting Engine Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Historical Data:</strong> Accurate price and volume data for selected instruments</li>
          <li><strong>Order Execution:</strong> Realistic simulation of market and limit orders</li>
          <li><strong>Position Tracking:</strong> Monitors all positions and their performance</li>
          <li><strong>Transaction Recording:</strong> Logs all trades with timestamps and execution details</li>
          <li><strong>Slippage and Commission:</strong> Simulates trading costs and execution inefficiency</li>
          <li><strong>Equity Curve Calculation:</strong> Tracks account value throughout the test period</li>
          <li><strong>Performance Metrics:</strong> Calculates key performance indicators</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Interpreting Results</h2>
        <p>
          After a backtest completes, you'll see a comprehensive report with various metrics:
        </p>
        
        <h3 className="text-xl font-bold tracking-tight">Key Performance Metrics</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Total Return:</strong> Overall percentage gain or loss</li>
          <li><strong>Win Rate:</strong> Percentage of profitable trades</li>
          <li><strong>Sharpe Ratio:</strong> Risk-adjusted return measure</li>
          <li><strong>Maximum Drawdown:</strong> Largest peak-to-trough decline</li>
          <li><strong>Profit Factor:</strong> Ratio of gross profits to gross losses</li>
          <li><strong>Total Trades:</strong> Number of completed trades</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Visual Reports</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Equity Curve:</strong> Graph showing account value over time</li>
          <li><strong>Monthly Returns:</strong> Bar chart of returns broken down by month</li>
          <li><strong>Trade Analysis:</strong> Detailed view of individual trades and their outcomes</li>
          <li><strong>Drawdown Analysis:</strong> Visualization of drawdown periods</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Strategy Optimization</h2>
        <p>
          You can use the backtesting engine to optimize your strategy parameters:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Parameter Sweeping:</strong> Test multiple values for indicator parameters</li>
          <li><strong>Optimization Metrics:</strong> Select which performance metric to optimize for</li>
          <li><strong>Optimization Results:</strong> View optimal parameter values and their performance</li>
          <li><strong>Apply Optimal Values:</strong> Update your strategy with the optimal parameters</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Avoid Overfitting:</strong> Test your strategy across different market conditions</li>
          <li><strong>Out-of-Sample Testing:</strong> Reserve some historical data for validation</li>
          <li><strong>Realistic Settings:</strong> Use accurate slippage and commission values</li>
          <li><strong>Multiple Timeframes:</strong> Test across different timeframes to check robustness</li>
          <li><strong>Consider Drawdowns:</strong> Focus on risk management, not just returns</li>
          <li><strong>Transaction Analysis:</strong> Look for patterns in winning and losing trades</li>
          <li><strong>Stress Testing:</strong> Test how your strategy performs in extreme market conditions</li>
        </ul>
      </div>
    </div>
  );
};

export default BacktestingDoc;
