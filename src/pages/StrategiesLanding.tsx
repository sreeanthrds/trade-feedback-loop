
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useStrategies } from '@/hooks/useStrategies';
import StrategiesHeader from '@/components/strategies/StrategiesHeader';
import StrategiesList from '@/components/strategies/StrategiesList';
import CreateStrategyDialog from '@/components/strategies/CreateStrategyDialog';
import { useAuth } from '@/contexts/AuthContext';

const StrategiesLanding = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { strategies, isLoading, refreshStrategies, deleteStrategy } = useStrategies();
  const { isAuthenticated } = useAuth();
  
  const [showNameDialog, setShowNameDialog] = useState(false);
  
  const handleDeleteStrategy = (id: string) => {
    const success = deleteStrategy(id);
    if (success) {
      toast({
        title: "Strategy deleted",
        description: `Strategy has been removed.`,
      });
    }
  };

  const handleCreateStrategy = () => {
    setShowNameDialog(true);
  };

  const handleSubmitStrategyName = (strategyName: string) => {
    // Validate that strategy name is not empty
    if (!strategyName.trim()) {
      toast({
        title: "Strategy name required",
        description: "Please enter a name for your strategy",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate strategy names
    const isDuplicate = strategies.some(
      strategy => strategy.name.toLowerCase() === strategyName.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate name",
        description: "A strategy with this name already exists. Please use a different name.",
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

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <StrategiesHeader 
        onRefresh={refreshStrategies} 
        onCreateStrategy={handleCreateStrategy} 
      />
      
      <StrategiesList 
        strategies={strategies} 
        isLoading={isLoading} 
        onDeleteStrategy={handleDeleteStrategy}
        onCreateStrategy={handleCreateStrategy}
      />

      <CreateStrategyDialog 
        open={showNameDialog}
        onOpenChange={setShowNameDialog}
        onSubmit={handleSubmitStrategyName}
        defaultName="My New Strategy"
      />
    </div>
  );
};

export default StrategiesLanding;
