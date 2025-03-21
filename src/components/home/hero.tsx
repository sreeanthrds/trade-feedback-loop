
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-background to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content Column */}
          <div className="lg:col-span-6 animate-slide-up">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>Master trading without the risk</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Backtest Your Trading Ideas with Precision
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
              Build, test, and optimize strategies without risking a dime. Find what works before committing real capital. Start for free today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link to="/signup" className="btn-primary flex items-center justify-center group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link to="#demo" className="btn-outlined flex items-center justify-center group">
                <Play className="mr-2 h-5 w-5 text-success" />
                Watch Demo
              </Link>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="lg:col-span-6 animate-slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-success/20 to-transparent rounded-2xl blur-3xl opacity-30"></div>
              <div className="relative glass-card dark:glass-card-dark overflow-hidden rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 animate-float">
                {/* Mock Trading Dashboard */}
                <div className="bg-dark-subtle p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-danger"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-success"></div>
                  </div>
                  <div className="text-xs text-white/70">Backtest Results - Strategy #1</div>
                </div>
                
                <div className="p-4 bg-dark text-white">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-dark-subtle p-3 rounded-lg">
                      <div className="text-xs text-white/70 mb-1">Net Profit</div>
                      <div className="text-lg font-semibold text-success">+$8,245.32</div>
                    </div>
                    <div className="bg-dark-subtle p-3 rounded-lg">
                      <div className="text-xs text-white/70 mb-1">Win Rate</div>
                      <div className="text-lg font-semibold text-white">68.5%</div>
                    </div>
                  </div>
                  
                  {/* Chart SVG */}
                  <svg className="w-full h-44" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M0,80 L40,70 L80,75 L120,60 L160,65 L200,40 L240,45 L280,30 L320,15 L360,20 L400,10" 
                      stroke="#00C853" 
                      strokeWidth="2"
                      className="chart-line"
                    />
                    {/* Buy/Sell Signals */}
                    <circle cx="120" cy="60" r="4" fill="#00C853" />
                    <circle cx="200" cy="40" r="4" fill="#00C853" />
                    <circle cx="320" cy="15" r="4" fill="#FF5252" />
                  </svg>
                  
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {/* Strategy Parameters */}
                    <div className="bg-dark-subtle p-2 rounded-lg text-center">
                      <div className="text-xs text-white/70">Trades</div>
                      <div className="text-sm font-medium">142</div>
                    </div>
                    <div className="bg-dark-subtle p-2 rounded-lg text-center">
                      <div className="text-xs text-white/70">Period</div>
                      <div className="text-sm font-medium">6M</div>
                    </div>
                    <div className="bg-dark-subtle p-2 rounded-lg text-center">
                      <div className="text-xs text-white/70">Drawdown</div>
                      <div className="text-sm font-medium text-danger">12.4%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
