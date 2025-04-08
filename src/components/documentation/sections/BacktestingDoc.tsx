
import React from 'react';

const BacktestingDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Backtesting</h1>
      
      <p className="text-muted-foreground">
        Backtesting is the process of testing a trading strategy against historical data to evaluate its performance.
        Our platform provides powerful backtesting capabilities to help you refine and optimize your strategies.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Backtesting Interface</h2>
        <p>
          The backtesting interface allows you to configure and run backtests on your strategies:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Strategy Selection:</strong> Choose the strategy to backtest from your saved strategies</li>
          <li><strong>Date Range:</strong> Select the historical period to test against</li>
          <li><strong>Symbol Selection:</strong> Choose the instrument to backtest on (can override the strategy default)</li>
          <li><strong>Account Settings:</strong> Configure initial capital, commission structure, and other account parameters</li>
          <li><strong>Advanced Settings:</strong> Fine-tune backtesting parameters for more realistic simulations</li>
          <li><strong>Run Button:</strong> Execute the backtest with the selected parameters</li>
          <li><strong>Progress Indicator:</strong> Visual feedback on backtest execution progress</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Backtesting Settings in Detail</h2>
        
        <h3 className="text-xl font-bold tracking-tight">Date Range Configuration</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Predefined Ranges:</strong> Quick selection options (last month, last quarter, year to date, etc.)</li>
          <li><strong>Custom Range:</strong> Specific start and end dates for the backtest</li>
          <li><strong>Time Range:</strong> Option to limit testing to specific hours of the trading day</li>
          <li><strong>Exclude Dates:</strong> Option to exclude specific dates (holidays, market closures, etc.)</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Account Settings</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Initial Capital:</strong> Starting amount for the backtest</li>
          <li><strong>Commission Structure:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Percentage:</strong> Commission as a percentage of trade value</li>
              <li><strong>Fixed:</strong> Flat fee per trade</li>
              <li><strong>Tiered:</strong> Different rates based on trading volume</li>
            </ul>
          </li>
          <li><strong>Slippage Model:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Fixed Pips/Ticks:</strong> Constant slippage amount per trade</li>
              <li><strong>Percentage:</strong> Slippage as a percentage of price</li>
              <li><strong>Volume-Based:</strong> Slippage that increases with trade size</li>
              <li><strong>Realistic Model:</strong> Simulates market impact based on volume/liquidity</li>
            </ul>
          </li>
          <li><strong>Margin Requirements:</strong> For leveraged trading, the required margin percentage</li>
          <li><strong>Interest Rates:</strong> For overnight positions, applicable interest charges or earnings</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Advanced Settings</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Data Resolution:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Match strategy timeframe (default)</li>
              <li>Use higher resolution data for more accurate execution simulation</li>
              <li>Tick-level simulation for ultra-precise testing (where available)</li>
            </ul>
          </li>
          <li><strong>Trade Execution Model:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Next Bar:</strong> Execute at the open of the next bar after signal</li>
              <li><strong>Same Bar:</strong> Execute immediately when signal occurs</li>
              <li><strong>Delayed:</strong> Simulate execution delay</li>
            </ul>
          </li>
          <li><strong>Position Sizing:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Fixed Size:</strong> Use exactly the position size specified in the strategy</li>
              <li><strong>Percentage of Capital:</strong> Dynamically adjust position size based on account value</li>
              <li><strong>Kelly Criterion:</strong> Optimize position size based on win rate and risk/reward</li>
              <li><strong>Risk-Based:</strong> Size positions to risk a fixed percentage per trade</li>
            </ul>
          </li>
          <li><strong>Maximum Positions:</strong> Limit the number of concurrent open positions</li>
          <li><strong>Rebalancing:</strong> For portfolio strategies, how often to rebalance position weights</li>
          <li><strong>Drawdown Limits:</strong> Stop testing if strategy exceeds maximum drawdown threshold</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Running a Backtest</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Strategy Validation:</strong> System automatically validates your strategy before running the backtest</li>
          <li><strong>Data Preparation:</strong> Historical market data is loaded and processed</li>
          <li><strong>Simulation Loop:</strong> Your strategy is executed against historical data bar by bar</li>
          <li><strong>Signal Generation:</strong> Each bar, your Signal Nodes are evaluated to check for trading conditions</li>
          <li><strong>Order Execution:</strong> When signals trigger, Action Nodes execute trades according to their configuration</li>
          <li><strong>Position Tracking:</strong> All positions are tracked throughout the simulation</li>
          <li><strong>Results Calculation:</strong> Performance metrics are calculated from the trading activity</li>
          <li><strong>Report Generation:</strong> Comprehensive reports and visualizations are created</li>
        </ol>
        
        <h2 className="text-2xl font-bold tracking-tight">Optimization Features</h2>
        <p>
          Beyond basic backtesting, the platform offers strategy optimization capabilities:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Parameter Sweeping:</strong> Test a range of values for specific strategy parameters</li>
          <li><strong>Multi-Variable Optimization:</strong> Simultaneously optimize multiple parameters</li>
          <li><strong>Optimization Metrics:</strong> Select which performance metric to optimize (profit, Sharpe ratio, drawdown, etc.)</li>
          <li><strong>Genetic Algorithms:</strong> Advanced optimization using evolutionary methods</li>
          <li><strong>Walk-Forward Testing:</strong> Test optimization robustness by validating on out-of-sample data</li>
          <li><strong>Monte Carlo Simulation:</strong> Assess strategy robustness through statistical analysis</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Backtesting Results</h2>
        <p>
          After a backtest completes, you'll see comprehensive results:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Summary Statistics:</strong> Overview of key performance metrics</li>
          <li><strong>Equity Curve:</strong> Visual representation of account balance over time</li>
          <li><strong>Drawdown Analysis:</strong> Duration and depth of drawdowns</li>
          <li><strong>Trade List:</strong> Detailed record of all executed trades</li>
          <li><strong>Performance Metrics:</strong> Comprehensive statistical analysis</li>
          <li><strong>Position Visualizer:</strong> Visual replay of positions taken during the backtest</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Limitations and Best Practices</h2>
        <p>
          Understanding the limitations of backtesting is crucial:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Past Performance Disclaimer:</strong> Historical results don't guarantee future performance</li>
          <li><strong>Survivorship Bias:</strong> Historical data may only include currently existing securities</li>
          <li><strong>Look-Ahead Bias:</strong> Ensure your strategy doesn't use future information</li>
          <li><strong>Overfitting:</strong> Avoid excessive optimization to historical data</li>
          <li><strong>Data Quality:</strong> Results are only as good as the historical data used</li>
          <li><strong>Market Evolution:</strong> Markets change over time; strategies that worked in the past might not work now</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Best Practices</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Out-of-Sample Testing:</strong> Reserve some historical data for validation</li>
          <li><strong>Robustness Testing:</strong> Test on multiple instruments and time periods</li>
          <li><strong>Realistic Parameters:</strong> Use realistic slippage, commission, and execution models</li>
          <li><strong>Multiple Metrics:</strong> Don't optimize for a single metric; consider risk-adjusted returns</li>
          <li><strong>Start Simple:</strong> Begin with basic strategies before adding complexity</li>
          <li><strong>Incremental Development:</strong> Add and test one feature at a time</li>
          <li><strong>Paper Trading:</strong> After successful backtesting, validate with paper trading before using real capital</li>
        </ul>
      </div>
    </div>
  );
};

export default BacktestingDoc;
