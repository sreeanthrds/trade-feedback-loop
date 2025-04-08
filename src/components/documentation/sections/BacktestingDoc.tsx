
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoCircle, AlertTriangle } from 'lucide-react';

const BacktestingDoc: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Backtesting</h1>
      
      <p className="text-muted-foreground">
        Backtesting allows you to simulate how your trading strategy would have performed
        against historical market data. This process helps you evaluate and refine your strategy
        before risking real capital in live trading.
      </p>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup Process</TabsTrigger>
          <TabsTrigger value="parameters">Parameter Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <h2 className="text-2xl font-bold tracking-tight">Backtesting Overview</h2>
          <p>
            Backtesting is a critical step in strategy development that simulates your trading strategy's 
            performance against historical market data. This process helps you:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Validate your trading strategy concept without risking capital</li>
            <li>Identify strengths and weaknesses in your approach</li>
            <li>Quantify expected performance metrics like returns, drawdowns, and win rates</li>
            <li>Refine your strategy parameters to optimize performance</li>
            <li>Compare multiple strategy variations to select the most promising approach</li>
          </ul>
          
          <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Past performance does not guarantee future results. Backtested 
              performance may differ significantly from live trading results due to factors like slippage, 
              market impact, and changing market conditions.
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="setup" className="space-y-4 mt-4">
          <h2 className="text-2xl font-bold tracking-tight">Backtesting Setup Process</h2>
          <p>
            Follow these steps to set up and run a backtest of your trading strategy:
          </p>
          
          <div className="space-y-4 mt-4">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Step 1: Complete Your Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Before backtesting, ensure your strategy in the Strategy Builder includes:
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground mt-1">
                <li>Properly configured Start Node with selected instrument and timeframe</li>
                <li>Signal Nodes with defined entry and exit conditions</li>
                <li>Action Nodes specifying how and when to enter and exit positions</li>
                <li>All required connections between nodes</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Step 2: Access the Backtesting Module</h3>
              <p className="text-sm text-muted-foreground">
                Navigate to the Backtesting section:
              </p>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground mt-1">
                <li>Click the "Backtesting" button in the main navigation</li>
                <li>Alternatively, click the "Run Backtest" button in the Strategy Builder toolbar</li>
                <li>Your current strategy will automatically be loaded into the backtesting module</li>
              </ol>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Step 3: Define Backtest Parameters</h3>
              <p className="text-sm text-muted-foreground">
                Configure the following backtesting parameters:
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground mt-1">
                <li><strong>Date Range:</strong> Select the historical period to test</li>
                <li><strong>Initial Capital:</strong> Set the starting capital amount</li>
                <li><strong>Commission Settings:</strong> Configure trading costs</li>
                <li><strong>Slippage Model:</strong> Adjust for execution price differences</li>
                <li><strong>Position Sizing:</strong> Define how much capital to allocate per trade</li>
                <li><strong>Data Frequency:</strong> Choose between different data resolutions</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Step 4: Run the Backtest</h3>
              <p className="text-sm text-muted-foreground">
                Execute the backtest process:
              </p>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground mt-1">
                <li>Review all settings to ensure they're correctly configured</li>
                <li>Click the "Run Backtest" button to start the simulation</li>
                <li>Wait for the process to complete (duration depends on data size and strategy complexity)</li>
                <li>The system will display a progress indicator during processing</li>
              </ol>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Step 5: Review Results</h3>
              <p className="text-sm text-muted-foreground">
                After the backtest completes, you'll be taken to the Results Dashboard where you can:
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground mt-1">
                <li>View performance metrics like total return, drawdown, and Sharpe ratio</li>
                <li>Analyze equity curve and drawdown charts</li>
                <li>Examine detailed trade list with entry/exit points</li>
                <li>Review monthly and annual performance breakdowns</li>
                <li>Export results for further analysis</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="parameters" className="space-y-4 mt-4">
          <h2 className="text-2xl font-bold tracking-tight">Backtest Parameter Settings</h2>
          <p>
            Understand each parameter in the backtesting configuration panel:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Date Range</CardTitle>
                <CardDescription>Define the historical period to test</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Start Date:</strong> Beginning of the test period</li>
                  <li><strong>End Date:</strong> End of the test period</li>
                  <li><strong>Preset Periods:</strong> Quick selection of common periods (1M, 3M, 6M, 1Y, 3Y, 5Y, Max)</li>
                  <li><strong>Data Availability:</strong> Varies by instrument and may limit available date ranges</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Initial Capital</CardTitle>
                <CardDescription>Starting capital for the simulation</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Amount:</strong> Starting capital in your account currency</li>
                  <li><strong>Currency:</strong> Base currency for calculations</li>
                  <li><strong>Impact:</strong> Affects position sizing and total return calculations</li>
                  <li><strong>Default:</strong> ₹100,000 for INR accounts, $10,000 for USD accounts</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Commission Settings</CardTitle>
                <CardDescription>Trading costs applied to simulated trades</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Commission Model:</strong> Fixed, Percentage, or Exchange-specific</li>
                  <li><strong>Per Trade:</strong> Applied to each executed order</li>
                  <li><strong>Per Share/Lot:</strong> Applied to each unit traded</li>
                  <li><strong>Exchange Fees:</strong> Additional regulatory and exchange fees</li>
                  <li><strong>Preset Brokers:</strong> Quick selection of common broker commission structures</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Slippage Model</CardTitle>
                <CardDescription>Simulates execution price differences</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Fixed Pips:</strong> Constant slippage amount</li>
                  <li><strong>Percentage:</strong> Slippage as a percentage of price</li>
                  <li><strong>Spread-Based:</strong> Varies based on historical spreads</li>
                  <li><strong>Volatility-Based:</strong> Scales with market volatility</li>
                  <li><strong>Random:</strong> Varies within a specified range</li>
                  <li><strong>None:</strong> No slippage (ideal case)</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Position Sizing</CardTitle>
                <CardDescription>Determines capital allocation per trade</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Fixed Size:</strong> Constant lot/share quantity</li>
                  <li><strong>Fixed Value:</strong> Consistent position value in currency</li>
                  <li><strong>Percentage of Capital:</strong> Scales with account balance</li>
                  <li><strong>Risk-Based:</strong> Sizes based on stop-loss distance</li>
                  <li><strong>Kelly Criterion:</strong> Adaptive sizing based on win rate and risk/reward</li>
                  <li><strong>Custom Formula:</strong> Advanced custom sizing logic</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Data Frequency</CardTitle>
                <CardDescription>Granularity of historical data</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Default:</strong> Matches the timeframe selected in the Start Node</li>
                  <li><strong>Tick Data:</strong> Highest precision, every price change</li>
                  <li><strong>Minute Data:</strong> 1-minute to 60-minute candles</li>
                  <li><strong>Hourly Data:</strong> 1-hour to 24-hour candles</li>
                  <li><strong>Daily Data:</strong> End-of-day data</li>
                  <li><strong>Weekly/Monthly:</strong> Longer timeframes for trend strategies</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Max Open Positions</CardTitle>
                <CardDescription>Limits concurrent open trades</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Global Limit:</strong> Maximum positions across all instruments</li>
                  <li><strong>Per Instrument:</strong> Maximum positions in a single instrument</li>
                  <li><strong>Per Direction:</strong> Separate limits for long and short positions</li>
                  <li><strong>Unlimited:</strong> No restriction on position count</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Advanced Settings</CardTitle>
                <CardDescription>Additional configuration options</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Initial Lookback Period:</strong> Data needed before strategy starts</li>
                  <li><strong>Margin Requirements:</strong> Leverage and margin call settings</li>
                  <li><strong>Maximum Drawdown Stop:</strong> Halts testing if drawdown exceeds threshold</li>
                  <li><strong>Trade Execution Timing:</strong> When trades execute (on close, next open, etc.)</li>
                  <li><strong>Market Hours:</strong> Trading session limitations</li>
                  <li><strong>Event Calendar:</strong> Factors affecting trading (earnings, economic releases)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 mt-4">
            <InfoCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Start with default parameters and then adjust one parameter at a time 
              to understand how each affects your strategy's performance. This methodical approach helps 
              isolate the impact of individual settings.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Interpreting Backtest Results</h2>
        <p>
          After running a backtest, you'll receive comprehensive results that require careful interpretation:
        </p>
        
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Key Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Return Metrics</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                  <li><strong>Total Return:</strong> Overall percentage gain/loss</li>
                  <li><strong>Annualized Return:</strong> Return normalized to yearly rate</li>
                  <li><strong>Daily/Monthly Returns:</strong> Period-specific performance</li>
                  <li><strong>Risk-Adjusted Return:</strong> Return relative to risk taken</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium">Risk Metrics</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                  <li><strong>Maximum Drawdown:</strong> Largest peak-to-trough decline</li>
                  <li><strong>Volatility:</strong> Standard deviation of returns</li>
                  <li><strong>Value at Risk (VaR):</strong> Potential loss with 95% confidence</li>
                  <li><strong>Recovery Factor:</strong> Return divided by max drawdown</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium">Trade Statistics</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                  <li><strong>Win Rate:</strong> Percentage of profitable trades</li>
                  <li><strong>Profit Factor:</strong> Gross profit divided by gross loss</li>
                  <li><strong>Average Trade:</strong> Mean profit/loss per trade</li>
                  <li><strong>Average Winners/Losers:</strong> Mean profit/loss for winning/losing trades</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium">Timing Metrics</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                  <li><strong>Average Holding Period:</strong> Mean duration of trades</li>
                  <li><strong>Time in Market:</strong> Percentage of time with open positions</li>
                  <li><strong>Best/Worst Month:</strong> Highest/lowest monthly returns</li>
                  <li><strong>Monthly/Annual Distribution:</strong> Return patterns over time</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Visualization Tools</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The Results Dashboard provides visual representations of your backtest results:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>
                <strong>Equity Curve:</strong> Line chart showing account balance over time
                <ul className="list-disc pl-5">
                  <li><strong>Y-axis:</strong> Account balance or percentage return</li>
                  <li><strong>X-axis:</strong> Time period of the backtest</li>
                  <li><strong>Benchmark Comparison:</strong> Optional overlay of market benchmark</li>
                </ul>
              </li>
              <li>
                <strong>Drawdown Chart:</strong> Visualizes depth and duration of drawdowns
                <ul className="list-disc pl-5">
                  <li><strong>Y-axis:</strong> Percentage drawdown from peak</li>
                  <li><strong>X-axis:</strong> Time period of the backtest</li>
                  <li><strong>Display:</strong> Typically shown as negative values below zero</li>
                </ul>
              </li>
              <li>
                <strong>Trade Distribution:</strong> Histogram of trade profits/losses
                <ul className="list-disc pl-5">
                  <li><strong>Y-axis:</strong> Number of trades</li>
                  <li><strong>X-axis:</strong> Profit/loss ranges</li>
                  <li><strong>Colors:</strong> Profitable trades (green) vs. losing trades (red)</li>
                </ul>
              </li>
              <li>
                <strong>Monthly/Annual Returns:</strong> Heatmap or bar chart of period returns
                <ul className="list-disc pl-5">
                  <li><strong>Colors:</strong> Intensity indicates performance level</li>
                  <li><strong>Layout:</strong> Months as rows, years as columns (heatmap)</li>
                  <li><strong>Pattern Analysis:</strong> Helps identify seasonal patterns</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-medium mb-2">Trade List Analysis</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The detailed trade list provides information about each individual trade:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li><strong>Entry Date/Time:</strong> When the position was opened</li>
              <li><strong>Exit Date/Time:</strong> When the position was closed</li>
              <li><strong>Direction:</strong> Long or short position</li>
              <li><strong>Entry/Exit Price:</strong> Prices at which the trade was executed</li>
              <li><strong>Position Size:</strong> Number of shares/contracts/lots</li>
              <li><strong>Profit/Loss:</strong> Absolute and percentage gain/loss</li>
              <li><strong>Duration:</strong> How long the position was held</li>
              <li><strong>Exit Reason:</strong> What triggered the position closure</li>
              <li><strong>MAE/MFE:</strong> Maximum adverse/favorable excursion (worst/best point during trade)</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Analyzing the trade list helps identify patterns in winning and losing trades, and may reveal 
              opportunities for strategy improvement.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Optimization and Monte Carlo Analysis</h2>
        <p>
          Beyond basic backtesting, advanced analysis tools help validate and improve your strategy:
        </p>
        
        <Tabs defaultValue="optimization">
          <TabsList>
            <TabsTrigger value="optimization">Parameter Optimization</TabsTrigger>
            <TabsTrigger value="monte-carlo">Monte Carlo Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="optimization" className="space-y-4 mt-4">
            <p>
              Parameter optimization tests multiple variations of your strategy to find the best-performing parameters:
            </p>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">How to Run Parameter Optimization</h3>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground">
                <li>Click the "Optimize" button in the Backtesting interface</li>
                <li>Select parameters to optimize (e.g., indicator periods, entry/exit thresholds)</li>
                <li>Define parameter ranges (start, end, step size)</li>
                <li>Choose optimization objective (e.g., maximize return, Sharpe ratio, win rate)</li>
                <li>Set constraints (e.g., minimum trade count, maximum drawdown)</li>
                <li>Select optimization method (e.g., grid search, genetic algorithm)</li>
                <li>Click "Run Optimization" to begin the process</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-2">
                Results are presented in a table showing performance metrics for each parameter combination, 
                and in heat maps or 3D surfaces for visual analysis.
              </p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
              <h3 className="font-medium mb-2">Warning: Curve-Fitting Risk</h3>
              <p className="text-sm text-muted-foreground">
                Be cautious about over-optimization (curve-fitting), where your strategy becomes too tailored 
                to historical data and performs poorly on new data. To mitigate this risk:
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground mt-1">
                <li>Use out-of-sample testing (test on data not used for optimization)</li>
                <li>Focus on robust parameter areas rather than perfect settings</li>
                <li>Favor strategies that perform well across a range of parameters</li>
                <li>Consider the theoretical basis for parameter choices, not just performance</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="monte-carlo" className="space-y-4 mt-4">
            <p>
              Monte Carlo analysis uses randomization to test your strategy's robustness under different conditions:
            </p>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Monte Carlo Simulation Types</h3>
              <ul className="list-disc pl-6 text-sm text-muted-foreground">
                <li>
                  <strong>Trade Reordering:</strong> Shuffles the sequence of historical trades
                  <p className="ml-6 mt-1">Tests how trade order affects overall performance</p>
                </li>
                <li>
                  <strong>Trade Parameter Randomization:</strong> Varies entry/exit prices within slippage ranges
                  <p className="ml-6 mt-1">Tests sensitivity to execution quality</p>
                </li>
                <li>
                  <strong>Market Data Randomization:</strong> Creates synthetic data series with similar properties
                  <p className="ml-6 mt-1">Tests performance on market conditions not seen in historical data</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">How to Run Monte Carlo Analysis</h3>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground">
                <li>Run a standard backtest first to establish baseline performance</li>
                <li>Click the "Monte Carlo" button in the Results Dashboard</li>
                <li>Select the simulation type (reordering, parameter randomization, etc.)</li>
                <li>Set the number of simulation runs (typically 1,000+)</li>
                <li>Configure additional parameters specific to the simulation type</li>
                <li>Click "Run Simulation" to begin the process</li>
              </ol>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="font-medium mb-2">Interpreting Monte Carlo Results</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Monte Carlo analysis provides statistical distributions rather than single values:
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground">
                <li><strong>Confidence Intervals:</strong> Range of likely outcomes (e.g., 95% confidence)</li>
                <li><strong>Probability Metrics:</strong> Likelihood of achieving specific performance levels</li>
                <li><strong>Worst-Case Scenarios:</strong> Analysis of potential maximum drawdowns</li>
                <li><strong>System Resilience:</strong> Impact of outlier trades on overall performance</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Results are typically displayed as probability distributions, confidence bands on equity curves, 
                and statistical summary tables.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-bold tracking-tight mb-4">Backtesting Best Practices</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Do's</h3>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Use sufficient historical data (ideally covering multiple market cycles)</li>
              <li>Include realistic trading costs (commissions, slippage, spreads)</li>
              <li>Test your strategy across different market conditions</li>
              <li>Use out-of-sample testing to validate optimization results</li>
              <li>Analyze both aggregate metrics and individual trades</li>
              <li>Consider position sizing impact on overall performance</li>
              <li>Compare results to relevant benchmarks</li>
              <li>Document your testing process and assumptions</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Don'ts</h3>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Ignore trading costs and slippage (leads to overly optimistic results)</li>
              <li>Over-optimize parameters to fit historical data</li>
              <li>Rely solely on total return as a performance metric</li>
              <li>Ignore drawdowns and risk metrics</li>
              <li>Test on too little data or only one market condition</li>
              <li>Assume backtested performance will match live trading exactly</li>
              <li>Use future information that wouldn't be available in real-time</li>
              <li>Change your strategy based on a single backtest run</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestingDoc;
