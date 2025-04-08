
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import StrategyCard from '@/components/strategies/StrategyCard';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getStrategiesList, deleteStrategy } from '@/components/strategy/utils/storage/localStorageUtils';

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
  const [isLoading, setIsLoading] = useState(true);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [strategyName, setStrategyName] = useState("My New Strategy");
  const navigate = useNavigate();
  
  // Load strategies from localStorage
  const loadStrategies = () => {
    setIsLoading(true);
    try {
      if (mockUserLoggedIn) {
        const savedStrategies = getStrategiesList();
        console.log("Loaded strategies:", savedStrategies);
        
        // Format dates for display
        const formattedStrategies = savedStrategies.map((strategy: any) => ({
          ...strategy,
          lastModified: strategy.lastModified 
            ? format(new Date(strategy.lastModified), 'MMM d, yyyy')
            : format(new Date(), 'MMM d, yyyy'),
          created: strategy.created
            ? format(new Date(strategy.created), 'MMM d, yyyy')
            : format(new Date(), 'MMM d, yyyy')
        }));
        
        setStrategies(formattedStrategies);
      } else {
        setStrategies([]);
      }
    } catch (error) {
      console.error("Error loading strategies:", error);
      toast({
        title: "Error loading strategies",
        description: "There was a problem loading your strategies.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadStrategies();
    
    // Set up an event listener to reload strategies when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'strategies' || e.key?.startsWith('strategy_')) {
        loadStrategies();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDeleteStrategy = (id: string) => {
    const success = deleteStrategy(id);
    if (success) {
      setStrategies(prevStrategies => prevStrategies.filter(strategy => strategy.id !== id));
    }
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

    // Create unique ID for the new strategy
    const strategyId = `strategy-${Date.now()}`;
    
    setShowNameDialog(false);
    
    toast({
      title: "Strategy created",
      description: `Created strategy: ${strategyName}`
    });
    
    // Navigate to strategy builder with ID and name
    navigate(`/app/strategy-builder?id=${strategyId}&name=${encodeURIComponent(strategyName)}`);
  };

  const handleRefreshStrategies = () => {
    loadStrategies();
    toast({
      title: "Strategies refreshed",
      description: "Your strategies list has been refreshed"
    });
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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefreshStrategies}
            title="Refresh strategies list"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleCreateStrategy} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Strategy</span>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-lg bg-muted/40 animate-pulse"></div>
          ))}
        </div>
      ) : (
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
      )}

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
