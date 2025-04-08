
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (strategyName: string) => void;
  defaultName?: string;
}

const CreateStrategyDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  defaultName = "My New Strategy"
}: CreateStrategyDialogProps) => {
  const [strategyName, setStrategyName] = useState(defaultName);

  // Reset the strategy name when the dialog is opened
  useEffect(() => {
    if (open) {
      setStrategyName(defaultName);
    }
  }, [open, defaultName]);

  const handleSubmit = () => {
    onSubmit(strategyName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                autoFocus
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Strategy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStrategyDialog;
