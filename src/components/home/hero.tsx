
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-background to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content Column */}
          <div className="lg:col-span-6 animate-slide-up">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <span>Backtest Trading Strategies</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-serif font-bold tracking-tight mb-6">
              Plan. Backtest. <span className="text-primary">Trade.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
              Build, test, and optimize strategies for the Indian market without risking capital. Try our simulator today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link to="/signup" className="btn-primary flex items-center justify-center group">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link to="#demo" className="btn-outlined flex items-center justify-center group">
                <Play className="mr-2 h-5 w-5 text-primary" />
                Watch Demo
              </Link>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="lg:col-span-6 animate-slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-3xl opacity-30"></div>
              <div className="relative bg-white dark:bg-gray-800 overflow-hidden rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-float">
                {/* Mock Trading Dashboard */}
                <div className="bg-gray-100 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Backtest Results - Nifty50 Strategy</div>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Net Profit</div>
                      <div className="text-lg font-semibold text-green-500">+₹82,245</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Win Rate</div>
                      <div className="text-lg font-semibold text-gray-800 dark:text-white">68.5%</div>
                    </div>
                  </div>
                  
                  {/* Chart SVG */}
                  <svg className="w-full h-44" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M0,80 L40,70 L80,75 L120,60 L160,65 L200,40 L240,45 L280,30 L320,15 L360,20 L400,10" 
                      stroke="#3B82F6" 
                      strokeWidth="2"
                      className="chart-line"
                    />
                    {/* Buy/Sell Signals */}
                    <circle cx="120" cy="60" r="4" fill="#3B82F6" />
                    <circle cx="200" cy="40" r="4" fill="#3B82F6" />
                    <circle cx="320" cy="15" r="4" fill="#EF4444" />
                  </svg>
                  
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {/* Strategy Parameters */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Trades</div>
                      <div className="text-sm font-medium">142</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Period</div>
                      <div className="text-sm font-medium">1M</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Drawdown</div>
                      <div className="text-sm font-medium text-red-500">12.4%</div>
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
