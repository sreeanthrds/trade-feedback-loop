
import React from 'react';

const ReportsDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      
      <p className="text-muted-foreground">
        After backtesting your strategy, comprehensive reports and analytics tools help you evaluate
        performance and refine your approach. The Reports Dashboard provides detailed insights into your
        strategy's behavior and effectiveness.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Performance Summary</h2>
        <p>
          The Performance Summary provides a high-level overview of your strategy's results:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Net Profit/Loss:</strong> Total return after all trading costs</li>
          <li><strong>Return Percentage:</strong> Net profit as a percentage of initial capital</li>
          <li><strong>Annualized Return:</strong> Return normalized to an annual percentage</li>
          <li><strong>Number of Trades:</strong> Total trades executed during the backtest period</li>
          <li><strong>Win Rate:</strong> Percentage of profitable trades</li>
          <li><strong>Profit Factor:</strong> Ratio of gross profits to gross losses</li>
          <li><strong>Maximum Drawdown:</strong> Largest peak-to-trough decline in equity</li>
          <li><strong>Time in Market:</strong> Percentage of time with open positions</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Equity Curve</h2>
        <p>
          The Equity Curve chart visualizes your account balance over time:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account Equity Line:</strong> Daily account balance progression</li>
          <li><strong>Drawdown Overlay:</strong> Visualization of drawdowns throughout the testing period</li>
          <li><strong>Benchmark Comparison:</strong> Compare strategy performance to market indices or other benchmarks</li>
          <li><strong>Interactive Controls:</strong> Zoom, pan, and inspect specific time periods</li>
          <li><strong>Linear vs. Logarithmic:</strong> Toggle between linear and logarithmic scales</li>
          <li><strong>Equity with Open Positions:</strong> Option to include unrealized profit/loss in open positions</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Trade Analysis</h2>
        <p>
          Detailed analysis of individual trades and aggregate trading performance:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Trade List:</strong> Chronological record of all trades with key metrics</li>
          <li><strong>Trade Distribution:</strong> Statistical distribution of trade returns</li>
          <li><strong>Win/Loss Metrics:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Average Win:</strong> Mean return of profitable trades</li>
              <li><strong>Average Loss:</strong> Mean return of losing trades</li>
              <li><strong>Largest Win:</strong> Biggest single trade profit</li>
              <li><strong>Largest Loss:</strong> Biggest single trade loss</li>
              <li><strong>Win Streak:</strong> Longest consecutive sequence of profitable trades</li>
              <li><strong>Loss Streak:</strong> Longest consecutive sequence of losing trades</li>
            </ul>
          </li>
          <li><strong>Profit/Loss Chart:</strong> Visual representation of each trade's P&L</li>
          <li><strong>Cumulative Trade Chart:</strong> Running sum of trade results</li>
          <li><strong>Trade Duration Analysis:</strong> How long positions were held</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Risk Metrics</h2>
        <p>
          Comprehensive risk assessment tools:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Drawdown Analysis:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Maximum Drawdown:</strong> Largest peak-to-trough decline</li>
              <li><strong>Average Drawdown:</strong> Mean of all drawdowns</li>
              <li><strong>Drawdown Duration:</strong> Time spent in drawdowns</li>
              <li><strong>Recovery Time:</strong> Time to recover from drawdowns</li>
              <li><strong>Underwater Chart:</strong> Visual representation of drawdowns over time</li>
            </ul>
          </li>
          <li><strong>Volatility Metrics:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Standard Deviation:</strong> Dispersion of returns</li>
              <li><strong>Downside Deviation:</strong> Volatility of negative returns only</li>
              <li><strong>Daily/Monthly Volatility:</strong> Return volatility at different time scales</li>
            </ul>
          </li>
          <li><strong>Risk-Adjusted Returns:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Sharpe Ratio:</strong> Returns relative to risk (volatility)</li>
              <li><strong>Sortino Ratio:</strong> Returns relative to downside risk</li>
              <li><strong>Calmar Ratio:</strong> Returns relative to maximum drawdown</li>
              <li><strong>MAR Ratio:</strong> Compound Annual Growth Rate divided by maximum drawdown</li>
            </ul>
          </li>
          <li><strong>Value at Risk (VaR):</strong> Statistical measure of potential loss</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Performance By Category</h2>
        <p>
          Break down performance across different dimensions:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>By Direction:</strong> Long vs. short trade performance</li>
          <li><strong>By Time Period:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Monthly Returns:</strong> Performance by calendar month</li>
              <li><strong>Day of Week:</strong> Performance by weekday</li>
              <li><strong>Time of Day:</strong> Performance by hour (for intraday strategies)</li>
              <li><strong>Yearly Analysis:</strong> Year-by-year performance comparison</li>
            </ul>
          </li>
          <li><strong>By Market Conditions:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Bull/Bear Markets:</strong> Performance in different market regimes</li>
              <li><strong>Volatility Regimes:</strong> Performance during high/low volatility periods</li>
              <li><strong>Market Correlation:</strong> Strategy correlation to major indices</li>
            </ul>
          </li>
          <li><strong>By Strategy Component:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Signal Performance:</strong> Which signals generated the best trades</li>
              <li><strong>Exit Type Analysis:</strong> Performance by exit type (take profit, stop loss, etc.)</li>
              <li><strong>Position Tags:</strong> Performance grouped by Virtual Position Tags</li>
            </ul>
          </li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Trade Visualizer</h2>
        <p>
          Visual replay and inspection of trades:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Chart Overlay:</strong> See entries and exits plotted on price charts</li>
          <li><strong>Trade Replay:</strong> Step through the backtest bar by bar</li>
          <li><strong>Position Timeline:</strong> Visual representation of when positions were open</li>
          <li><strong>Signal Visualization:</strong> See when signals were generated</li>
          <li><strong>Indicator Values:</strong> View indicator readings at trade entry and exit points</li>
          <li><strong>Trade Details:</strong> Inspect specific trades for deeper analysis</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Monte Carlo Analysis</h2>
        <p>
          Statistical simulation to estimate strategy robustness:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Trade Randomization:</strong> Shuffling trade sequence to simulate different outcomes</li>
          <li><strong>Confidence Intervals:</strong> Statistical ranges for expected performance</li>
          <li><strong>Failure Probability:</strong> Chance of specific drawdown levels</li>
          <li><strong>Equity Curves:</strong> Multiple potential equity curves based on simulations</li>
          <li><strong>Risk of Ruin:</strong> Probability of losing a specific percentage of capital</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Optimization Results</h2>
        <p>
          When strategy optimization is performed, additional reports are available:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Parameter Sensitivity:</strong> How changes in parameters affect performance</li>
          <li><strong>Optimization Surface:</strong> 3D visualization of parameter interactions</li>
          <li><strong>Parameter Distribution:</strong> Range of viable parameter values</li>
          <li><strong>Walk-Forward Efficiency:</strong> Measure of optimization robustness</li>
          <li><strong>Parameter Stability:</strong> How consistent optimal parameters are across different time periods</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Export and Sharing</h2>
        <p>
          Options for exporting and sharing your analysis:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>PDF Reports:</strong> Generate comprehensive PDF documents</li>
          <li><strong>CSV Export:</strong> Export trade data for external analysis</li>
          <li><strong>Image Export:</strong> Save charts and visualizations as images</li>
          <li><strong>Strategy Sharing:</strong> Share backtested strategies with other users</li>
          <li><strong>Scheduled Reports:</strong> Set up regular performance report generation</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Using Analytics to Improve Strategies</h2>
        <p>
          Best practices for leveraging analytics to enhance your trading strategies:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identify Patterns:</strong> Look for patterns in winning and losing trades</li>
          <li><strong>Refine Entry/Exit:</strong> Use analytics to optimize entry and exit timing</li>
          <li><strong>Risk Management:</strong> Adjust position sizing based on drawdown analysis</li>
          <li><strong>Market Conditions:</strong> Adapt strategy to different market environments</li>
          <li><strong>Component Analysis:</strong> Strengthen high-performing elements and revise underperforming ones</li>
          <li><strong>Statistical Significance:</strong> Ensure results have sufficient trades to be statistically meaningful</li>
          <li><strong>Robustness Testing:</strong> Verify performance across different time periods and market conditions</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsDoc;
