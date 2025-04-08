
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import StrategyCard from '@/components/strategies/StrategyCard';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Strategy {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  created: string;
  returns?: number;
}

// Mock user state - in a real app, this would come from authentication
const mockUserLoggedIn = true; // Toggle this to test both states

const StrategiesLanding = () => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [strategyName, setStrategyName] = useState("My New Strategy");
  
  // In a real app, we'd fetch strategies from a backend
  // For now, we'll use sample data
  useEffect(() => {
    // Simulating fetching strategies
    const sampleStrategies = [
      {
        id: "strategy1",
        name: "Moving Average Crossover",
        description: "A trend-following strategy that uses the crossing of two moving averages to generate buy and sell signals.",
        lastModified: format(new Date(2023, 3, 15), 'MMM d, yyyy'),
        created: format(new Date(2023, 2, 10), 'MMM d, yyyy'),
        returns: 12.5
      },
      {
        id: "strategy2",
        name: "RSI Oscillator",
        description: "Uses the Relative Strength Index to identify overbought and oversold conditions in the market.",
        lastModified: format(new Date(2023, 3, 10), 'MMM d, yyyy'),
        created: format(new Date(2023, 1, 20), 'MMM d, yyyy'),
        returns: -3.2
      },
      {
        id: "strategy3",
        name: "MACD Divergence",
        description: "Identifies divergences between price action and the MACD indicator to spot potential trend reversals.",
        lastModified: format(new Date(2023, 2, 28), 'MMM d, yyyy'),
        created: format(new Date(2023, 0, 15), 'MMM d, yyyy'),
        returns: 8.7
      },
      {
        id: "strategy4",
        name: "Bollinger Bands Squeeze",
        description: "Detects low volatility periods using Bollinger Bands compression, preparing for breakout trades.",
        lastModified: format(new Date(2023, 3, 5), 'MMM d, yyyy'),
        created: format(new Date(2023, 2, 1), 'MMM d, yyyy')
      }
    ];
    
    // Only show strategies if the user is logged in
    setStrategies(mockUserLoggedIn ? sampleStrategies : []);
  }, []);

  const handleDeleteStrategy = (id: string) => {
    setStrategies(prevStrategies => prevStrategies.filter(strategy => strategy.id !== id));
  };

  const handleCreateStrategy = () => {
    setShowNameDialog(true);
  };

  const handleSubmitStrategyName = () => {
    // Validate that strategy name is not empty
    if (!strategyName.trim()) {
      toast({
        title: "Strategy name required",
        description: "Please enter a name for your strategy",
        variant: "destructive"
      });
      return;
    }

    // Redirect to strategy builder with the name
    // In a real app, you'd create the strategy first and then redirect
    toast({
      title: "Strategy created",
      description: `Created strategy: ${strategyName}`
    });
    
    setShowNameDialog(false);
    
    // In a real app, you'd redirect to the strategy builder here
    // For now, we'll just close the dialog
    window.location.href = `/app/strategy-builder/new?name=${encodeURIComponent(strategyName)}`;
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Strategies</h1>
          <p className="text-muted-foreground">
            Create, manage and backtest your trading strategies
          </p>
        </div>
        <Button onClick={handleCreateStrategy} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>New Strategy</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {strategies.length > 0 ? (
          strategies.map((strategy) => (
            <StrategyCard 
              key={strategy.id} 
              {...strategy} 
              onDelete={handleDeleteStrategy}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 border border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground mb-4">You haven't created any strategies yet</p>
            <Button onClick={handleCreateStrategy}>
              Create Your First Strategy
            </Button>
          </div>
        )}
      </div>

      {/* Strategy Name Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Name Your Strategy</DialogTitle>
            <DialogDescription>
              Give your strategy a unique, descriptive name.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Strategy Name</Label>
                <Input
                  id="name"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  placeholder="Enter strategy name"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitStrategyName}>
              Create Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategiesLanding;
