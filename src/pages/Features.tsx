
import React, { useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MousePointer, 
  Database, 
  BarChart, 
  Sliders, 
  Users
} from 'lucide-react';

const FeatureSection = ({ 
  title, 
  description, 
  icon, 
  image, 
  reversed = false 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  image: React.ReactNode;
  reversed?: boolean;
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 md:py-24`}>
      <div className={`${reversed ? 'lg:order-2' : ''} animate-slide-up`}>
        <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-success/10 border border-success/20">
          {icon}
          <span className="ml-2 text-sm font-medium text-success">{title}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
        <p className="text-lg text-foreground/70 mb-6">{description}</p>
        <Link to="/signup" className="btn-outlined inline-flex items-center group">
          Try It Free
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className={`${reversed ? 'lg:order-1' : ''}`}>
        {image}
      </div>
    </div>
  );
};

const Features = () => {
  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 animate-slide-down">
              Everything You Need to Master Your Trades
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8 animate-slide-up">
              Our comprehensive set of tools empowers traders at every level to refine strategies, minimize risk, and maximize potential returns.
            </p>
          </div>
        </section>
        
        {/* Feature Sections */}
        <section className="container mx-auto px-4 md:px-6">
          {/* No-Code Backtesting */}
          <FeatureSection
            title="No-Code Backtesting"
            description="Our intuitive drag-and-drop interface makes it simple to test trading strategies without writing a single line of code. Build complex conditions, set entry and exit rules, and analyze results — all with a few clicks."
            icon={<MousePointer className="h-4 w-4 text-success" />}
            image={
              <div className="glass-card dark:glass-card-dark p-6 rounded-2xl shadow-lg animate-float">
                <div className="bg-dark-subtle p-4 rounded-xl mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-medium text-white">Strategy Builder</div>
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-danger"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark p-3 rounded-lg">
                      <div className="text-xs text-white/70 mb-1">Entry Condition</div>
                      <div className="flex items-center text-sm text-white">
                        <div className="h-4 w-4 bg-success/20 rounded mr-2"></div>
                        RSI &lt; 30
                      </div>
                    </div>
                    <div className="bg-dark p-3 rounded-lg">
                      <div className="text-xs text-white/70 mb-1">Exit Condition</div>
                      <div className="flex items-center text-sm text-white">
                        <div className="h-4 w-4 bg-danger/20 rounded mr-2"></div>
                        RSI &gt; 70
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-foreground/70 mb-4">Drag & Drop Components</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/50 p-2 rounded-lg text-center text-sm">Indicators</div>
                  <div className="bg-secondary/50 p-2 rounded-lg text-center text-sm">Conditions</div>
                  <div className="bg-secondary/50 p-2 rounded-lg text-center text-sm">Actions</div>
                </div>
              </div>
            }
          />
          
          {/* Historical Data */}
          <FeatureSection
            title="Historical Data"
            description="Backtest with years of accurate tick-by-tick data across multiple markets. Our comprehensive database covers stocks, forex, futures, and cryptocurrencies with clean, split-adjusted data you can trust."
            icon={<Database className="h-4 w-4 text-success" />}
            image={
              <div className="glass-card dark:glass-card-dark p-6 rounded-2xl shadow-lg animate-float">
                <div className="bg-dark-subtle p-4 rounded-xl mb-4">
                  <div className="text-sm font-medium text-white mb-3">Data Coverage</div>
                  <div className="h-6 w-full bg-dark rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-success to-success/70 w-4/5"></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <span>2010</span>
                    <span>2015</span>
                    <span>2020</span>
                    <span>2025</span>
                  </div>
                </div>
                <div className="text-sm text-foreground/70 mb-4">Markets Covered</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm">Stocks</span>
                      <span className="text-xs text-success">10,000+ symbols</span>
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm">Forex</span>
                      <span className="text-xs text-success">28 pairs</span>
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm">Crypto</span>
                      <span className="text-xs text-success">50+ coins</span>
                    </div>
                  </div>
                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm">Futures</span>
                      <span className="text-xs text-success">All major</span>
                    </div>
                  </div>
                </div>
              </div>
            }
            reversed
          />
          
          {/* Performance Analytics */}
          <FeatureSection
            title="Performance Analytics"
            description="Dive deep into your strategy's performance metrics. Analyze win rates, profit factors, drawdowns, and more. Our visualization tools make it easy to identify strengths and weaknesses in your approach."
            icon={<BarChart className="h-4 w-4 text-success" />}
            image={
              <div className="glass-card dark:glass-card-dark p-6 rounded-2xl shadow-lg animate-float">
                <div className="bg-dark-subtle p-4 rounded-xl mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-dark p-3 rounded-lg">
                      <div className="text-xs text-white/70 mb-1">Win Rate</div>
                      <div className="text-lg font-semibold text-white">68.5%</div>
                    </div>
                    <div className="bg-dark p-3 rounded-lg">
                      <div className="text-xs text-white/70 mb-1">Profit Factor</div>
                      <div className="text-lg font-semibold text-white">2.4</div>
                    </div>
                  </div>
                  <div className="h-24 bg-dark rounded-lg p-2">
                    <svg className="w-full h-full" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0,50 L20,45 L40,48 L60,35 L80,40 L100,25 L120,30 L140,20 L160,10 L180,15 L200,5" 
                        stroke="#00C853" strokeWidth="2" className="chart-line" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-foreground/70 mb-4">Key Metrics</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/50 p-2 rounded-lg text-center">
                    <div className="text-xs text-foreground/70">Max DD</div>
                    <div className="text-sm font-medium text-danger">15.2%</div>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg text-center">
                    <div className="text-xs text-foreground/70">Avg Hold</div>
                    <div className="text-sm font-medium">2.3 days</div>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg text-center">
                    <div className="text-xs text-foreground/70">Sharpe</div>
                    <div className="text-sm font-medium text-success">1.8</div>
                  </div>
                </div>
              </div>
            }
          />
          
          {/* Custom Strategies */}
          <FeatureSection
            title="Custom Strategies"
            description="Fine-tune your trading approach with adjustable parameters. Optimize stop-loss levels, take-profit targets, position sizing, and more to find the perfect balance between risk and reward."
            icon={<Sliders className="h-4 w-4 text-success" />}
            image={
              <div className="glass-card dark:glass-card-dark p-6 rounded-2xl shadow-lg animate-float">
                <div className="bg-dark-subtle p-4 rounded-xl mb-4">
                  <div className="text-sm font-medium text-white mb-4">Strategy Parameters</div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>Stop Loss</span>
                        <span>2.5%</span>
                      </div>
                      <div className="h-2 w-full bg-dark rounded-full overflow-hidden">
                        <div className="h-full bg-danger w-1/4"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>Take Profit</span>
                        <span>5.0%</span>
                      </div>
                      <div className="h-2 w-full bg-dark rounded-full overflow-hidden">
                        <div className="h-full bg-success w-1/2"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>Position Size</span>
                        <span>15%</span>
                      </div>
                      <div className="h-2 w-full bg-dark rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 w-3/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-foreground/70 mb-4">Optimization Results</div>
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full bg-success"></div>
                    <span className="text-sm">Optimal configuration found</span>
                  </div>
                  <div className="text-xs text-foreground/70 mt-1">
                    Expected annual return: 24.8%
                  </div>
                </div>
              </div>
            }
            reversed
          />
          
          {/* Community Sharing */}
          <FeatureSection
            title="Community Sharing"
            description="Learn from others or share your winning strategies with our growing community of traders. Explore trending strategies, collaborate with fellow users, and accelerate your trading journey through collective wisdom."
            icon={<Users className="h-4 w-4 text-success" />}
            image={
              <div className="glass-card dark:glass-card-dark p-6 rounded-2xl shadow-lg animate-float">
                <div className="bg-dark-subtle p-4 rounded-xl mb-4">
                  <div className="text-sm font-medium text-white mb-3">Popular Strategies</div>
                  <div className="space-y-3">
                    <div className="bg-dark p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="text-sm text-white">RSI Reversal</div>
                        <div className="text-xs text-white/70">by Michael K.</div>
                      </div>
                      <div className="text-xs text-success bg-success/10 px-2 py-1 rounded">
                        +32.4%
                      </div>
                    </div>
                    <div className="bg-dark p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="text-sm text-white">MACD Cross</div>
                        <div className="text-xs text-white/70">by Sarah J.</div>
                      </div>
                      <div className="text-xs text-success bg-success/10 px-2 py-1 rounded">
                        +18.7%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-foreground/70 mb-4">Community Activity</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary/50 p-2 rounded-lg text-center">
                    <div className="text-xs text-foreground/70">Members</div>
                    <div className="text-sm font-medium">10K+</div>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg text-center">
                    <div className="text-xs text-foreground/70">Strategies</div>
                    <div className="text-sm font-medium">4.8K</div>
                  </div>
                  <div className="bg-secondary/50 p-2 rounded-lg text-center">
                    <div className="text-xs text-foreground/70">Comments</div>
                    <div className="text-sm font-medium">12K+</div>
                  </div>
                </div>
              </div>
            }
          />
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">
              Ready to Elevate Your Trading?
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8 animate-slide-up">
              Start backtesting your strategies today and discover what really works.
            </p>
            <Link to="/signup" className="btn-primary inline-flex items-center animate-slide-up">
              Try Free for 14 Days
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
