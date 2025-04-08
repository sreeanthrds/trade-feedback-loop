
import React from 'react';

const ActionNodesDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Action Nodes</h1>
      
      <p className="text-muted-foreground">
        Action Nodes execute specific operations when triggered by signals. They are responsible for
        opening or closing positions, modifying existing positions, and generating alerts.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Types of Action Nodes</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight">Entry Node</h3>
          <p>
            Entry Nodes create new trading positions when triggered by entry signals.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Open new long or short positions</li>
            <li><strong>Key Settings:</strong>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Position Type:</strong> Buy (long) or Sell (short)</li>
                <li><strong>Order Type:</strong> Market or Limit orders</li>
                <li><strong>Quantity:</strong> Number of lots/shares/contracts</li>
                <li><strong>Product Type:</strong> Intraday or Carry Forward</li>
                <li><strong>Options Settings:</strong> For options trading strategies</li>
                <li><strong>Post-Execution:</strong> Stop-loss, take-profit, and trailing stop settings</li>
              </ul>
            </li>
            <li><strong>Position Management:</strong> Creates virtual positions tracked by the Position Store</li>
            <li><strong>Position Tagging:</strong> Assign virtual position IDs (VPI) and tags (VPT) for tracking</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Exit Node</h3>
          <p>
            Exit Nodes close existing trading positions when triggered by exit signals.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Close existing positions partially or completely</li>
            <li><strong>Key Settings:</strong>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Target Position:</strong> Specific position or any position</li>
                <li><strong>Exit Quantity:</strong> All, percentage, or specific quantity</li>
                <li><strong>Order Type:</strong> Market or Limit orders</li>
                <li><strong>Re-entry Settings:</strong> Configure automatic re-entry after exit</li>
              </ul>
            </li>
            <li><strong>Exit Types:</strong> Manual exit, take-profit, stop-loss, or trailing stop</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Modify Node</h3>
          <p>
            Modify Nodes adjust parameters of existing positions without closing them.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Update stop-loss, take-profit, or other position parameters</li>
            <li><strong>Key Settings:</strong>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Target Position:</strong> Position to be modified</li>
                <li><strong>Modification Type:</strong> Stop-loss, take-profit, trailing stop</li>
                <li><strong>New Values:</strong> Updated price levels or percentages</li>
              </ul>
            </li>
            <li><strong>Use Cases:</strong> Moving stops to breakeven, widening take-profit targets, etc.</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Alert Node</h3>
          <p>
            Alert Nodes generate notifications without executing trades.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Create custom alerts for specific market conditions</li>
            <li><strong>Key Settings:</strong>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Alert Message:</strong> Customizable message content</li>
                <li><strong>Alert Type:</strong> Information, warning, or critical</li>
                <li><strong>Notification Channels:</strong> Where alerts are sent</li>
              </ul>
            </li>
            <li><strong>Use Cases:</strong> Market condition notifications, strategy monitoring, debugging</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Retry Node</h3>
          <p>
            Retry Nodes attempt to reprocess a strategy branch after a condition is met.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Implement re-entry logic or retry failed operations</li>
            <li><strong>Key Settings:</strong>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Retry Count:</strong> Maximum number of retry attempts</li>
                <li><strong>Retry Delay:</strong> Time between retry attempts</li>
                <li><strong>Retry Conditions:</strong> Conditions that must be met to trigger a retry</li>
              </ul>
            </li>
          </ul>
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight">Entry Order Configuration</h2>
        
        <h3 className="text-xl font-bold tracking-tight">Basic Order Settings</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Position Type:</strong> Defines whether you're opening a long (buy) or short (sell) position</li>
          <li><strong>Order Type:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Market Order:</strong> Executes immediately at the current market price</li>
              <li><strong>Limit Order:</strong> Executes only at a specified price or better</li>
            </ul>
          </li>
          <li><strong>Quantity:</strong> The size of the position in lots, shares, or contracts</li>
          <li><strong>Product Type:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Intraday (MIS):</strong> Positions that automatically close at the end of the trading day</li>
              <li><strong>Carry Forward (CNC):</strong> Positions that can be held overnight</li>
            </ul>
          </li>
          <li><strong>Priority:</strong> Determines the execution order when multiple entry signals are triggered simultaneously</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Post-Execution Settings</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Stop Loss:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Fixed Price:</strong> Absolute price level for stop-loss</li>
              <li><strong>Percentage:</strong> Percentage away from entry price</li>
              <li><strong>ATR Multiple:</strong> Distance based on Average True Range</li>
            </ul>
          </li>
          <li><strong>Take Profit:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Fixed Price:</strong> Absolute price level for take-profit</li>
              <li><strong>Percentage:</strong> Percentage away from entry price</li>
              <li><strong>Risk/Reward Ratio:</strong> Multiple of stop-loss distance</li>
              <li><strong>Multiple Targets:</strong> Define several take-profit levels with partial exits</li>
            </ul>
          </li>
          <li><strong>Trailing Stop:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Initial Distance:</strong> Starting distance from entry price</li>
              <li><strong>Step Size:</strong> How much the stop moves when price moves in your favor</li>
              <li><strong>Activation:</strong> Price level or percentage where trailing begins</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Options Trading Settings</h3>
        <p>
          When trading options, additional settings are available:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Option Type:</strong> Call or Put</li>
          <li><strong>Expiry Selection:</strong> Weekly, monthly, or specific dates</li>
          <li><strong>Strike Selection:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>ATM (At-the-money):</strong> Strike closest to current price</li>
              <li><strong>ITM (In-the-money):</strong> Strikes favorable to the option type</li>
              <li><strong>OTM (Out-of-the-money):</strong> Strikes unfavorable to the option type</li>
              <li><strong>Specific Strike:</strong> Exact strike price value</li>
            </ul>
          </li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Position Management</h2>
        <p>
          Action Nodes interact with the Position Store to track and manage trading positions:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Virtual Position IDs (VPI):</strong> Unique identifiers for each position</li>
          <li><strong>Virtual Position Tags (VPT):</strong> User-defined labels for categorizing positions</li>
          <li><strong>Position Filtering:</strong> Exit and Modify nodes can target specific positions by ID or tag</li>
          <li><strong>Position Visualization:</strong> The Visual Position Store displays all active positions</li>
          <li><strong>Re-Entry Logic:</strong> Configure automatic re-entry after position exits</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Position Sizing:</strong> Consider using percentage of account or volatility-based position sizing</li>
          <li><strong>Order Types:</strong> Use limit orders when precise entry prices are critical</li>
          <li><strong>Risk Management:</strong> Always define stop-loss levels for all positions</li>
          <li><strong>Position Tracking:</strong> Use consistent VPI/VPT naming conventions for easier management</li>
          <li><strong>Exit Strategy:</strong> Plan multiple exit scenarios, including partial exits</li>
          <li><strong>Backtesting:</strong> Test how different order types affect performance in historical testing</li>
        </ul>
      </div>
    </div>
  );
};

export default ActionNodesDoc;
