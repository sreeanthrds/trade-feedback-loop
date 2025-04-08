
import React from 'react';

const ReportsDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      
      <p className="text-muted-foreground">
        The Reports & Analytics module provides comprehensive insights into your strategy's performance,
        helping you understand strengths, weaknesses, and areas for improvement.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Performance Metrics</h2>
        <p>
          Performance metrics provide a quantitative assessment of your strategy's effectiveness:
        </p>
        
        <h3 className="text-xl font-bold tracking-tight">Return Metrics</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Total Return:</strong> The overall percentage gain or loss over the testing period</li>
          <li><strong>Annualized Return:</strong> Return normalized to a yearly basis</li>
          <li><strong>Monthly Returns:</strong> Performance broken down by month</li>
          <li><strong>Compound Annual Growth Rate (CAGR):</strong> The geometric progression rate that provides a constant rate of return over the time period</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Risk Metrics</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Maximum Drawdown:</strong> The largest peak-to-trough decline in portfolio value</li>
          <li><strong>Drawdown Duration:</strong> The time it takes to recover from drawdowns</li>
          <li><strong>Sharpe Ratio:</strong> Risk-adjusted return, measuring excess return per unit of risk</li>
          <li><strong>Sortino Ratio:</strong> Similar to Sharpe ratio but focuses only on downside risk</li>
          <li><strong>Volatility:</strong> Standard deviation of returns, measuring the variability or dispersion of returns</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Trading Metrics</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Win Rate:</strong> Percentage of trades that were profitable</li>
          <li><strong>Profit Factor:</strong> Ratio of gross profits to gross losses</li>
          <li><strong>Average Win/Loss:</strong> The average profit of winning trades vs. the average loss of losing trades</li>
          <li><strong>Expectancy:</strong> The average amount you can expect to win (or lose) per trade</li>
          <li><strong>Total Trades:</strong> Number of completed trades</li>
          <li><strong>Average Holding Period:</strong> The average duration of trades</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Visual Reports</h2>
        
        <h3 className="text-xl font-bold tracking-tight">Equity Curve</h3>
        <p>
          The Equity Curve shows the value of your portfolio over time, illustrating the cumulative effect of your trading strategy.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Features:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Plots account value against time</li>
              <li>Highlights drawdown periods</li>
              <li>Shows benchmark comparison (optional)</li>
              <li>Includes equity high watermark</li>
            </ul>
          </li>
          <li><strong>Analysis:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Smooth, upward-trending curves indicate consistent performance</li>
              <li>Large dips show major drawdown periods</li>
              <li>Flat periods indicate inactive trading or breakeven results</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Monthly Returns Chart</h3>
        <p>
          The Monthly Returns Chart breaks down performance by calendar month, helping identify seasonal patterns.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Features:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Bar chart showing return percentage for each month</li>
              <li>Color-coding for profitable vs. unprofitable months</li>
              <li>Hover tooltips with detailed information</li>
            </ul>
          </li>
          <li><strong>Analysis:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Identify months with consistently strong or weak performance</li>
              <li>Detect seasonal patterns that could inform trading decisions</li>
              <li>Assess consistency of monthly returns</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Transaction Table</h3>
        <p>
          The Transaction Table provides a detailed record of all trades executed during the backtest period.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Features:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sortable columns for different transaction attributes</li>
              <li>Filtering options (entry/exit, symbol, etc.)</li>
              <li>Detailed transaction information</li>
              <li>Exit reason labels (take profit, stop loss, etc.)</li>
            </ul>
          </li>
          <li><strong>Information Displayed:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Date and time of transaction</li>
              <li>Transaction type (entry/exit)</li>
              <li>Symbol traded</li>
              <li>Side (buy/sell)</li>
              <li>Price and quantity</li>
              <li>Transaction amount and fees</li>
              <li>Profit/loss for exit transactions</li>
              <li>Exit reason for closing transactions</li>
            </ul>
          </li>
          <li><strong>Analysis:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Review individual trades to understand detailed performance</li>
              <li>Identify patterns in winning and losing trades</li>
              <li>Analyze the distribution of exit reasons</li>
            </ul>
          </li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Advanced Analytics</h2>
        
        <h3 className="text-xl font-bold tracking-tight">Performance by Market Condition</h3>
        <p>
          Analyze how your strategy performs in different market conditions:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Bull vs. Bear Markets:</strong> Performance in rising vs. falling markets</li>
          <li><strong>Volatility Analysis:</strong> Performance during high vs. low volatility periods</li>
          <li><strong>Volume Analysis:</strong> Performance during high vs. low volume periods</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Trade Analysis</h3>
        <p>
          Deeper insights into trading patterns:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Duration Analysis:</strong> Performance by holding period</li>
          <li><strong>Time-of-Day Analysis:</strong> Performance by time of entry/exit</li>
          <li><strong>Signal Analysis:</strong> Which signal types generate the best performance</li>
          <li><strong>Consecutive Wins/Losses:</strong> Analysis of winning and losing streaks</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Using Reports for Strategy Improvement</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Identify Weaknesses:</strong> Look for patterns in losing trades to adjust your strategy</li>
          <li><strong>Optimize Parameters:</strong> Use performance metrics to guide parameter adjustments</li>
          <li><strong>Refine Risk Management:</strong> Analyze drawdowns to improve stop-loss placement</li>
          <li><strong>Market Condition Filtering:</strong> Add filters based on performance in different market conditions</li>
          <li><strong>Compare Strategies:</strong> Use reports to objectively compare different strategies</li>
          <li><strong>Track Improvement:</strong> Save reports to track strategy improvements over time</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Exporting and Sharing Reports</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Export Formats:</strong> PDF, CSV, or image formats</li>
          <li><strong>Customization:</strong> Select specific reports and metrics to include</li>
          <li><strong>Scheduled Reports:</strong> Set up automatic report generation on a schedule</li>
          <li><strong>Comparative Reports:</strong> Compare multiple strategy versions side by side</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsDoc;
