
import React from 'react';

const SignalNodesDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Signal Nodes</h1>
      
      <p className="text-muted-foreground">
        Signal Nodes are essential components that define when your strategy should enter or exit positions.
        They translate market conditions into actionable trading signals.
      </p>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Types of Signal Nodes</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-tight">Entry Signal Node</h3>
          <p>
            Entry Signal Nodes are specifically designed to generate signals for entering new positions.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Define conditions for opening new positions</li>
            <li><strong>Use Case:</strong> Identifying buying or selling opportunities based on technical indicators, price patterns, or other market conditions</li>
            <li><strong>Typical Connections:</strong> Connect to Entry Nodes to execute trades when conditions are met</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Exit Signal Node</h3>
          <p>
            Exit Signal Nodes are designed to generate signals for exiting existing positions.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Define conditions for closing positions</li>
            <li><strong>Use Case:</strong> Identifying profit-taking opportunities, stop-loss conditions, or other exit criteria</li>
            <li><strong>Typical Connections:</strong> Connect to Exit Nodes to execute position closures when conditions are met</li>
          </ul>
          
          <h3 className="text-xl font-bold tracking-tight">Combined Signal Node</h3>
          <p>
            Combined Signal Nodes can generate both entry and exit signals based on separate condition sets.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Purpose:</strong> Define both entry and exit conditions in a single node</li>
            <li><strong>Use Case:</strong> Creating related entry and exit signals that share common logic</li>
            <li><strong>Organization:</strong> Uses tabs to separate entry and exit condition builders</li>
          </ul>
        </div>
        
        <h2 className="text-2xl font-bold tracking-tight">Condition Builder</h2>
        <p>
          The core of each Signal Node is the Condition Builder, which allows you to define complex logical conditions.
        </p>
        
        <h3 className="text-xl font-bold tracking-tight">Building Conditions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Basic Conditions:</strong> Each condition compares two expressions using operators like greater than, less than, equals, etc.
          </li>
          <li>
            <strong>Expressions:</strong> The values being compared, which can be:
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Indicators:</strong> Technical indicators defined in the Start Node</li>
              <li><strong>Market Data:</strong> Price, volume, or other market information</li>
              <li><strong>Position Data:</strong> Information about existing positions</li>
              <li><strong>Constants:</strong> Fixed numeric values</li>
              <li><strong>Time Functions:</strong> Date and time-based values</li>
              <li><strong>Complex Expressions:</strong> Mathematical operations combining multiple values</li>
            </ul>
          </li>
          <li>
            <strong>Condition Groups:</strong> Multiple conditions can be grouped using logical operators (AND/OR)
          </li>
          <li>
            <strong>Nested Groups:</strong> Groups can be nested to create complex logical structures
          </li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Condition Builder Interface</h3>
        <p>
          The interface provides an intuitive way to build conditions:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Add Condition Button:</strong> Creates a new condition in the current group</li>
          <li><strong>Add Group Button:</strong> Creates a nested group of conditions</li>
          <li><strong>Expression Selection:</strong> Dropdown menus to select the type of expression (indicator, price, etc.)</li>
          <li><strong>Operator Selection:</strong> Choose comparison operators between expressions</li>
          <li><strong>Value Inputs:</strong> Enter specific values for constants or select parameters for other expressions</li>
          <li><strong>Group Operator Toggle:</strong> Switch between AND/OR logic for condition groups</li>
          <li><strong>Remove Buttons:</strong> Delete individual conditions or entire groups</li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Condition Preview</h3>
        <p>
          The Condition Builder provides a real-time preview that shows a human-readable description of your conditions.
          This helps verify that your logical structure is correct.
        </p>
        
        <h2 className="text-2xl font-bold tracking-tight">Expression Types</h2>
        
        <h3 className="text-xl font-bold tracking-tight">Indicator Expressions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Source:</strong> Technical indicators configured in the Start Node</li>
          <li><strong>Examples:</strong> Moving averages, RSI, MACD, Bollinger Bands, etc.</li>
          <li><strong>Parameters:</strong> Period selection, value selection (e.g., MACD line vs. signal line)</li>
          <li><strong>Configuration Options:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Indicator Selection:</strong> Choose from all indicators configured in the Start Node</li>
              <li><strong>Output Selection:</strong> For indicators with multiple outputs (e.g., MACD has main line, signal line, and histogram)</li>
              <li><strong>Lookback Period:</strong> Access indicator values from previous bars (e.g., RSI value from 2 bars ago)</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Market Data Expressions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Source:</strong> Current and historical price and volume data</li>
          <li><strong>Examples:</strong> Close price, open price, high, low, volume, previous bar's values</li>
          <li><strong>Parameters:</strong> Price type, offset (current bar, previous bar, etc.)</li>
          <li><strong>Configuration Options:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Price Type:</strong> Open, High, Low, Close, Typical Price, Median Price</li>
              <li><strong>Bar Selection:</strong> Current bar (0), previous bar (-1), two bars ago (-2), etc.</li>
              <li><strong>Additional Data:</strong> Volume, Open Interest (for derivatives), Trading Sessions</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Position Data Expressions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Source:</strong> Information about existing positions in the strategy</li>
          <li><strong>Examples:</strong> Entry price, position size, profit/loss, position duration</li>
          <li><strong>Parameters:</strong> Position ID, metric selection</li>
          <li><strong>Configuration Options:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Position Selection:</strong> Specific VPI, positions with a particular VPT, or all positions</li>
              <li><strong>Position Metrics:</strong> Entry price, current profit/loss (absolute or percentage), position age</li>
              <li><strong>Position Status:</strong> If a position exists, number of open positions, etc.</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Time Function Expressions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Source:</strong> Date and time information</li>
          <li><strong>Examples:</strong> Current time, day of week, month, year</li>
          <li><strong>Use Cases:</strong> Time-based filters (e.g., only trade during specific hours)</li>
          <li><strong>Configuration Options:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Time Components:</strong> Hour, minute, second, day of week, day of month, month, year</li>
              <li><strong>Time Ranges:</strong> Trading session times, market open/close times</li>
              <li><strong>Calendar Functions:</strong> Is today a holiday, days to expiry (for derivatives)</li>
            </ul>
          </li>
        </ul>
        
        <h3 className="text-xl font-bold tracking-tight">Mathematical Expressions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Purpose:</strong> Combine multiple values with mathematical operations</li>
          <li><strong>Operations:</strong> Addition, subtraction, multiplication, division, percentage, modulo</li>
          <li><strong>Examples:</strong>
            <ul className="list-disc pl-6 space-y-1">
              <li>Average of multiple indicator values</li>
              <li>Percentage difference between current price and a moving average</li>
              <li>Custom calculations combining multiple market data points</li>
            </ul>
          </li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Operators</h2>
        <p>
          The condition builder supports various comparison operators:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Basic Comparisons:</strong> Equals (=), Not Equals (≠), Greater Than (&gt;), Less Than (&lt;), Greater Than or Equal (≥), Less Than or Equal (≤)</li>
          <li><strong>Crossing Operators:</strong> Crosses Above (↗), Crosses Below (↘)</li>
          <li><strong>Range Operators:</strong> Between, Not Between, Inside Range, Outside Range</li>
          <li><strong>Pattern Operators:</strong> Increasing For N Bars, Decreasing For N Bars, Bouncing Off, Rejecting From</li>
        </ul>
        
        <h2 className="text-2xl font-bold tracking-tight">Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Start Simple:</strong> Begin with clear, simple conditions before adding complexity</li>
          <li><strong>Group Logically:</strong> Use condition groups to organize related conditions</li>
          <li><strong>Use Descriptive Labels:</strong> Give your Signal Nodes descriptive names that explain their purpose</li>
          <li><strong>Test Incrementally:</strong> Add and test conditions one at a time to ensure they work as expected</li>
          <li><strong>Consider Frequency:</strong> Be aware of how often your conditions might be triggered in real market conditions</li>
          <li><strong>Avoid Overfitting:</strong> Create conditions that capture genuine market patterns rather than historical anomalies</li>
          <li><strong>Combine Technical Approaches:</strong> Consider using multiple types of indicators (trend, momentum, volatility) for more robust signals</li>
          <li><strong>Add Filters:</strong> Use conditions to filter out weak signals or poor market conditions</li>
        </ul>
      </div>
    </div>
  );
};

export default SignalNodesDoc;
