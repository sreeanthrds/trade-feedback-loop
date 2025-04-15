
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { LineChart, TrendingUp, Clock, Workflow, ChevronRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Advanced Backtesting Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analyze trading strategies across different market conditions, volatility regimes, and sectors.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/app/backtesting')}
              className="gap-2"
            >
              Run Backtest <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/app/dashboard')}
              className="gap-2"
            >
              View Sample Results <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Performance Analysis</h3>
                <p className="text-muted-foreground">
                  Comprehensive metrics and visualizations to evaluate strategy performance.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Market Regimes</h3>
                <p className="text-muted-foreground">
                  Understand how your strategy performs in different market conditions.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Historical Testing</h3>
                <p className="text-muted-foreground">
                  Test strategies across different time periods and market cycles.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Workflow className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Strategy Optimization</h3>
                <p className="text-muted-foreground">
                  Refine parameters and optimize strategies for different market conditions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Design Your Strategy</h3>
                <p className="text-muted-foreground">
                  Use our strategy builder to create custom trading strategies with various signals, indicators, and conditions.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Run Backtests</h3>
                <p className="text-muted-foreground">
                  Test your strategies against historical market data across different instruments and timeframes.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Analyze Results</h3>
                <p className="text-muted-foreground">
                  Examine performance across market regimes, volatility conditions, and sectors using our advanced dashboards.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Optimize and Refine</h3>
                <p className="text-muted-foreground">
                  Use the insights to refine your strategy parameters and improve performance in various market conditions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/app/strategy-builder')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
